# Suggested Commands for Development

## Build Commands

### Bookmarklet
```bash
cd bookmarklet
npm run build  # Compresses the source file
npm run compress  # Same as build, runs compress.js
```

### Chrome Extension
No automated build process detected. Manual file editing and Chrome Developer Mode reload required.

## Development Workflow

### Testing Bookmarklet
1. Build: `cd bookmarklet && npm run build`
2. Open `bookmarklet/article-test.html` in browser for testing
3. Copy compressed code from `html-checker-compressed.js`
4. Create bookmark with `javascript:` prefix

### Testing Chrome Extension
1. Open Chrome Extensions page: `chrome://extensions/`
2. Enable Developer Mode
3. Click "Load unpacked"
4. Select `/home/ogawa/forge/html_checker/chrome-extension` directory
5. Click extension icon in toolbar to test

## Git Commands
```bash
git status  # Check current status
git add .  # Stage all changes
git commit -m "message"  # Commit changes
git push origin main  # Push to GitHub
```

## System Utilities (Linux)
```bash
ls -la  # List all files with details
find . -name "*.js" -type f  # Find JavaScript files
grep -r "pattern" .  # Search for pattern in files
cat filename  # View file contents
```

## Node/NPM Commands
```bash
node --version  # Check Node.js version (requires >=14.0.0)
npm install  # Install dependencies (in bookmarklet directory)
```

## Chrome Extension Debugging
- Open DevTools: F12 or Ctrl+Shift+I
- Service Worker logs: chrome://extensions/ → Details → Service worker
- Content script logs: Regular DevTools console on web pages
- Storage inspection: Chrome DevTools → Application → Storage → Chrome Storage