# Chrome Extension TDDテンプレート

Chrome Extension開発向けのTDDテンプレートとパターン集。

## 📁 テンプレート構成

### Content Script TDD Pattern
```typescript
// content.test.ts
describe('Content Script', () => {
  beforeEach(() => {
    // Chrome API Mock
    global.chrome = {
      runtime: {
        sendMessage: jest.fn()
      }
    };
    
    // DOM Setup
    document.body.innerHTML = '<div id="test-content">Test Page</div>';
  });

  it('should_analyze_dom_structure', () => {
    const result = analyzeDOM();
    expect(result.elementCount).toBeGreaterThan(0);
  });
});
```

### Background Script TDD Pattern
```typescript
// background.test.ts  
describe('Background Script', () => {
  beforeEach(() => {
    global.chrome = {
      runtime: {
        onMessage: {
          addListener: jest.fn()
        }
      },
      storage: {
        local: {
          set: jest.fn(),
          get: jest.fn()
        }
      }
    };
  });

  it('should_handle_messages_correctly', () => {
    const mockMessage = { action: 'test', data: {} };
    const mockSendResponse = jest.fn();
    
    // Test message handling
  });
});
```

### Popup UI TDD Pattern
```typescript
// popup.test.ts
import { render, screen } from '@testing-library/react';

describe('Popup Component', () => {
  it('should_display_analysis_results', () => {
    const mockResults = { errors: 2, warnings: 5 };
    render(<Popup results={mockResults} />);
    
    expect(screen.getByText('2 errors')).toBeInTheDocument();
    expect(screen.getByText('5 warnings')).toBeInTheDocument();
  });
});
```

## 🔧 設定ファイル

### Jest Configuration (jest.config.js)
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### Chrome API Mock (test-setup.ts)
```typescript
// Chrome API全体のモック
global.chrome = {
  runtime: {
    sendMessage: jest.fn(),
    onMessage: {
      addListener: jest.fn(),
      removeListener: jest.fn()
    },
    getManifest: jest.fn(() => ({
      version: '1.0.0',
      permissions: ['activeTab', 'storage']
    }))
  },
  storage: {
    local: {
      set: jest.fn(),
      get: jest.fn(),
      remove: jest.fn()
    },
    sync: {
      set: jest.fn(),
      get: jest.fn()
    }
  },
  tabs: {
    query: jest.fn(),
    executeScript: jest.fn()
  }
};
```

## 🎯 TDD実行例

### HTML Checker Extension TDD Flow
```bash
# 1. Content Script TDD
/tdd-cycle "HTML Analysis" "DOM要素の構造解析"

# 2. Background Script TDD
/tdd-cycle "Message Handler" "分析結果の処理と保存"

# 3. Popup UI TDD
/tdd-cycle "Results Display" "分析結果の表示"
```

## 📊 Extension特有のテストパターン

### DOM Interaction Testing
```typescript
describe('DOM Interaction', () => {
  it('should_inject_analysis_ui', () => {
    injectAnalysisUI();
    
    const analysisPanel = document.getElementById('html-checker-panel');
    expect(analysisPanel).toBeInTheDocument();
    expect(analysisPanel.style.position).toBe('fixed');
  });
});
```

### Chrome Storage Testing
```typescript
describe('Chrome Storage', () => {
  it('should_save_analysis_results', async () => {
    const mockResults = { errors: 3, warnings: 7 };
    
    await saveAnalysisResults(mockResults);
    
    expect(chrome.storage.local.set).toHaveBeenCalledWith({
      analysis_results: mockResults
    });
  });
});
```

### Message Passing Testing
```typescript
describe('Message Passing', () => {
  it('should_send_analysis_request', () => {
    const mockData = { url: 'https://example.com' };
    
    sendAnalysisRequest(mockData);
    
    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
      action: 'analyze',
      data: mockData
    });
  });
});
```

このテンプレートを使用して、Chrome Extension開発でのTDD実践を効率化できます。