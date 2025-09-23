"""
Configuration management for Excel Markdown Reformatter
"""

import yaml
import os
from pathlib import Path
from typing import Dict, Any, Optional
from dataclasses import dataclass, field


@dataclass
class CleaningConfig:
    """Data cleaning configuration"""
    remove_nan: bool = True
    remove_unnamed_columns: bool = True
    format_numbers: bool = True
    empty_cell_threshold: float = 0.8
    preserve_formulas: bool = False
    normalize_whitespace: bool = True


@dataclass
class OutputConfig:
    """Output formatting configuration"""
    add_metadata: bool = True
    create_toc: bool = True
    sheet_separator: str = "\n\n---\n\n"
    include_statistics: bool = True
    add_quality_score: bool = True
    timestamp_format: str = "%Y-%m-%d %H:%M:%S"


@dataclass
class AIConfig:
    """AI enhancement configuration"""
    enabled: bool = False
    auto_descriptions: bool = False
    data_insights: bool = False
    claude_integration: bool = False
    enhancement_level: str = "basic"  # basic, standard, comprehensive


@dataclass
class ProcessingConfig:
    """Processing behavior configuration"""
    parallel_processing: bool = True
    max_workers: int = 4
    chunk_size: int = 1000
    memory_limit_mb: int = 512
    timeout_seconds: int = 300


class Config:
    """Main configuration manager"""
    
    def __init__(self, config_path: Optional[str] = None):
        self.config_path = config_path or self._get_default_config_path()
        self.cleaning = CleaningConfig()
        self.output = OutputConfig()
        self.ai = AIConfig()
        self.processing = ProcessingConfig()
        
        if os.path.exists(self.config_path):
            self.load_from_file(self.config_path)
    
    def _get_default_config_path(self) -> str:
        """Get default configuration file path"""
        return os.path.join(os.path.dirname(__file__), '..', 'config', 'default.yaml')
    
    def load_from_file(self, config_path: str) -> None:
        """Load configuration from YAML file"""
        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                config_data = yaml.safe_load(f)
            
            if 'cleaning' in config_data:
                self._update_dataclass(self.cleaning, config_data['cleaning'])
            
            if 'output' in config_data:
                self._update_dataclass(self.output, config_data['output'])
            
            if 'ai_enhancement' in config_data:
                self._update_dataclass(self.ai, config_data['ai_enhancement'])
                
            if 'processing' in config_data:
                self._update_dataclass(self.processing, config_data['processing'])
                
        except Exception as e:
            print(f"Warning: Failed to load config from {config_path}: {e}")
    
    def _update_dataclass(self, instance: Any, data: Dict[str, Any]) -> None:
        """Update dataclass instance with dictionary data"""
        for key, value in data.items():
            if hasattr(instance, key):
                setattr(instance, key, value)
    
    def save_to_file(self, config_path: str) -> None:
        """Save current configuration to YAML file"""
        config_data = {
            'cleaning': {
                'remove_nan': self.cleaning.remove_nan,
                'remove_unnamed_columns': self.cleaning.remove_unnamed_columns,
                'format_numbers': self.cleaning.format_numbers,
                'empty_cell_threshold': self.cleaning.empty_cell_threshold,
                'preserve_formulas': self.cleaning.preserve_formulas,
                'normalize_whitespace': self.cleaning.normalize_whitespace,
            },
            'output': {
                'add_metadata': self.output.add_metadata,
                'create_toc': self.output.create_toc,
                'sheet_separator': self.output.sheet_separator,
                'include_statistics': self.output.include_statistics,
                'add_quality_score': self.output.add_quality_score,
                'timestamp_format': self.output.timestamp_format,
            },
            'ai_enhancement': {
                'enabled': self.ai.enabled,
                'auto_descriptions': self.ai.auto_descriptions,
                'data_insights': self.ai.data_insights,
                'claude_integration': self.ai.claude_integration,
                'enhancement_level': self.ai.enhancement_level,
            },
            'processing': {
                'parallel_processing': self.processing.parallel_processing,
                'max_workers': self.processing.max_workers,
                'chunk_size': self.processing.chunk_size,
                'memory_limit_mb': self.processing.memory_limit_mb,
                'timeout_seconds': self.processing.timeout_seconds,
            }
        }
        
        os.makedirs(os.path.dirname(config_path), exist_ok=True)
        with open(config_path, 'w', encoding='utf-8') as f:
            yaml.dump(config_data, f, default_flow_style=False, allow_unicode=True)
    
    def get_dict(self) -> Dict[str, Any]:
        """Get configuration as dictionary"""
        return {
            'cleaning': self.cleaning.__dict__,
            'output': self.output.__dict__,
            'ai_enhancement': self.ai.__dict__,
            'processing': self.processing.__dict__,
        }