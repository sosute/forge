# HTML Semantic Checker - Chrome拡張 設計書

## 概要
HTML要素のセマンティック構造・アクセシビリティ・SEOの問題を検知し、改善提案を行うChrome拡張。

## アーキテクチャ設計

### Core Architecture
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Popup UI      │────│  Service Worker  │────│  Content Script │
│ (制御・設定)     │    │ (ルール処理)     │    │ (DOM操作・UI)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Options Page   │────│  Chrome Storage  │────│   Highlight     │
│ (詳細設定)       │    │ (設定・履歴)     │    │   Engine        │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Technology Stack
- **Framework**: Vanilla JavaScript (依存関係最小化)
- **Manifest**: Version 3 (最新仕様)
- **Storage**: Chrome Storage API
- **UI**: CSS3 + JavaScript (React未使用でパフォーマンス重視)
- **Build**: ESバンドル + 軽量ビルドプロセス

## モジュール設計

### Core Modules

#### RuleEngine
```javascript
// 責任: 検査ロジックの実行・管理
class RuleEngine {
  constructor(rules, config) {}
  executeRules(document) {}
  validateRule(rule) {}
  getEnabledRules() {}
}
```

#### CategoryManager
```javascript
// 責任: ルールのカテゴリ分類・優先度管理
const CATEGORIES = {
  'SEO': { name: 'SEO・検索最適化', icon: '🔍', priority: 'high' },
  'Accessibility': { name: 'アクセシビリティ', icon: '♿', priority: 'high' },
  'Semantic': { name: 'セマンティック構造', icon: '🏗️', priority: 'medium' },
  'UX': { name: 'ユーザビリティ', icon: '👤', priority: 'medium' },
  'Performance': { name: 'パフォーマンス・保守性', icon: '⚡', priority: 'low' }
};
```

#### ConfigManager
```javascript
// 責任: 設定管理・永続化・バリデーション
class ConfigManager {
  async loadConfig() {}
  async saveConfig(config) {}
  getDefaultConfig() {}
  validateConfig(config) {}
}
```

### UI Modules

#### DrawerUI
```javascript
// 責任: メインパネルの表示・制御
class DrawerUI {
  constructor() {
    this.state = 'minimized'; // minimized | expanded | floating
    this.position = 'right';   // left | right
  }
  
  toggle() {}
  expand() {}
  minimize() {}
  renderResults(results) {}
  renderCategorySection(category, issues) {}
}
```

#### HighlightUI
```javascript
// 責任: 要素ハイライト・アニメーション制御
class HighlightUI {
  highlightElements(elements, rule) {}
  removeHighlights() {}
  jumpToElement(element) {}
  toggleHighlights() {}
}
```

### Data Modules

#### StorageManager
```javascript
// 責任: Chrome Storage API の抽象化
class StorageManager {
  async set(key, value) {}
  async get(key) {}
  async remove(key) {}
  async clear() {}
}
```

## UI/UX設計

### Main Interface Components

#### 1. Floating Control Panel (最小化状態)
```css
.checker-float-control {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  display: flex;
  gap: 8px;
}

.control-button {
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background: #2196F3;
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4);
  cursor: pointer;
  transition: all 0.2s ease;
}
```

#### 2. Drawer Panel (展開状態)
```css
.checker-drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 450px;
  height: 100vh;
  background: #ffffff;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  transform: translateX(100%);
  transition: transform 0.3s ease;
}

.checker-drawer.expanded {
  transform: translateX(0);
}
```

### Category-based Issue Display
```javascript
// カテゴリ別アコーディオン表示
const categoryTemplate = `
<div class="category-section" data-priority="{priority}">
  <div class="category-header" data-category="{categoryId}">
    <span class="category-icon">{icon}</span>
    <h3 class="category-title">{name}</h3>
    <span class="issue-count">{count}件</span>
    <button class="category-toggle">▼</button>
  </div>
  <div class="issue-list">
    <!-- Issues rendered here -->
  </div>
</div>
`;
```

## 設定管理システム

### Configuration Schema
```javascript
const CONFIG_SCHEMA = {
  rules: {
    // ルール別ON/OFF設定
    'missing_h1': { enabled: true, severity: 'error' },
    'heading_structure': { enabled: true, severity: 'warning' },
    // ... 全18ルール
  },
  ui: {
    position: 'right',        // left | right
    defaultState: 'minimized', // minimized | expanded
    autoExpand: false,        // 検査実行時の自動展開
    categoryExpanded: {       // カテゴリ別展開状態
      'SEO': true,
      'Accessibility': true,
      'Semantic': false,
      'UX': false,
      'Performance': false
    }
  },
  advanced: {
    highlightStyle: 'outline', // outline | background | border
    jumpAnimation: true,       // 要素ジャンプ時のアニメーション
    soundEnabled: false,       // 完了音
    autoCheck: false          // ページロード時の自動チェック
  }
};
```

### Rule Definition Format
```javascript
const RULE_DEFINITIONS = {
  rules: [
    {
      id: "missing_h1",
      name: "H1タグの欠落",
      description: "ページにH1タグが存在しません",
      category: "SEO",
      severity: "error",
      tags: ["seo", "heading", "structure"],
      checkFunction: "checkMissingH1",
      enabled: true,
      configurable: true,
      helpUrl: "https://developer.mozilla.org/docs/Web/HTML/Element/h1"
    }
    // ... 全ルール定義
  ]
};
```

## パフォーマンス設計

### Optimization Strategy
1. **遅延実行**: ページ読み込み完了後の実行
2. **バッチ処理**: DOM操作の最適化
3. **メモリ効率**: 不要なオブジェクトの早期解放
4. **非同期処理**: UIブロッキング回避

### Memory Management
```javascript
class PerformanceManager {
  constructor() {
    this.domObserver = null;
    this.highlightElements = new WeakMap();
    this.resultCache = new Map();
  }
  
  cleanup() {
    this.domObserver?.disconnect();
    this.resultCache.clear();
    // WeakMapは自動ガベージコレクション
  }
}
```

## セキュリティ設計

### Content Security Policy
```json
{
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'none'"
  }
}
```

### Permission Minimization
```json
{
  "permissions": [
    "activeTab",    // 現在のタブのみ
    "storage"       // 設定保存のみ
  ]
}
```

## 拡張性設計

### Plugin Architecture
```javascript
// 将来的なルール追加を想定
class PluginManager {
  registerRule(rule) {}
  unregisterRule(ruleId) {}
  listAvailablePlugins() {}
}
```

### API Integration Points
- カスタムルール追加インターフェース
- 外部ツール連携API
- エクスポート形式拡張

## 次世代機能構想

### Phase 2+ Features
- **AI連携**: 自動改善提案
- **Team機能**: チーム内での共有
- **CI/CD連携**: 自動検査パイプライン
- **カスタムルール**: ユーザー定義ルール
- **A/B Testing**: 改善効果測定

この設計に基づいて段階的な実装を進めます。