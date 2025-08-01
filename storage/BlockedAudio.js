export class BlockedAudio {
  static async getAll() {
    return new Promise((resolve) => {
      chrome.storage.sync.get('blockedAudio', (data) => {
        resolve(data.blockedAudio || []);
      });
    });
  }

  static async add(audioName) {
    const blockedAudio = await this.getAll();
    if (!blockedAudio.includes(audioName)) {
      blockedAudio.push(audioName);
      await this.save(blockedAudio);
      return true;
    }
    return false;
  }

  static async remove(audioName) {
    let blockedAudio = await this.getAll();
    blockedAudio = blockedAudio.filter(audio => audio !== audioName);
    await this.save(blockedAudio);
  }

  static async save(blockedAudio) {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ blockedAudio }, () => {
        resolve();
      });
    });
  }

  static async clear() {
    await this.save([]);
  }
}