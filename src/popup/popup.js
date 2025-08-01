document.addEventListener('DOMContentLoaded', () => {
  const audioInput = document.getElementById('audioInput');
  const blockButton = document.getElementById('blockButton');
  const blockedAudioList = document.getElementById('blockedAudioList');

  // Load blocked audio list
  loadBlockedAudio();

  // Add new audio to block list
  blockButton.addEventListener('click', () => {
    const audioName = audioInput.value.trim();
    if (!audioName) return;

    chrome.storage.sync.get('blockedAudio', (data) => {
      const blockedAudio = data.blockedAudio || [];
      if (!blockedAudio.includes(audioName)) {
        blockedAudio.push(audioName);
        chrome.storage.sync.set({ blockedAudio }, () => {
          audioInput.value = '';
          loadBlockedAudio();
          // Refresh active tabs to apply changes
          refreshTabs();
        });
      }
    });
  });

  // Load blocked audio list
  function loadBlockedAudio() {
    chrome.storage.sync.get('blockedAudio', (data) => {
      blockedAudioList.innerHTML = '';
      const blockedAudio = data.blockedAudio || [];
      
      blockedAudio.forEach(audio => {
        const li = document.createElement('li');
        li.innerHTML = `
          <span>${audio}</span>
          <button data-audio="${audio}">Unblock</button>
        `;
        blockedAudioList.appendChild(li);
      });

      // Add event listeners to unblock buttons
      document.querySelectorAll('#blockedAudioList button').forEach(button => {
        button.addEventListener('click', (e) => {
          const audioToRemove = e.target.getAttribute('data-audio');
          unblockAudio(audioToRemove);
        });
      });
    });
  }

  // Remove audio from block list
  function unblockAudio(audioName) {
    chrome.storage.sync.get('blockedAudio', (data) => {
      const blockedAudio = data.blockedAudio || [];
      const updatedList = blockedAudio.filter(audio => audio !== audioName);
      
      chrome.storage.sync.set({ blockedAudio: updatedList }, () => {
        loadBlockedAudio();
        // Refresh active tabs to apply changes
        refreshTabs();
      });
    });
  }

  // Refresh active tabs to apply blocking changes
  function refreshTabs() {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        if (tab.url?.includes('instagram.com') || 
            tab.url?.includes('facebook.com') || 
            tab.url?.includes('youtube.com')) {
          chrome.tabs.reload(tab.id);
        }
      });
    });
  }
});