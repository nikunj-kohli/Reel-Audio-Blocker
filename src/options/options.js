document.addEventListener('DOMContentLoaded', () => {
  const enableLogging = document.getElementById('enableLogging');
  const exportSettings = document.getElementById('exportSettings');
  const importSettings = document.getElementById('importSettings');
  const importFile = document.getElementById('importFile');

  // Load current settings
  chrome.storage.sync.get(['enableLogging'], (data) => {
    enableLogging.checked = data.enableLogging || false;
  });

  // Save settings when changed
  enableLogging.addEventListener('change', () => {
    chrome.storage.sync.set({ enableLogging: enableLogging.checked });
  });

  // Export settings
  exportSettings.addEventListener('click', () => {
    chrome.storage.sync.get(null, (data) => {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'reel_blocker_settings.json';
      a.click();
      
      URL.revokeObjectURL(url);
    });
  });

  // Import settings
  importSettings.addEventListener('click', () => {
    importFile.click();
  });

  importFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        chrome.storage.sync.set(data, () => {
          alert('Settings imported successfully!');
          window.close();
        });
      } catch (error) {
        alert('Error importing settings: Invalid file format');
      }
    };
    reader.readAsText(file);
  });
});