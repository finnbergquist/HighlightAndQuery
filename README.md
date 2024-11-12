# OpenAI Text Context Chrome Extension

A Chrome extension that enhances text selection capabilities through OpenAI API integration, delivering contextual insights for selected text.


## Step 1: Highlight and right click
![Screen Shot 2024-11-12 at 12 57 27 PM](https://github.com/user-attachments/assets/cb9ce77f-a00e-4369-a1e0-029a08bf8503)

## Step 2: Receive your explanation within your window
![Screen Shot 2024-11-12 at 12 57 53 PM](https://github.com/user-attachments/assets/da9c488d-bae1-458c-afc2-572ad30b09dd)

## Setup: Just input your openai key, and customize the system instructions however you want
![Screen Shot 2024-11-12 at 12 58 17 PM](https://github.com/user-attachments/assets/bd7261cd-bedf-495c-8449-ff022c5be622)


## Installation

1. Clone this repository
```
git clone https://github.com/finnbergquist/HighlightAndQuery
```

2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory

## Configuration

1. Click the extension icon in Chrome's toolbar
2. Enter your OpenAI API key
3. (Optional) Customize the system prompt
4. Click "Save Settings"

## Usage

1. **Via Context Menu**:
   - Select any text on a webpage
   - Right-click and choose "Analyze with OpenAI"

2. **Via Keyboard Shortcut**:
   - Select any text on a webpage
   - Press Command+Shift+1 (Mac) or Ctrl+Shift+1 (Windows/Linux)


## File Structure

```
├── assets/           # SVG icons
├── scripts/
│   ├── background.js # Service worker
│   ├── content.js    # Content script
│   └── popup.js      # Popup UI logic
├── styles/           # CSS files
└── manifest.json     # Extension manifest
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
