const convertSelection = () => {
  const specialChar =  ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'en', 'for', 'if', 'in', 'is', 'of', 'on', 'or', 'the', 'to', 'via', 'vs'];

  const titleCase = (str) => {
    return str
      .trim()
      .split(/[_\-.`~|\/\\\s]+/g)
      .filter((s) => s !== '')
      .map((s) =>{
        if (specialChar.includes(s)) {
          return s
        }else{
          return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
        }
      })
      .join(' ');
  };
// for Context Menu
  chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "convert-to-titlecase",
    title: "Convert to Title Case",
    contexts: ["selection"]
  });
});

// for short cut key
  const activeEl = document.activeElement;

  if (
    activeEl &&
    (activeEl.tagName === "TEXTAREA" ||
      (activeEl.tagName === "INPUT" &&
        ["text", "search", "email", "url", "tel"].includes(activeEl.type)))
  ) {
    const start = activeEl.selectionStart;
    const end = activeEl.selectionEnd;

    if (start !== end) {
      const before = activeEl.value.slice(0, start);
      const selected = activeEl.value.slice(start, end);
      const after = activeEl.value.slice(end);
      const titleCased = titleCase(selected);

      activeEl.value = before + titleCased + after;

      // Restore cursor position
      activeEl.selectionStart = activeEl.selectionEnd = start + titleCased.length;
    }
  }
};

chrome.commands.onCommand.addListener(async (command) => {
  if (command === "convert-to-titlecase") {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: convertSelection,
    });
  }
});
