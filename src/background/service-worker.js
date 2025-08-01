// Event listener for extension installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ blockedAudio: [] });
});

// Communication with content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getBlockedAudio") {
    chrome.storage.sync.get("blockedAudio", (data) => {
      sendResponse(data.blockedAudio || []);
    });
    return true; // Required for async response
  }
});