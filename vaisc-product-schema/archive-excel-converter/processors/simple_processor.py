#!/usr/bin/env python3
"""
シンプルなAPI仕様書変換ツール
Excel → MarkDown → 人間が読みやすい形式
"""

import re
import sys


def extract_api_info(raw_content):
    """生データから実際のAPI情報を抽出"""
    lines = raw_content.split('\n')
    
    api_fields = []
    
    for line in lines:
        if '|' in line and line.count('|') > 10:
            cells = [cell.strip() for cell in line.split('|')]
            
            # データ行を検出（No.とJSONの両方が存在）
            if (len(cells) > 50 and 
                cells[3] and cells[3].isdigit() and  # No.列
                cells[4] and '"' in cells[4]):       # JSON列
                
                # JSONからフィールド名と値を抽出
                json_text = cells[4]
                json_match = re.search(r'"([^"]+)":\s*(.+)', json_text)
                
                if json_match:
                    field_name = json_match.group(1)
                    field_value = json_match.group(2).rstrip(',')
                    
                    field_info = {
                        'no': cells[3],
                        'field_name': field_name,
                        'value_example': field_value,
                        'description': cells[49] if len(cells) > 49 else '',
                        'master_name': cells[74] if len(cells) > 74 else '',
                        'logical_name': cells[81] if len(cells) > 81 else '',
                        'physical_name': cells[88] if len(cells) > 88 else '',
                        'search_voi_usage': cells[101] if len(cells) > 101 else '',
                        'app_usage': cells[107] if len(cells) > 107 else '',
                        'vaics_after': cells[125] if len(cells) > 125 else ''
                    }
                    
                    api_fields.append(field_info)
    
    return api_fields


def generate_readable_output(api_fields):
    """人間が読みやすい形式で出力生成"""
    
    output = []
    output.append("# VAISC サーチAPI レスポンス仕様書")
    output.append("")
    output.append("VAISCのサーチAPIが返すJSONレスポンスの詳細仕様です。")
    output.append("")
    
    # サマリー
    output.append("## 📊 サマリー")
    output.append(f"- **総フィールド数**: {len(api_fields)}個")
    output.append(f"- **エンドポイント**: `/api/search`")
    output.append("")
    
    # フィールド一覧
    output.append("## 📋 フィールド一覧")
    output.append("")
    output.append("| No. | フィールド名 | 型 | 説明 |")
    output.append("|-----|-------------|-----|------|")
    
    for field in api_fields:
        # 値の例から型を推測
        value_type = "string"
        if field['value_example'].isdigit():
            value_type = "number"
        elif field['value_example'].lower() in ['true', 'false']:
            value_type = "boolean"
        elif field['value_example'].startswith('['):
            value_type = "array"
        elif field['value_example'].startswith('{'):
            value_type = "object"
            
        output.append(f"| {field['no']} | `{field['field_name']}` | {value_type} | {field['description']} |")
    
    output.append("")
    
    # 詳細仕様
    output.append("## 🔍 詳細仕様")
    output.append("")
    
    for field in api_fields:
        output.append(f"### {field['field_name']}")
        output.append("")
        
        # 基本情報
        output.append("**基本情報**")
        output.append(f"- **No.**: {field['no']}")
        output.append(f"- **フィールド名**: `{field['field_name']}`")
        output.append(f"- **値の例**: `{field['value_example']}`")
        output.append(f"- **説明**: {field['description']}")
        output.append("")
        
        # データベース情報
        if field['physical_name'] or field['logical_name']:
            output.append("**データベース情報**")
            if field['physical_name']:
                output.append(f"- **物理名**: `{field['physical_name']}`")
            if field['logical_name']:
                output.append(f"- **論理名**: {field['logical_name']}")
            if field['master_name']:
                output.append(f"- **マスタ**: {field['master_name']}")
            output.append("")
        
        # 利用状況
        usage_info = []
        if field['search_voi_usage']:
            usage_info.append(f"**search-voi**: {field['search_voi_usage']}")
        if field['app_usage']:
            usage_info.append(f"**アプリ**: {field['app_usage']}")
        if field['vaics_after']:
            usage_info.append(f"**VAICS導入後**: {field['vaics_after']}")
        
        if usage_info:
            output.append("**利用状況**")
            for usage in usage_info:
                output.append(f"- {usage}")
            output.append("")
        
        # JSON例
        output.append("**JSON例**")
        output.append("```json")
        output.append(f'"{field["field_name"]}": {field["value_example"]}')
        output.append("```")
        output.append("")
        output.append("---")
        output.append("")
    
    return '\n'.join(output)


def main():
    if len(sys.argv) != 3:
        print("使用方法: python simple_processor.py input.md output.md")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            raw_content = f.read()
        
        print("🔍 APIフィールド情報を解析中...")
        api_fields = extract_api_info(raw_content)
        print(f"   ✅ {len(api_fields)}個のフィールドを検出")
        
        print("📝 読みやすい形式で出力生成中...")
        readable_content = generate_readable_output(api_fields)
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(readable_content)
        
        print(f"✅ 完了: {output_file}")
        print("\n📋 検出されたフィールド:")
        for field in api_fields[:5]:  # 最初の5つを表示
            print(f"   - {field['no']:2}: {field['field_name']} = {field['value_example']}")
        if len(api_fields) > 5:
            print(f"   ... 他{len(api_fields)-5}個")
        
    except Exception as e:
        print(f"❌ エラー: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()