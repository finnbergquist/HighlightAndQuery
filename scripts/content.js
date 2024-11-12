let popup = null;

// Message handling
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'getSelectedText':
      sendResponse({ selectedText: window.getSelection()?.toString().trim() });
      break;
      
    case 'showAnalysis':
      showAnalysisPopup(request.text);
      sendResponse({ success: true });
      break;
      
    case 'showError':
      showError(request.error);
      sendResponse({ success: true });
      break;
  }
  return true;
});

function createPopup(title = 'OpenAI Analysis') {
  if (popup) {
    popup.remove();
  }

  popup = document.createElement('div');
  popup.className = 'ai-context-popup';
  popup.innerHTML = `
    <div class="ai-context-header">
      <h3 class="ai-context-title">${title}</h3>
      <button class="ai-context-close">×</button>
    </div>
    <div class="ai-context-content">
      <div class="ai-context-loading">Analyzing...</div>
    </div>
  `;
  
  document.body.appendChild(popup);
  
  // Position near selection
  const selection = window.getSelection();
  if (selection?.rangeCount) {
    const rect = selection.getRangeAt(0).getBoundingClientRect();
    popup.style.left = `${Math.min(rect.left, window.innerWidth - popup.offsetWidth - 10)}px`;
    popup.style.top = `${rect.bottom + window.scrollY + 10}px`;
  }
  
  // Close handlers
  popup.querySelector('.ai-context-close').onclick = () => popup.remove();
  document.addEventListener('mousedown', e => {
    if (popup && !popup.contains(e.target)) {
      popup.remove();
    }
  });
  
  return popup;
}

async function showAnalysisPopup(text) {
  popup = createPopup();
  
  try {
    const response = await chrome.runtime.sendMessage({
      action: 'analyzeText',
      text: text
    });
    
    const content = popup.querySelector('.ai-context-content');
    if (!content) return;

    content.innerHTML = response.error 
      ? `<div class="error">${response.error}</div>`
      : `<div class="result">${response.result}</div>`;
  } catch (error) {
    showError(error.message || 'Failed to analyze text');
  }
}

function showError(message) {
  const formattedMessage = message.includes('Cannot access')
    ? 'This extension cannot run on restricted Chrome pages. Please try on a regular webpage.'
    : message;
  popup = createPopup('Error');
  const content = popup.querySelector('.ai-context-content');
  if (content) {
    content.innerHTML = `<div class="error">${formattedMessage}</div>`;
  }
}
