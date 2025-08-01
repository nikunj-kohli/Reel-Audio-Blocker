export const Storage = {
  get: (key) => {
    return new Promise((resolve) => {
      chrome.storage.sync.get(key, (result) => {
        resolve(result[key]);
      });
    });
  },

  set: (key, value) => {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ [key]: value }, () => {
        resolve();
      });
    });
  },

  remove: (key) => {
    return new Promise((resolve) => {
      chrome.storage.sync.remove(key, () => {
        resolve();
      });
    });
  },

  clear: () => {
    return new Promise((resolve) => {
      chrome.storage.sync.clear(() => {
        resolve();
      });
    });
  }
};