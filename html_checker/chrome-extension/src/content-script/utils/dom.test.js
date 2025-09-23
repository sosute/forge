import { sanitizeHtmlTags } from './dom.js';

describe('sanitizeHtmlTags', () => {

  test('< を &lt; に変換する', () => {
    expect(sanitizeHtmlTags('<div>')).toBe('&lt;div>');
  });

  test('> を &gt; に変換する', () => {
    expect(sanitizeHtmlTags('<div>')).toBe('&lt;div&gt;');
  });

  test('複数の < と > を変換する', () => {
    expect(sanitizeHtmlTags('<p>Hello<br>World</p>')).toBe('&lt;p&gt;Hello&lt;br&gt;World&lt;/p&gt;');
  });

  test('空文字列を処理する', () => {
    expect(sanitizeHtmlTags('')).toBe('');
  });

  test('HTMLタグを含まない文字列はそのまま返す', () => {
    expect(sanitizeHtmlTags('Hello World')).toBe('Hello World');
  });

  test('入れ子のHTMLタグを処理する', () => {
    expect(sanitizeHtmlTags('<div><span>text</span></div>')).toBe('&lt;div&gt;&lt;span&gt;text&lt;/span&gt;&lt;/div&gt;');
  });

  test('特殊なケース：< のみ', () => {
    expect(sanitizeHtmlTags('<')).toBe('&lt;');
  });

  test('特殊なケース：> のみ', () => {
    expect(sanitizeHtmlTags('>')).toBe('&gt;');
  });

  test('比較演算子を含む文字列を処理する', () => {
    expect(sanitizeHtmlTags('if (a < b && c > d)')).toBe('if (a &lt; b && c &gt; d)');
  });

  test('null や undefined の場合', () => {
    expect(sanitizeHtmlTags(null)).toBe('');
    expect(sanitizeHtmlTags(undefined)).toBe('');
  });

  test('数値を文字列として処理する', () => {
    expect(sanitizeHtmlTags(123)).toBe('123');
  });
});