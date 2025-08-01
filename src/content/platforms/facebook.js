export class FacebookDetector {
  findReels() {
    return Array.from(document.querySelectorAll('[data-pagelet="FeedVideo"]'));
  }

  async getAudioInfo(reel) {
    const audioButton = reel.querySelector('[aria-label="Audio"]');
    if (!audioButton) return null;

    // Click to reveal audio info (simulated)
    audioButton.click();
    await new Promise(resolve => setTimeout(resolve, 500));

    const audioInfo = reel.querySelector('[role="dialog"] [dir="auto"]')?.textContent;
    if (!audioInfo) return null;

    return {
      name: audioInfo.trim(),
      id: this.extractAudioId(reel)
    };
  }

  extractAudioId(reel) {
    // Facebook doesn't expose direct audio IDs, so we create a hash
    const audioInfo = reel.querySelector('[role="dialog"] [dir="auto"]')?.textContent;
    return audioInfo ? this.hashString(audioInfo) : null;
  }

  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return hash.toString();
  }

  blockReel(reel) {
    reel.style.display = 'none';
  }
}