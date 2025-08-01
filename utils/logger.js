export class Logger {
  constructor(prefix) {
    this.prefix = prefix;
    this.enabled = false;
    this.init();
  }

  async init() {
    const { enableLogging } = await chrome.storage.sync.get('enableLogging');
    this.enabled = enableLogging || false;
    
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.enableLogging) {
        this.enabled = changes.enableLogging.newValue;
      }
    });
  }

  log(...args) {
    if (this.enabled) {
      console.log(`[${this.prefix}]`, ...args);
    }
  }

  error(...args) {
    if (this.enabled) {
      console.error(`[${this.prefix}]`, ...args);
    }
  }

  warn(...args) {
    if (this.enabled) {
      console.warn(`[${this.prefix}]`, ...args);
    }
  }
}