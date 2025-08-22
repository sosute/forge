# HTML Checker Project Structure

```
/home/ogawa/forge/html_checker/
├── bookmarklet/                    # Bookmarklet version
│   ├── article-test.html          # Test HTML page for bookmarklet
│   ├── compress.js                # Build script to compress source
│   ├── html-checker-compressed.js # Minified bookmarklet code
│   ├── html-checker-source.js     # Source code for bookmarklet
│   ├── memo.md                    # Development notes in Japanese
│   └── package.json               # Node.js configuration
│
└── chrome-extension/              # Chrome Extension version
    ├── assets/                    # Static resources
    │   ├── css/                  # Stylesheets
    │   ├── icons/                # Extension icons
    │   └── images/               # UI images
    ├── background.js             # Service worker (Manifest V3)
    ├── content-script.js         # Injected into web pages
    ├── docs/                     # Documentation
    │   ├── DEPLOYMENT_GUIDE.md   # Deployment instructions
    │   ├── DESIGN.md            # Architecture design (Japanese)
    │   ├── MIGRATION_PLAN.md    # Migration strategy
    │   └── UI_REQUIREMENTS.md   # UI specifications
    ├── manifest.json            # Extension configuration
    ├── options.html             # Settings page HTML
    ├── options.js               # Settings page logic
    ├── popup.html               # Popup UI HTML
    └── popup.js                 # Popup UI logic
```

## Key Components

### Bookmarklet
- Single-file JavaScript tool
- Compressed for bookmarking
- No external dependencies
- Quick deployment

### Chrome Extension
- Full-featured implementation
- Modular architecture
- Persistent settings
- Rich UI with drawer panel
- Background service worker
- Content script for DOM manipulation

## Module Relationships
1. **Popup** → triggers → **Service Worker**
2. **Service Worker** → messages → **Content Script**
3. **Content Script** → manipulates → **Web Page DOM**
4. **Options Page** → saves to → **Chrome Storage**
5. **All Components** → read from → **Chrome Storage**