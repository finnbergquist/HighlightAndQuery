document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('apiKey');
  const systemPromptInput = document.getElementById('systemPrompt');
  const saveButton = document.getElementById('saveSettings');
  const statusElement = document.getElementById('status');

  // Load saved settings
  chrome.storage.sync.get(['apiKey', 'systemPrompt'], (data) => {
    if (data.apiKey) {
      apiKeyInput.value = data.apiKey;
    }
    if (data.systemPrompt) {
      systemPromptInput.value = data.systemPrompt;
    }
  });

  // Save settings
  saveButton.addEventListener('click', () => {
    const apiKey = apiKeyInput.value.trim();
    const systemPrompt = systemPromptInput.value.trim();

    if (!apiKey) {
      showStatus('Please enter an API key', 'error');
      return;
    }

    chrome.storage.sync.set({
      apiKey,
      systemPrompt
    }, () => {
      showStatus('Settings saved successfully!');
    });
  });

  function showStatus(message, type = 'success') {
    statusElement.textContent = message;
    statusElement.style.color = type === 'error' ? '#dc3545' : '#10a37f';
    setTimeout(() => {
      statusElement.textContent = '';
    }, 3000);
  }
});
