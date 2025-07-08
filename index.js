
chrome.commands.onCommand.addListener(async (command) => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({

    target: { tabId: tab.id },
    args: [command],
    func: (command) => {

      const specialChar = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'en', 'for', 'if', 'in', 'is', 'of', 'on', 'or', 'the', 'to', 'via', 'vs'];


      const converter = {
        "convert-to-titlecase": (str) => {
          return str
            .trim()
            .split(/[_\-.`~|\/\\\s]+/g)
            .filter((s) => s !== '')
            .map((s) => {
              if (specialChar.includes(s)) {
                return s
              } else {
                return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
              }
            })
            .join(' ');
        },

        "convert-to-uppercase": (str) => str.toUpperCase(),
        "convert-to-lowercase": (str) => str.toLowerCase()
      }

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

        const convert = converter[command];

        if (start !== end) {
          const before = activeEl.value.slice(0, start);
          const selected = activeEl.value.slice(start, end);
          const after = activeEl.value.slice(end);
          const converted = convert(selected);

          activeEl.value = before + converted + after;

          // Restore cursor position
          activeEl.selectionStart = activeEl.selectionEnd = start + converted.length;
        }
      }
    },
  });
});

//  Context Menu Creation
chrome.runtime.onInstalled.addListener(() => {
  // For Title Case
  chrome.contextMenus.create({
    id: "convert-to-titlecase",
    title: "Convert to Title Case",
    contexts: ["selection"]
  });

  // For Uppercase
  chrome.contextMenus.create({
    id: 'convert-to-uppercase',
    title: 'Convert to Upper Case',
    contexts: ["selection"]
  });

  // For lower  Case
  chrome.contextMenus.create({
    id: 'convert-to-lowercase',
    title: 'Convert to Lowere Case',
    contexts: ["selection"]
  });

});





