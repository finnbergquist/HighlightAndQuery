// Initialize OpenAI integration
async function callOpenAI(text, apiKey, systemPrompt = 'You are a helpful assistant. Analyze the given text and provide insights.') {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'API request failed');
    }

    const data = await response.json();
    return { success: true, content: data.choices[0].message.content };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Initialize context menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'analyzeText',
    title: 'Analyze with OpenAI',
    contexts: ['selection']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'analyzeText' && info.selectionText) {
    analyzeText(info.selectionText, tab);
  }
});

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener(async (command, tab) => {
  if (!tab?.id) return;

  if (command === 'analyze-text') {
    try {
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'getSelectedText' });
      if (response?.selectedText) {
        await analyzeText(response.selectedText, tab);
      } else {
        await notifyError(tab.id, 'Please select some text to analyze.');
      }
    } catch (error) {
      console.error('Command error:', error);
      await notifyError(tab.id, 'Failed to get selected text. Please try again.');
    }
  }
});

// Message handling
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzeText') {
    handleAnalysis(request.text)
      .then(sendResponse)
      .catch(error => sendResponse({ error: error.message }));
    return true;
  }
  return true;
});

async function handleAnalysis(text) {
  try {
    const settings = await chrome.storage.sync.get(['apiKey', 'systemPrompt']);
    
    if (!settings.apiKey) {
      throw new Error('Please set your OpenAI API key in the extension settings.');
    }

    const result = await callOpenAI(text, settings.apiKey, settings.systemPrompt);
    
    if (!result.success) {
      throw new Error(result.error);
    }

    return { 
      result: result.content
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to analyze text. Please check your API key and try again.');
  }
}

async function analyzeText(text, tab) {
  try {
    await chrome.tabs.sendMessage(tab.id, {
      action: 'showAnalysis',
      text: text
    });
  } catch (error) {
    await notifyError(tab.id, 'Failed to analyze text');
  }
}

async function notifyError(tabId, message) {
  try {
    await chrome.tabs.sendMessage(tabId, {
      action: 'showError',
      error: message
    });
  } catch (error) {
    console.error('Failed to notify error:', error);
  }
}
