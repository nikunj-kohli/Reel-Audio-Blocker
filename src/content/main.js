// Wait for the DOM to be fully loaded before initializing
async function initialize() {
  const scriptUrls = [
    'utils/logger.js',
    'utils/dom.js',
    'utils/platformDetector.js',
    'platforms/instagram.js',
    'platforms/facebook.js',
    'platforms/youtube.js'
  ];

  // Load all scripts in sequence
  for (const url of scriptUrls) {
    await new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = chrome.runtime.getURL(url);
      script.onload = () => {
        script.onload = null;
        resolve();
      };
      (document.head || document.documentElement).appendChild(script);
    });
  }

  // Wait for the platform to be detected
  return new Promise((resolve) => {
    const checkPlatform = () => {
      if (typeof detectPlatform === 'function' && typeof Logger === 'function') {
        const platform = detectPlatform();
        const logger = new Logger('Content');
        resolve({ platform, logger });
      } else {
        setTimeout(checkPlatform, 50);
      }
    };
    checkPlatform();
  });
}

class ReelBlocker {
  constructor() {
    this.observer = null;
    this.blockedAudio = [];
    this.platformDetector = this.getPlatformDetector();
    this.init();
  }

  getPlatformDetector() {
    switch (platform) {
      case 'instagram': return new InstagramDetector();
      case 'facebook': return new FacebookDetector();
      case 'youtube': return new YouTubeDetector();
      default: return null;
    }
  }

  async init() {
    await this.loadBlockedAudio();
    this.startObserving();
  }

  async loadBlockedAudio() {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        { action: 'getBlockedAudio' },
        (response) => {
          this.blockedAudio = response;
          resolve();
        }
      );
    });
  }

  startObserving() {
    if (!this.platformDetector) return;

    const targetNode = document.body;
    const config = { childList: true, subtree: true };

    this.observer = new MutationObserver(() => {
      this.processReels();
    });

    this.observer.observe(targetNode, config);
    this.processReels(); // Initial check
  }

  async processReels() {
    const reels = this.platformDetector.findReels();
    if (!reels.length) return;

    for (const reel of reels) {
      try {
        const audioInfo = await this.platformDetector.getAudioInfo(reel);
        if (audioInfo && this.shouldBlock(audioInfo)) {
          this.platformDetector.blockReel(reel);
          logger.log(`Blocked reel with audio: ${audioInfo.name}`);
        }
      } catch (error) {
        logger.error('Error processing reel:', error);
      }
    }
  }

  shouldBlock(audioInfo) {
    return this.blockedAudio.some(blocked => 
      audioInfo.name.toLowerCase().includes(blocked.toLowerCase()) ||
      (audioInfo.id && blocked.toLowerCase() === audioInfo.id.toLowerCase())
    );
  }
}

// Initialize the extension
initialize().then(({ platform, logger }) => {
  // Make platform and logger available globally
  window.platform = platform;
  window.logger = logger;
  
  // Initialize ReelBlocker
  new ReelBlocker();
}).catch(error => {
  console.error('Failed to initialize extension:', error);
});