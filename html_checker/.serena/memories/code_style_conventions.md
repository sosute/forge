# Code Style and Conventions

## JavaScript Style
- **Framework**: Vanilla JavaScript (no React, Vue, or other frameworks)
- **ES Version**: Modern ES6+ syntax
- **Module System**: ES Modules for Chrome Extension (type="module")
- **Class-based Architecture**: OOP approach with clear class definitions

## Naming Conventions
- **Classes**: PascalCase (e.g., `RuleEngine`, `ConfigManager`, `DrawerUI`)
- **Functions/Methods**: camelCase (e.g., `executeRules`, `highlightElements`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `CONFIG_SCHEMA`, `CATEGORIES`)
- **CSS Classes**: kebab-case with `checker-` prefix (e.g., `checker-drawer`, `checker-float-control`)
- **File Names**: kebab-case (e.g., `content-script.js`, `html-checker-source.js`)

## Code Organization
- **Separation of Concerns**: Clear module boundaries (UI, Data, Core Logic)
- **Single Responsibility**: Each class/module has one clear purpose
- **Comments**: Japanese comments for important sections
- **Documentation**: Extensive design documentation in Japanese

## Chrome Extension Specific
- **Manifest Version**: V3 (latest standard)
- **Service Worker**: Modern background script approach
- **Permissions**: Minimal permissions (activeTab, storage, scripting)
- **Content Security Policy**: Strict CSP for security

## CSS Conventions
- **BEM-like Naming**: Component-based naming structure
- **Scoped Styles**: All extension styles prefixed with `checker-`
- **Transitions**: Smooth animations (0.2s-0.3s ease)
- **Z-index Management**: High values (9999-10000) to ensure visibility

## Error Handling
- **Try-Catch**: Used for critical operations
- **Graceful Degradation**: Features work independently
- **User Feedback**: Visual indicators for errors/warnings