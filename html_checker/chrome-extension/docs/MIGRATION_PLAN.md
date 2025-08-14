# Chrome拡張 移行計画

## 技術スタック (更新版)

### Content Script Layer
```
Vanilla JavaScript + Tailwind CSS 4.x
├── DOM操作・要素検査
├── ハイライト制御  
├── ドロワーUI (軽量)
└── パフォーマンス最優先
```

### Extension UI Layer  
```
React + Chakra UI + Tailwind CSS 4.x
├── Popup Interface
├── Options Page
├── 設定管理画面
└── 保守性・UX最優先
```

## 段階的移行計画

### **Phase 1: 基盤構築** (Week 1-2)
#### 1.1 環境セットアップ
- [x] ディレクトリ構造作成
- [ ] Manifest V3設定
- [ ] Build環境構築 (Vite + TypeScript)
- [ ] Tailwind 4.x設定
- [ ] ESLint + Prettier設定

#### 1.2 Core Architecture
- [ ] StorageManager実装
- [ ] ConfigManager実装
- [ ] 基本的なメッセージングシステム
- [ ] 型定義 (TypeScript)

#### 1.3 開発環境
- [ ] Hot reload設定
- [ ] デバッグ環境
- [ ] テスト環境準備

### **Phase 2: コア機能移植** (Week 3-4)  
#### 2.1 Rule Engine移植
- [ ] 既存18ルールのTypeScript移植
- [ ] カテゴリ分類システム実装
- [ ] ルール実行エンジン
- [ ] 設定可能化 (ON/OFF制御)

#### 2.2 Content Script基盤
- [ ] DOM検査システム
- [ ] 軽量ハイライトシステム
- [ ] メッセージング連携
- [ ] パフォーマンス最適化

#### 2.3 データ層
- [ ] Chrome Storage連携
- [ ] 設定スキーマ定義
- [ ] マイグレーション機能

### **Phase 3: UI/UX実装** (Week 5-6)
#### 3.1 Content Script UI (Vanilla + Tailwind)
- [ ] フローティングコントロールパネル
- [ ] ドロワー式結果表示パネル  
- [ ] カテゴリ別アコーディオン
- [ ] スムーズアニメーション

#### 3.2 Popup UI (React + Chakra UI)
- [ ] メイン制御パネル
- [ ] 簡易設定画面
- [ ] 実行制御・トグル
- [ ] 統計表示

#### 3.3 Options Page (React + Chakra UI)  
- [ ] 詳細設定画面
- [ ] ルール別設定
- [ ] UI/UXカスタマイズ
- [ ] エクスポート機能

### **Phase 4: 追加機能実装** (Week 7-8)
#### 4.1 高度な機能
- [ ] 検査履歴管理
- [ ] カスタムルール (将来対応準備)
- [ ] 結果エクスポート (JSON/CSV/PDF)
- [ ] チーム設定共有機能

#### 4.2 パフォーマンス最適化
- [ ] バンドルサイズ最適化
- [ ] 遅延ローディング
- [ ] メモリ使用量最適化
- [ ] 大規模サイト対応

#### 4.3 ユーザビリティ向上
- [ ] キーボードショートカット
- [ ] ツールチップ・ヘルプ
- [ ] 多言語対応準備
- [ ] アクセシビリティ強化

### **Phase 5: 品質保証・リリース** (Week 9-10)
#### 5.1 テスト・品質保証
- [ ] ユニットテスト実装
- [ ] E2Eテスト実装  
- [ ] パフォーマンステスト
- [ ] セキュリティ監査

#### 5.2 ドキュメンテーション
- [ ] ユーザーマニュアル
- [ ] 開発者ドキュメント
- [ ] API仕様書
- [ ] 貢献ガイドライン

#### 5.3 リリース準備
- [ ] Chrome Web Store準備
- [ ] プロモーション素材
- [ ] ランディングページ
- [ ] サポート体制

## 依存関係・ツールチェーン

### Development Dependencies
```json
{
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0",
    "typescript": "^5.3.0",
    "tailwindcss": "^4.0.0-alpha.1",
    "@types/chrome": "^0.0.253",
    "eslint": "^8.55.0",
    "prettier": "^3.1.0"
  }
}
```

### Runtime Dependencies  
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@chakra-ui/react": "^2.8.0",
    "@emotion/react": "^11.11.0",
    "@emotion/styled": "^11.11.0",
    "framer-motion": "^10.16.0"
  }
}
```

### Build Configuration
```javascript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: 'src/popup/index.html',
        options: 'src/options/index.html',
        content: 'src/content/index.ts',
        background: 'src/background/index.ts'
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  }
});
```

## ファイル構成 (詳細版)

```
chrome-extension/
├── manifest.json
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
│
├── src/
│   ├── content/                  # Content Script (Vanilla + Tailwind)
│   │   ├── index.ts             # エントリーポイント
│   │   ├── checker.ts           # 検査実行エンジン
│   │   ├── ui/
│   │   │   ├── drawer.ts        # ドロワーUI
│   │   │   ├── highlights.ts    # ハイライト制御
│   │   │   └── floating.ts      # フローティングコントロール
│   │   └── styles/
│   │       └── content.css      # Tailwindベースのスタイル
│   │
│   ├── popup/                   # Popup UI (React + Chakra)
│   │   ├── index.html
│   │   ├── index.tsx
│   │   ├── components/
│   │   │   ├── MainPanel.tsx
│   │   │   ├── QuickSettings.tsx
│   │   │   └── StatusDisplay.tsx
│   │   └── styles/
│   │       └── popup.css
│   │
│   ├── options/                 # Options Page (React + Chakra)
│   │   ├── index.html  
│   │   ├── index.tsx
│   │   ├── components/
│   │   │   ├── RuleSettings.tsx
│   │   │   ├── UISettings.tsx
│   │   │   └── ExportPanel.tsx
│   │   └── styles/
│   │       └── options.css
│   │
│   ├── background/              # Service Worker
│   │   ├── index.ts
│   │   ├── messaging.ts
│   │   └── storage.ts
│   │
│   └── shared/                  # 共通モジュール
│       ├── core/
│       │   ├── rule-engine.ts
│       │   ├── config-manager.ts
│       │   └── category-manager.ts
│       ├── types/
│       │   ├── rules.ts
│       │   ├── config.ts
│       │   └── messages.ts
│       ├── utils/
│       │   ├── dom.ts
│       │   ├── performance.ts
│       │   └── validation.ts
│       └── rules/               # ルール定義
│           ├── index.ts
│           ├── seo.ts
│           ├── accessibility.ts
│           ├── semantic.ts
│           ├── ux.ts
│           └── performance.ts
│
├── assets/
│   ├── icons/
│   │   ├── icon16.png
│   │   ├── icon48.png
│   │   └── icon128.png
│   └── images/
│
├── dist/                        # ビルド出力
└── docs/
    ├── DESIGN.md
    ├── MIGRATION_PLAN.md
    └── API.md
```

## 既存コードからの移行戦略

### Rule Migration Pattern
```typescript
// Before (bookmarklet)
function checkMissingH1() {
  const h1Elements = document.querySelectorAll("h1");
  if (h1Elements.length === 0) {
    results.push({
      rule: RULES.rules.find((r) => r.id === "missing_h1"),
      elements: [],
      message: "H1タグが設定されていません"
    });
  }
}

// After (Chrome extension)
export const checkMissingH1: RuleCheckFunction = (document: Document): RuleResult[] => {
  const h1Elements = document.querySelectorAll("h1");
  
  if (h1Elements.length === 0) {
    return [{
      ruleId: "missing_h1",
      elements: [],
      message: "H1タグが設定されていません",
      severity: "error",
      category: "SEO"
    }];
  }
  
  return [];
};
```

### UI Migration Pattern  
```typescript
// Content Script UI (軽量)
class DrawerUI {
  private container: HTMLElement;
  
  constructor() {
    this.container = this.createDrawer();
    document.body.appendChild(this.container);
  }
  
  private createDrawer(): HTMLElement {
    const drawer = document.createElement('div');
    drawer.className = `
      fixed top-0 right-0 h-screen w-96 bg-white shadow-2xl 
      transform translate-x-full transition-transform duration-300
      z-[9999] overflow-y-auto
    `;
    return drawer;
  }
  
  public show(): void {
    this.container.classList.remove('translate-x-full');
  }
}
```

```tsx
// Popup UI (高機能)  
import { Box, VStack, Button } from '@chakra-ui/react';

export const MainPanel: React.FC = () => {
  return (
    <Box p={4} w="350px">
      <VStack spacing={4}>
        <Button 
          colorScheme="blue" 
          size="lg" 
          w="full"
          onClick={runCheck}
        >
          検査開始
        </Button>
        {/* ... */}
      </VStack>  
    </Box>
  );
};
```

このハイブリッドアプローチにより、パフォーマンスと保守性を両立できます。実装を開始しますか？