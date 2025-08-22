# Original vs Current Detection Rules Analysis

## Original Rules (from backup/content-script.original.js)
The original implementation had 16 detection rules:

1. `missing_h1` - Missing H1 tag
2. `heading_structure` - Heading structure issues
3. `missing_alt` - Missing alt attributes on images
4. `link_as_button` - Links misused as buttons (href="#" + onclick)
5. `date_in_div` - Date information in DIV tags instead of <time>
6. `old_robots_meta` - Deprecated ROBOTS meta directives
7. `deprecated_meta_tags` - Deprecated meta keywords
8. `missing_aria_required` - Missing required ARIA attributes
9. `missing_aria_expanded` - Missing aria-expanded on interactive elements
10. `missing_aria_current` - Missing aria-current on navigation
11. `missing_form_labels` - Form elements without labels
12. `layout_table_usage` - Layout tables instead of CSS
13. `legacy_google_analytics` - Old Google Analytics UA- code
14. `legacy_gtm_container` - Legacy GTM containers
15. `unused_adobe_code` - Unused Adobe Analytics code
16. `unnecessary_noscript` - Empty noscript tags

## Current Rules (from src/content-script/analysis/)
The current implementation has 28 rules across multiple modules:

### Active Rules:
**Heading (2 rules):**
- `missing_h1` ✓ (matches original)
- `heading_structure` ✓ (matches original)

**Accessibility (6 rules):**
- `missing_alt` ✓ (matches original) 
- `missing_form_labels` ✓ (matches original)
- `missing_aria_expanded` ✓ (matches original)
- `missing_aria_current` ✓ (matches original)
- `link_button_misuse` ✓ (matches original 'link_as_button')
- `layout_table_usage` ✓ (matches original)

**SEO (11 rules):**
- `missing_title` ⚠️ (NEW - not in original)
- `suboptimal_title_length` ⚠️ (NEW - not in original)
- `missing_meta_description` ⚠️ (NEW - not in original)
- `suboptimal_description_length` ⚠️ (NEW - not in original)
- `missing_canonical` ⚠️ (NEW - not in original)
- `duplicate_meta_description` ⚠️ (NEW - not in original)
- `duplicate_meta_keywords` ⚠️ (NEW - not in original)
- `duplicate_viewport` ⚠️ (NEW - not in original)
- `missing_open_graph` ⚠️ (NEW - not in original)
- `missing_og_title` ⚠️ (NEW - not in original)
- `missing_og_image` ⚠️ (NEW - not in original)

**Structure (8 rules):**
- `missing_main` ⚠️ (NEW - not in original)
- `multiple_main` ⚠️ (NEW - not in original)
- `missing_header` ⚠️ (NEW - not in original)
- `missing_nav` ⚠️ (NEW - not in original)
- `presentational_tags` ⚠️ (NEW - not in original)
- `excessive_inline_styles` ⚠️ (NEW - not in original)
- `duplicate_id` ⚠️ (NEW - not in original)
- `empty_elements` ⚠️ (NEW - not in original)

### Disabled Rules (commented out):
**Semantic (1 rule):**
- `date_in_div` 🔄 (exists but disabled - was in original)

**Cleanup (6 rules):**
- `legacy_google_analytics` 🔄 (exists but disabled - was in original)
- `legacy_gtm_container` 🔄 (exists but disabled - was in original)
- `adobe_analytics_code` 🔄 (exists but disabled - was in original, name changed)
- `unnecessary_noscript` 🔄 (exists but disabled - was in original)
- `old_robots_meta` 🔄 (exists but disabled - was in original)
- `deprecated_meta_keywords` 🔄 (exists but disabled - was in original)

## Missing Original Rules:
- `missing_aria_required` ❌ (not implemented in current version)

## Summary:
- **8 rules match** the original (currently active)
- **7 rules from original** are implemented but disabled
- **1 original rule missing** (`missing_aria_required`)
- **19 new rules added** (11 SEO + 8 Structure rules)

## Required Actions:
1. Remove all 19 NEW rules that weren't in the original
2. Re-enable the 7 disabled original rules
3. Implement the missing `missing_aria_required` rule
4. Ensure rule logic matches original implementation exactly