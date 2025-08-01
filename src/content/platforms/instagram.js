export class InstagramDetector {
  findReels() {
    return Array.from(document.querySelectorAll('div[role="button"]:has(video)'));
  }

  async getAudioInfo(reel) {
    const audioElement = reel.querySelector('audio');
    if (!audioElement) return null;

    // Instagram doesn't expose audio metadata directly, so we look for text indicators
    const audioLabel = reel.querySelector('a[href*="/audio/"]')?.textContent;
    if (!audioLabel) return null;

    return {
      name: audioLabel.trim(),
      id: this.extractAudioId(reel)
    };
  }

  extractAudioId(reel) {
    const audioLink = reel.querySelector('a[href*="/audio/"]')?.getAttribute('href');
    return audioLink ? audioLink.split('/audio/')[1].split('/')[0] : null;
  }

  blockReel(reel) {
    reel.style.display = 'none';
    // Alternatively: reel.closest('article')?.remove();
  }
}