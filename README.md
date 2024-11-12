# OpenAI Text Context Chrome Extension

A Chrome extension that enhances text selection capabilities through OpenAI API integration, delivering contextual insights for selected text.

## Features

- **Text Analysis**: Get AI-powered insights for any selected text using OpenAI's GPT-4
- **Multiple Activation Methods**:
  - Context menu option (right-click)
  - Keyboard shortcut (Command+Shift+1 on Mac, Ctrl+Shift+1 on Windows/Linux)
- **Customizable Settings**:
  - OpenAI API key configuration
  - Customizable system prompt
- **Elegant UI**:
  - OpenAI-styled popup interface
  - Responsive design
  - Markdown formatting support

## Installation

1. Clone this repository
```bash
git clone [repository-url]
cd openai-text-context
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

## Development

### Prerequisites

- Node.js (v14 or higher)
- Chrome Browser

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Make changes to the source code
3. Load the extension in Chrome using "Load unpacked"

## Technical Stack

- Chrome Extensions API
- OpenAI API (GPT-4)
- Vanilla JavaScript
- CSS3

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

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
