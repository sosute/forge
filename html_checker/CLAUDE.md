# 開発ルール

## 開発哲学：AI駆動型テスト駆動開発（TDD）

### 核となる原則
- **テストファースト:** すべてのプロダクションコードは、失敗するテストをパスさせるためだけに書かれる
- **テストは仕様書:** テストは後付けの作業ではなく、それ自身が仕様書であり設計の駆動役
- **リファクタリングへの自信:** 包括的なテストスイートがセーフティネットとなり、恐れることなく継続的な改善が可能
- **テスト容易性 = 良い設計:** テストしにくいコードは悪い設計の兆候

## TDD開発サイクル：レッド・グリーン・リファクタリング・コミット

1. **レッド（失敗するテストを書く）** → 2. **グリーン（テストをパスさせる）** → 3. **リファクタリング（設計を改善）** → 4. **コミット（進捗を保存）**

### Ping-Pong Programming実装方式
- **テスト作成AI:** 失敗するテストコードのみを作成
- **実装AI:** テストをパスする最小限のコードを実装

```bash
# 実装AIへの指示（Claude Code非対話モード）
claude -p "指示" --output-format=json \
  --system-prompt "t-wadaさんのやり方に従う。テストをパスする最小限の実装のみ。テストコード修正禁止。" \
  --allowedTools "Read,Edit,MultiEdit,Bash(npm test),Bash(npm run:*)"

# セッション再開時
claude -p "指示" --output-format=json --resume <session_id> [同じオプション]
```

## Git連携ワークフロー

### ブランチ運用
- `feature/issue-{番号}-{概要}` 形式（例: `feature/issue-4-remove-bookmarklet`）
- main ブランチへの直接コミット禁止
- 各TDDサイクル完了時にコミット

### コミットメッセージ規則
- **日本語で記述**（コミット、PR、すべて日本語）
- TDDフェーズを明示：`[テスト]`、`[実装]`、`[リファクタリング]`
- Issue連携：`refs #Issue番号`
- 例：`[テスト] ユーザー認証のテストケース追加 refs #4`

## 品質管理

### 必須品質チェック
```bash
cd chrome-extension
npm test              # テスト実行
npm run quality       # lint + format + build 統合チェック
```

### 実行タイミング
1. **TDDサイクル完了時** - テスト実行
2. **PR作成前** - 品質チェック（最重要）
3. **コミット前** - 最終確認

### コーディング規約
- **ハードコード禁止:** マジックナンバー、設定値、文字列は定数化
- **SOLID原則:** 特に単一責任の原則（SRP）とDRY
- **セキュリティ第一:** 入力検証とサニタイズ徹底

## Claude自動化（TDD統合版）

### TDD専用エージェント・コマンド

#### グローバル汎用エージェント（全プロジェクトで利用可能）
- **@tdd-test-writer** - テスト作成専門（Serena統合）
- **@tdd-implementer** - 実装専門（最小限実装）
- **@issue-tdd** - Issue駆動TDD統合実行
- **@serena-expert** - Serena MCP統合分析（全プロジェクト共通）

#### プロジェクト特化エージェント
- **@chrome-extension-specialist** - HTML Checker専門

#### グローバル汎用コマンド
- **/tdd-cycle** - TDDサイクル自動実行
- **/issue-tdd** - Issue→TDD→PR 一貫実行
- **/serena** - Serena MCP分析コマンド（全プロジェクト共通）

### Issue対応の完全自動化フロー
```bash
# 1. Issue駆動TDD実行（推奨）
/issue-tdd #5

# 2. 個別TDDサイクル実行
/tdd-cycle "機能名" "テスト内容"

# 3. 従来方式（互換性維持）
gh issue #2 を対応してください
```

**完全自動実行内容：**
1. **Serena深層分析** - 影響範囲・リスク・最適解の特定
2. **TDDサイクル実行** - レッド→グリーン→リファクタリング→コミット
3. **品質保証統合** - テスト・lint・品質チェック完全自動化
4. **PR自動作成** - TDDプロセス詳細・バージョン更新・Issue連携

## バージョン管理

### セマンティックバージョニング
- **PATCH (0.0.1):** バグ修正、軽微な改善
- **MINOR (0.1.0):** 新機能追加、中規模な改善  
- **MAJOR (1.0.0):** 破壊的変更、大規模リニューアル

### 更新タイミング
- PR作成時に`manifest.json`を更新
- コミットメッセージに`version: X.X.X`を含める
- 競合時は後からマージするPRで調整

## 開発フローまとめ

### 推奨コマンド使用例
```bash
# 【推奨】Issue駆動TDD完全自動実行
/issue-tdd #5  # Issue #5を完全自動でTDD実践・PR作成

# 個別機能のTDDサイクル実行
/tdd-cycle "HTMLチェック" "不正タグ検出"  # レッド→グリーン→リファクタリング→コミット

# エージェント直接指定（高度な使用）
@tdd-test-writer "[テスト] HTMLチェック機能のテスト作成"
@tdd-implementer "[実装] content.test.js の HTMLチェックテストをパス"
@chrome-extension-specialist "HTML Checker特化の高度な実装"

# 従来方式（互換性維持）
gh issue #2 を対応してください

# 手動品質チェック
cd chrome-extension && npm test && npm run quality
```

### 1. Issue対応手順（自動化）
1. `/issue-tdd #番号` でワンコマンド実行
2. 自動でSerena分析・TDDサイクル・品質チェック・PR作成

### 2. 個別TDD実行
1. `/tdd-cycle "機能名" "テスト内容"` でTDDサイクル実行
2. レッド→グリーン→リファクタリング→コミットを自動実行

### 3. セキュリティ・権限
- TDDエージェントには適切な権限分離設定済み
- テスト作成と実装の役割を厳密に分離
- 機密情報（.env、APIキー）のコミット禁止

## 使用技術
- Node.js / TypeScript
- Jest（テストフレームワーク）
- ESLint / Prettier（コード品質）
- Chrome Extension APIs