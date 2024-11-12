class OpenAIService {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async analyzeText(text, systemPrompt = 'You are a helpful assistant. Analyze the given text and provide insights.') {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
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

  updateApiKey(newApiKey) {
    this.apiKey = newApiKey;
  }

  static formatResponse(text) {
    return text.replace(/\n\n/g, '<br><br>')
               .replace(/\n/g, '<br>')
               .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
               .replace(/\*(.*?)\*/g, '<em>$1</em>')
               .replace(/`(.*?)`/g, '<code>$1</code>');
  }
}

window.OpenAIService = OpenAIService;