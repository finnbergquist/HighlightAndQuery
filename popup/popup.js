document.addEventListener('DOMContentLoaded', () => {
  // Load saved settings
  chrome.storage.sync.get(['apiKey', 'systemPrompt'], (result) => {
    if (result.apiKey) {
      document.getElementById('apiKey').value = result.apiKey;
    }
    if (result.systemPrompt) {
      document.getElementById('systemPrompt').value = result.systemPrompt;
    }
  });

  // Save settings
  document.getElementById('saveButton').addEventListener('click', () => {
    const apiKey = document.getElementById('apiKey').value;
    const systemPrompt = document.getElementById('systemPrompt').value;
    
    chrome.storage.sync.set({
      apiKey,
      systemPrompt
    }, () => {
      const status = document.getElementById('status');
      status.textContent = 'Settings saved!';
      status.className = 'status success';
      setTimeout(() => {
        status.textContent = '';
        status.className = 'status';
      }, 2000);
    });
  });
});
