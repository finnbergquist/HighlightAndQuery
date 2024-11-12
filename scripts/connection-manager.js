class ConnectionManager {
  constructor() {
    this.connected = false;
    this.connectionAttempts = 0;
    this.maxRetries = 3;
    this.setupListeners();
  }

  setupListeners() {
    // Listen for connection state changes
    chrome.runtime.onConnect.addListener(port => {
      console.log('[ConnectionManager] New connection established');
      this.connected = true;
      this.connectionAttempts = 0;

      port.onDisconnect.addListener(() => {
        console.log('[ConnectionManager] Connection lost');
        this.connected = false;
        this.handleDisconnect();
      });
    });
  }

  async handleDisconnect() {
    if (this.connectionAttempts >= this.maxRetries) {
      console.error('[ConnectionManager] Max reconnection attempts reached');
      return;
    }

    this.connectionAttempts++;
    console.log(`[ConnectionManager] Attempting to reconnect (${this.connectionAttempts}/${this.maxRetries})`);

    try {
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000));
      await this.reloadContentScript();
    } catch (error) {
      console.error('[ConnectionManager] Reconnection failed:', error);
    }
  }

  async reloadContentScript() {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tabs.length) return;

    const tab = tabs[0];
    
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: () => {
          // Cleanup existing listeners
          window.postMessage({ type: 'EXTENSION_CLEANUP' }, '*');
        }
      });

      // Reload content script
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['scripts/content.js']
      });

      console.log('[ConnectionManager] Content script reloaded successfully');
      this.connected = true;
    } catch (error) {
      console.error('[ConnectionManager] Failed to reload content script:', error);
      throw error;
    }
  }

  isConnected() {
    return this.connected;
  }

  resetConnectionAttempts() {
    this.connectionAttempts = 0;
  }
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
  window.ConnectionManager = ConnectionManager;
}
