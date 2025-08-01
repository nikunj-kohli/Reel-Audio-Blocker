export class YouTubeDetector {
  findReels() {
    return Array.from(document.querySelectorAll('ytd-reel-video-renderer'));
  }

  async getAudioInfo(reel) {
    const titleElement = reel.querySelector('#video-title');
    if (!titleElement) return null;

    // YouTube shows audio info in the title for Shorts
    const title = titleElement.textContent;
    const audioMatch = title.match(/\/ (.+)/);
    if (!audioMatch) return null;

    return {
      name: audioMatch[1].trim(),
      id: this.extractAudioId(reel)
    };
  }

  extractAudioId(reel) {
    const videoId = reel.querySelector('a#thumbnail')?.href.split('v=')[1];
    return videoId || null;
  }

  blockReel(reel) {
    reel.style.display = 'none';
  }
}