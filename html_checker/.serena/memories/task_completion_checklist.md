# Task Completion Checklist

When completing any development task in the HTML Checker project, follow these steps:

## 1. Code Quality Checks
- [ ] Code follows project conventions (vanilla JS, no frameworks)
- [ ] Proper error handling implemented
- [ ] Japanese comments added where necessary
- [ ] CSS classes use `checker-` prefix
- [ ] No console.log statements in production code

## 2. Testing

### For Bookmarklet Changes:
- [ ] Run `npm run build` in bookmarklet directory
- [ ] Test on `article-test.html`
- [ ] Test on real websites (various HTML structures)
- [ ] Verify compressed version works correctly
- [ ] Check for JavaScript errors in console

### For Chrome Extension Changes:
- [ ] Reload extension in Chrome Developer Mode
- [ ] Test popup functionality
- [ ] Test content script injection
- [ ] Verify service worker (background.js) operates correctly
- [ ] Check all permissions are working
- [ ] Test on multiple websites
- [ ] Verify Chrome Storage operations

## 3. Cross-browser Compatibility
- [ ] Test in Chrome (primary target)
- [ ] Basic functionality check in Edge (Chromium-based)

## 4. Performance Validation
- [ ] No memory leaks (check Chrome DevTools Memory profiler)
- [ ] DOM operations are batched
- [ ] No blocking operations in content scripts
- [ ] Efficient CSS selectors used

## 5. Security Checks
- [ ] Content Security Policy compliance
- [ ] No inline scripts
- [ ] Proper input sanitization
- [ ] No external resource loading without validation

## 6. Documentation Updates
- [ ] Update relevant .md files if architecture changes
- [ ] Add inline comments for complex logic
- [ ] Update version number if significant change

## 7. Git Workflow
- [ ] Stage changes: `git add .`
- [ ] Write descriptive commit message in Japanese or English
- [ ] Push to repository: `git push origin main`

## 8. Final Verification
- [ ] All features working as expected
- [ ] No regression in existing functionality
- [ ] UI/UX improvements don't break existing workflows