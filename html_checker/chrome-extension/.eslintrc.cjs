module.exports = {
  root: true,
  env: { 
    browser: true, 
    es2020: true,
    webextensions: true,
    node: true
  },
  extends: [
    'eslint:recommended'
  ],
  ignorePatterns: ['dist', 'node_modules', '*.min.js'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  rules: {
    // 未使用変数の検出（アンダースコアで始まる変数は除外）
    'no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_' 
    }],
    // console.logの警告
    'no-console': 'warn',
    // セミコロン必須
    'semi': ['error', 'always'],
    // インデント（スペース2つ）
    'indent': ['error', 2],
    // クォートはシングルクォート
    'quotes': ['error', 'single'],
    // 末尾カンマ
    'comma-dangle': ['error', 'never']
  }
};