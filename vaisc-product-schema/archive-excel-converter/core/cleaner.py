"""
Markdown cleaner for Excel conversion results
AI読みやすさ向上のためのクリーニング機能
"""

import re
from typing import List, Dict, Tuple, Optional
from dataclasses import dataclass

from .config import Config


@dataclass
class CleaningStats:
    """Cleaning operation statistics"""
    original_lines: int = 0
    cleaned_lines: int = 0
    removed_nan_count: int = 0
    removed_unnamed_cols: int = 0
    formatted_numbers: int = 0
    removed_empty_rows: int = 0
    normalized_whitespace: int = 0


class MarkdownCleaner:
    """Markdown table cleaner for AI readability enhancement"""
    
    def __init__(self, config: Optional[Config] = None):
        self.config = config or Config()
        self.stats = CleaningStats()
    
    def clean_markdown(self, content: str) -> Tuple[str, CleaningStats]:
        """
        Clean markdown content for AI readability
        
        Args:
            content: Raw markdown content from MarkItDown
            
        Returns:
            Tuple of (cleaned_content, cleaning_statistics)
        """
        self.stats = CleaningStats()
        lines = content.split('\n')
        self.stats.original_lines = len(lines)
        
        cleaned_lines = []
        i = 0
        
        while i < len(lines):
            line = lines[i].strip()
            
            # Skip empty lines
            if not line:
                cleaned_lines.append('')
                i += 1
                continue
            
            # Handle sheet headers
            if line.startswith('## '):
                cleaned_lines.append(line)
                # Add metadata if enabled
                if self.config.output.include_statistics:
                    # Look ahead to find table and add statistics
                    table_stats = self._analyze_upcoming_table(lines[i+1:])
                    if table_stats:
                        cleaned_lines.append('')
                        cleaned_lines.append(f"**データ行数**: {table_stats['data_rows']}行")
                        cleaned_lines.append(f"**データ列数**: {table_stats['data_cols']}列")
                        if table_stats['quality_score']:
                            cleaned_lines.append(f"**データ品質**: {table_stats['quality_score']:.1%}")
                        cleaned_lines.append('')
                i += 1
                continue
            
            # Handle table content
            if '|' in line:
                table_lines = self._extract_table_block(lines[i:])
                cleaned_table = self._clean_table_block(table_lines)
                cleaned_lines.extend(cleaned_table)
                i += len(table_lines)
                continue
            
            # Handle regular content
            cleaned_line = self._clean_regular_line(line)
            if cleaned_line is not None:
                cleaned_lines.append(cleaned_line)
            
            i += 1
        
        self.stats.cleaned_lines = len(cleaned_lines)
        return '\n'.join(cleaned_lines), self.stats
    
    def _extract_table_block(self, lines: List[str]) -> List[str]:
        """Extract complete table block starting from current position"""
        table_lines = []
        for line in lines:
            if '|' in line or (line.strip() == '' and table_lines):
                table_lines.append(line)
            else:
                break
        return table_lines
    
    def _clean_table_block(self, table_lines: List[str]) -> List[str]:
        """Clean a complete table block"""
        if not table_lines:
            return []
        
        # Separate header, separator, and data rows
        header_line = None
        separator_line = None
        data_lines = []
        
        for line in table_lines:
            line = line.strip()
            if not line:
                continue
                
            if '|' in line:
                if header_line is None:
                    header_line = line
                elif separator_line is None and '---' in line:
                    separator_line = line
                else:
                    data_lines.append(line)
        
        if not header_line:
            return []
        
        # Clean header
        cleaned_header, header_mapping = self._clean_table_header(header_line)
        
        # Clean separator
        cleaned_separator = self._clean_table_separator(separator_line, header_mapping)
        
        # Clean data rows
        cleaned_data = []
        for data_line in data_lines:
            cleaned_row = self._clean_table_row(data_line, header_mapping)
            if cleaned_row and self._is_row_meaningful(cleaned_row):
                cleaned_data.append(cleaned_row)
            else:
                self.stats.removed_empty_rows += 1
        
        # Assemble cleaned table
        result = []
        if cleaned_header:
            result.append(cleaned_header)
        if cleaned_separator:
            result.append(cleaned_separator)
        result.extend(cleaned_data)
        
        return result
    
    def _clean_table_header(self, header_line: str) -> Tuple[str, Dict[int, bool]]:
        """
        Clean table header and create column mapping
        
        Returns:
            Tuple of (cleaned_header, column_mapping)
            column_mapping: {column_index: should_keep}
        """
        cells = self._split_table_row(header_line)
        header_mapping = {}
        cleaned_cells = []
        
        for i, cell in enumerate(cells):
            cell = cell.strip()
            
            # Check if column should be removed
            if self.config.cleaning.remove_unnamed_columns and 'Unnamed:' in cell:
                header_mapping[i] = False
                self.stats.removed_unnamed_cols += 1
                continue
            
            header_mapping[i] = True
            cleaned_cells.append(cell)
        
        return '| ' + ' | '.join(cleaned_cells) + ' |', header_mapping
    
    def _clean_table_separator(self, separator_line: str, header_mapping: Dict[int, bool]) -> str:
        """Clean table separator based on header mapping"""
        if not separator_line:
            return '| ' + ' | '.join(['---'] * len([k for k, v in header_mapping.items() if v])) + ' |'
        
        cells = self._split_table_row(separator_line)
        cleaned_cells = []
        
        for i, cell in enumerate(cells):
            if header_mapping.get(i, True):
                cleaned_cells.append('---')
        
        return '| ' + ' | '.join(cleaned_cells) + ' |'
    
    def _clean_table_row(self, row_line: str, header_mapping: Dict[int, bool]) -> str:
        """Clean individual table data row"""
        cells = self._split_table_row(row_line)
        cleaned_cells = []
        
        for i, cell in enumerate(cells):
            if not header_mapping.get(i, True):
                continue
            
            cell = cell.strip()
            
            # Remove NaN values
            if self.config.cleaning.remove_nan and cell.upper() in ['NAN', 'NULL', 'N/A']:
                cell = ''
                self.stats.removed_nan_count += 1
            
            # Format numbers
            if self.config.cleaning.format_numbers:
                cell = self._format_number_cell(cell)
            
            # Normalize whitespace
            if self.config.cleaning.normalize_whitespace:
                cell = re.sub(r'\s+', ' ', cell).strip()
                self.stats.normalized_whitespace += 1
            
            cleaned_cells.append(cell)
        
        return '| ' + ' | '.join(cleaned_cells) + ' |'
    
    def _split_table_row(self, row: str) -> List[str]:
        """Split table row into cells, handling edge cases"""
        # Remove leading/trailing pipes and split
        row = row.strip()
        if row.startswith('|'):
            row = row[1:]
        if row.endswith('|'):
            row = row[:-1]
        
        return row.split('|')
    
    def _format_number_cell(self, cell: str) -> str:
        """Format number cells for better readability"""
        # Remove .0 from whole numbers
        if re.match(r'^\d+\.0$', cell):
            self.stats.formatted_numbers += 1
            return cell[:-2]
        
        # Format large numbers with commas (optional)
        if re.match(r'^\d{4,}$', cell):
            try:
                num = int(cell)
                return f"{num:,}"
            except ValueError:
                pass
        
        return cell
    
    def _is_row_meaningful(self, row: str) -> bool:
        """Check if a table row contains meaningful data"""
        cells = self._split_table_row(row)
        non_empty_cells = [cell.strip() for cell in cells if cell.strip()]
        
        # Row is meaningful if it has more than threshold percentage of non-empty cells
        threshold = 1 - self.config.cleaning.empty_cell_threshold
        meaningful_ratio = len(non_empty_cells) / max(len(cells), 1)
        
        return meaningful_ratio >= threshold
    
    def _clean_regular_line(self, line: str) -> Optional[str]:
        """Clean non-table content lines"""
        if self.config.cleaning.normalize_whitespace:
            line = re.sub(r'\s+', ' ', line).strip()
        
        # Skip completely empty lines after normalization
        if not line:
            return None
        
        return line
    
    def _analyze_upcoming_table(self, upcoming_lines: List[str]) -> Optional[Dict]:
        """Analyze upcoming table to generate statistics"""
        table_lines = []
        for line in upcoming_lines:
            if '|' in line:
                table_lines.append(line)
            elif line.strip() == '':
                continue
            else:
                break
        
        if len(table_lines) < 2:  # Need at least header and one data row
            return None
        
        # Count data rows (exclude header and separator)
        data_rows = 0
        for line in table_lines[2:]:  # Skip header and separator
            if '|' in line and '---' not in line:
                data_rows += 1
        
        # Count data columns
        if table_lines:
            header_cells = self._split_table_row(table_lines[0])
            data_cols = len([cell for cell in header_cells if cell.strip() and 'Unnamed:' not in cell])
        else:
            data_cols = 0
        
        # Calculate quality score
        total_cells = data_rows * data_cols
        if total_cells > 0:
            non_empty_count = 0
            for line in table_lines[2:]:
                cells = self._split_table_row(line)
                for cell in cells:
                    if cell.strip() and cell.strip().upper() not in ['NAN', 'NULL', 'N/A']:
                        non_empty_count += 1
            quality_score = non_empty_count / total_cells
        else:
            quality_score = 0
        
        return {
            'data_rows': data_rows,
            'data_cols': data_cols,
            'quality_score': quality_score
        }