#!/usr/bin/env python3
"""
Excel Markdown Reformatter - Simple CLI Interface
Excel to Markdown converter with AI readability enhancement
"""

import os
import sys
import argparse
from pathlib import Path
from datetime import datetime

# Add core module to path
sys.path.append(os.path.dirname(__file__))

from core.converter import ExcelConverter
from core.cleaner import MarkdownCleaner
from core.config import Config


def create_argument_parser():
    """Create command line argument parser"""
    parser = argparse.ArgumentParser(
        description='Convert Excel files to AI-readable Markdown format',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
Examples:
  # Basic conversion
  python excel_reformatter.py sample.xlsx
  
  # Custom output file
  python excel_reformatter.py sample.xlsx -o output.md
  
  # Disable AI enhancements
  python excel_reformatter.py sample.xlsx --no-stats
  
  # Show detailed information
  python excel_reformatter.py sample.xlsx --verbose
  
  # Convert specific sheets only
  python excel_reformatter.py sample.xlsx --sheets "Sheet1,Sheet3"
  
  # List available sheets
  python excel_reformatter.py sample.xlsx --list-sheets
        '''
    )
    
    parser.add_argument('excel_file', 
                       help='Path to Excel file (.xlsx or .xls)')
    
    parser.add_argument('-o', '--output',
                       help='Output markdown file path (default: auto-generated)')
    
    parser.add_argument('--no-stats', action='store_true',
                       help='Disable statistics and metadata generation')
    
    parser.add_argument('--no-cleaning', action='store_true',
                       help='Skip data cleaning (keep NaN, Unnamed columns)')
    
    parser.add_argument('--preserve-numbers', action='store_true',
                       help='Preserve original number formatting')
    
    parser.add_argument('-v', '--verbose', action='store_true',
                       help='Show detailed processing information')
    
    parser.add_argument('--config',
                       help='Custom configuration file path')
    
    parser.add_argument('--sheets',
                       help='Comma-separated list of sheet names to convert (e.g., "Sheet1,Sheet3")')
    
    parser.add_argument('--list-sheets', action='store_true',
                       help='List available sheet names and exit')
    
    return parser


def setup_config(args):
    """Setup configuration based on command line arguments"""
    config = Config(args.config) if args.config else Config()
    
    # Apply command line overrides
    if args.no_stats:
        config.output.include_statistics = False
        config.output.add_quality_score = False
        config.output.add_metadata = False
    
    if args.no_cleaning:
        config.cleaning.remove_nan = False
        config.cleaning.remove_unnamed_columns = False
        config.cleaning.normalize_whitespace = False
    
    if args.preserve_numbers:
        config.cleaning.format_numbers = False
    
    return config


def print_file_info(excel_path, sheets, verbose=False):
    """Print Excel file information"""
    print(f"📊 Excel分析結果: {os.path.basename(excel_path)}")
    print(f"   ファイルサイズ: {os.path.getsize(excel_path) / 1024:.1f} KB")
    print(f"   シート数: {len(sheets)}")
    
    if verbose:
        for i, sheet in enumerate(sheets, 1):
            print(f"   {i}. {sheet.name}")
            print(f"      行数: {sheet.rows}, 列数: {sheet.cols}")
            print(f"      データ品質: {sheet.data_quality_score:.1%}")
            if sheet.issues:
                print(f"      課題: {', '.join(sheet.issues)}")
    print()


def print_cleaning_stats(stats, verbose=False):
    """Print cleaning operation statistics"""
    print("🧹 クリーニング結果:")
    print(f"   NaN値除去: {stats.removed_nan_count}個")
    print(f"   Unnamed列除去: {stats.removed_unnamed_cols}個")
    print(f"   数値フォーマット: {stats.formatted_numbers}個")
    
    if verbose:
        print(f"   元の行数: {stats.original_lines}")
        print(f"   処理後行数: {stats.cleaned_lines}")
        print(f"   空行除去: {stats.removed_empty_rows}個")
        print(f"   空白正規化: {stats.normalized_whitespace}個")
    print()


def generate_output_path(excel_path, custom_output=None):
    """Generate output file path"""
    if custom_output:
        return custom_output
    
    excel_path = Path(excel_path)
    base_name = excel_path.stem
    return f"{base_name}_reformed.md"


def add_metadata_header(content, excel_path, stats=None):
    """Add metadata header to content"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    header_lines = [
        "<!-- Excel Markdown Reformatter で生成 -->",
        f"<!-- 元ファイル: {os.path.basename(excel_path)} -->",
        f"<!-- 処理日時: {timestamp} -->",
    ]
    
    if stats:
        header_lines.extend([
            f"<!-- NaN除去: {stats.removed_nan_count}, Unnamed列除去: {stats.removed_unnamed_cols} -->",
            f"<!-- 数値フォーマット: {stats.formatted_numbers}, 空行除去: {stats.removed_empty_rows} -->"
        ])
    
    header_lines.append("")
    return "\n".join(header_lines) + "\n" + content


def main():
    """Main CLI function"""
    parser = create_argument_parser()
    args = parser.parse_args()
    
    try:
        # Validate input file
        if not os.path.exists(args.excel_file):
            print(f"❌ エラー: ファイルが見つかりません: {args.excel_file}", file=sys.stderr)
            sys.exit(1)
        
        # Setup configuration
        config = setup_config(args)
        
        # Initialize components
        converter = ExcelConverter(config)
        cleaner = MarkdownCleaner(config)
        
        # Handle --list-sheets option
        if args.list_sheets:
            sheet_names = converter.list_sheet_names(args.excel_file)
            if sheet_names:
                print("📋 利用可能なシート:")
                for i, name in enumerate(sheet_names, 1):
                    print(f"   {i}. {name}")
            else:
                print("❌ シート情報を取得できませんでした")
            return
        
        if args.verbose:
            print("🚀 Excel Markdown Reformatter 開始")
            print(f"   設定: クリーニング{'有効' if not args.no_cleaning else '無効'}, "
                  f"統計情報{'有効' if not args.no_stats else '無効'}")
            print()
        
        # Validate Excel file
        is_valid, error_msg = converter.validate_excel_file(args.excel_file)
        if not is_valid:
            print(f"❌ ファイル検証エラー: {error_msg}", file=sys.stderr)
            sys.exit(1)
        
        # Get file information
        sheets = converter.get_sheet_info(args.excel_file)
        if args.verbose:
            print_file_info(args.excel_file, sheets, verbose=True)
        
        # Parse target sheets if specified
        target_sheets = None
        if args.sheets:
            target_sheets = [name.strip() for name in args.sheets.split(',')]
            if args.verbose:
                print(f"   対象シート: {', '.join(target_sheets)}")
        
        # Convert Excel to Markdown
        if args.verbose:
            if target_sheets:
                print("📝 指定シートを変換中...")
            else:
                print("📝 Excelファイルを変換中...")
        
        result = converter.convert_excel_to_markdown(args.excel_file, target_sheets=target_sheets)
        if not result.success:
            print(f"❌ 変換エラー: {result.error_message}", file=sys.stderr)
            sys.exit(1)
        
        # Clean markdown content
        if not args.no_cleaning:
            if args.verbose:
                print("🧹 Markdownを整理中...")
            
            cleaned_content, cleaning_stats = cleaner.clean_markdown(result.markdown_content)
            
            if args.verbose:
                print_cleaning_stats(cleaning_stats, verbose=True)
        else:
            cleaned_content = result.markdown_content
            cleaning_stats = None
        
        # Add metadata if requested
        if config.output.add_metadata:
            cleaned_content = add_metadata_header(
                cleaned_content, 
                args.excel_file, 
                cleaning_stats
            )
        
        # Generate output path
        output_path = generate_output_path(args.excel_file, args.output)
        
        # Write output file
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(cleaned_content)
        
        # Success message
        print(f"✅ 変換完了: {output_path}")
        
        if not args.verbose:
            print(f"   元ファイル: {os.path.basename(args.excel_file)}")
            print(f"   出力サイズ: {len(cleaned_content)} 文字")
            if cleaning_stats:
                print(f"   改善点: NaN除去{cleaning_stats.removed_nan_count}個, "
                      f"Unnamed列除去{cleaning_stats.removed_unnamed_cols}個")
        
    except KeyboardInterrupt:
        print("\n⚠️  処理が中断されました", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"❌ 予期しないエラー: {str(e)}", file=sys.stderr)
        if args.verbose:
            import traceback
            traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()