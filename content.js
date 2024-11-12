let modal = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'getSelection':
      const selectedText = window.getSelection().toString().trim();
      if (selectedText) {
        chrome.runtime.sendMessage({
          action: 'analyzeText',
          text: selectedText
        });
      }
      break;

    case 'showResponse':
      showModal(request.response);
      break;

    case 'showError':
      showModal(`Error: ${request.error}`, true);
      break;
  }
});

function createModal() {
  const modal = document.createElement('div');
  modal.className = 'openai-context-modal';
  
  const content = document.createElement('div');
  content.className = 'openai-context-content';
  
  const closeButton = document.createElement('button');
  closeButton.className = 'openai-context-close';
  closeButton.innerHTML = '×';
  closeButton.onclick = () => modal.remove();
  
  const responseText = document.createElement('div');
  responseText.className = 'openai-context-text';
  
  content.appendChild(closeButton);
  content.appendChild(responseText);
  modal.appendChild(content);
  
  return { modal, responseText };
}

function showModal(text, isError = false) {
  if (modal) {
    modal.remove();
  }
  
  const { modal: newModal, responseText } = createModal();
  modal = newModal;
  
  responseText.textContent = text;
  if (isError) {
    responseText.classList.add('error');
  }
  
  document.body.appendChild(modal);
  
  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal) {
      modal.remove();
    }
  });
  
  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}
