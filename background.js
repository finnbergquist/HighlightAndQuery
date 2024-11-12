// the newest OpenAI model is "gpt-4o" which was released May 13, 2024
const OPENAI_MODEL = "gpt-4o";

chrome.commands.onCommand.addListener((command) => {
  if (command === 'analyze-text') {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {action: 'getSelection'});
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzeText') {
    analyzeTextWithOpenAI(request.text)
      .then(response => {
        chrome.tabs.sendMessage(sender.tab.id, {
          action: 'showResponse',
          response: response
        });
      })
      .catch(error => {
        chrome.tabs.sendMessage(sender.tab.id, {
          action: 'showError',
          error: error.message
        });
      });
  }
  return true;
});

async function analyzeTextWithOpenAI(text) {
  const settings = await chrome.storage.sync.get(['apiKey', 'systemPrompt']);
  
  if (!settings.apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${settings.apiKey}`
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [
        {
          role: 'system',
          content: settings.systemPrompt || 'You are a helpful assistant providing context and insights about the selected text.'
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to get response from OpenAI');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
