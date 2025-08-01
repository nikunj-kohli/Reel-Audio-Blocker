# Reel Audio Blocker

## Overview
Reel Audio Blocker is a browser extension that allows you to block reels/videos on Instagram, Facebook, and YouTube that use specific audio tracks. If you're tired of seeing content with certain songs or audio clips, this extension gives you control to filter them out.

## How It Works

The extension works by:

1. **Detecting reels/videos**: The extension scans for video content on Instagram, Facebook, and YouTube using DOM manipulation and MutationObserver to detect new content as it loads.

2. **Identifying audio tracks**: When a reel or video is found, the extension extracts information about the audio track being used through platform-specific selectors and APIs.

3. **Blocking unwanted content**: If the audio track matches any in your blocked list, the content is hidden from your feed using CSS modifications.

4. **Cross-platform support**: Works seamlessly across Instagram, Facebook, and YouTube with platform-specific detection methods.

### Technical Implementation

- **Content Script Architecture**: The extension uses a modular architecture with platform-specific implementations:
  ```javascript
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
  }
  ```

- **MutationObserver**: The extension uses MutationObserver to detect when new content is added to the page:
  ```javascript
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
  ```

- **Platform-Specific Detection**: Each platform has its own implementation for finding and blocking content:
  ```javascript
  // Example for Instagram
  export class InstagramDetector {
    findReels() {
      return Array.from(document.querySelectorAll('div[role="button"]:has(video)'));
    }

    async getAudioInfo(reel) {
      const audioElement = reel.querySelector('audio');
      if (!audioElement) return null;

      const audioLabel = reel.querySelector('a[href*="/audio/"]')?.textContent;
      if (!audioLabel) return null;

      return {
        name: audioLabel.trim(),
        id: this.extractAudioId(reel)
      };
    }

    blockReel(reel) {
      reel.style.display = 'none';
    }
  }
  ```

- **Storage Management**: The extension uses Chrome's storage API to persist blocked audio tracks:
  ```javascript
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
  ```

## Features

- Block reels/videos by audio track name or ID
- Manage your list of blocked audio tracks
- Works across Instagram, Facebook, and YouTube
- Simple and intuitive user interface
- Real-time blocking without page refresh

## Installation

### Direct Installation (Chrome Web Store)
*Coming soon*

### Manual Installation

1. **Download the extension**:
   - Download this repository as a ZIP file from GitHub
   - Extract the ZIP file to a location on your computer

2. **Load the extension in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" by toggling the switch in the top-right corner
   - Click "Load unpacked" and select the extracted folder

3. **Load the extension in Firefox**:
   - Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
   - Click "Load Temporary Add-on"
   - Select the `manifest.json` file from the extracted folder

### Direct Usage Without Installation

The extension is designed to be used immediately after downloading and extracting:

1. Download the latest release ZIP file from the GitHub repository
2. Extract the ZIP file to any location on your computer
3. Follow the manual installation steps above for your browser

No compilation, building, or additional dependencies are required for basic usage.

## Usage

1. Click on the extension icon in your browser toolbar
2. Enter the name of an audio track you want to block
3. Click "Block Audio" to add it to your blocked list
4. To remove a blocked audio track, click the "Unblock" button next to it

## Development

### Project Structure

```
├── icons/                  # Extension icons
├── src/
│   ├── background/         # Background scripts
│   ├── content/            # Content scripts
│   │   └── platforms/      # Platform-specific implementations
│   ├── options/            # Options page
│   └── popup/              # Popup UI
├── storage/                # Storage utilities
├── utils/                  # Utility functions
└── manifest.json           # Extension manifest
```

### Building from Source

No build step is required for basic usage. The extension can be loaded directly as an unpacked extension.

### Creating a Distribution Package

To create a ZIP file for distribution:

1. Install Node.js if you don't have it already (https://nodejs.org/)
2. Open a terminal/command prompt
3. Navigate to the root directory of the project (where the main `manifest.json` file is located)
4. Run the following commands:

```bash
# Install dependencies (only needed once)
npm install

# Create the distribution package
npm run package
```

This will create a ZIP file in the `dist` directory that you can distribute or upload to browser extension stores.

**Important Notes:**
- Make sure you run these commands in the root directory of the project, not in the `package/` subdirectory
- The first time you run `npm install`, it will create a `node_modules` folder - this is normal and required
- The packaging script automatically excludes development files like `.git`, `node_modules`, etc. from the final ZIP

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests if you have suggestions for improvements or bug fixes.

## License

MIT License