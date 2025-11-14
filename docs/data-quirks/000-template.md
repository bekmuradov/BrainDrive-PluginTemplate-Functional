# Data-Quirk-XXX: [Non-Obvious Data Behavior]

**Date**: YYYY-MM-DD
**Author**: [Your Name]
**Severity**: [Low | Medium | High | Critical]
**Affected Features**: [List features that must account for this quirk]

---

## The Quirk

### Observed Behavior
What non-obvious behavior did you discover about the data?

**Example**: "API returns timestamps in mixed timezones - some UTC, some local"

### Where It Occurs
- **Service/API**: Name of service or endpoint
- **Data Source**: Database table, API endpoint, file, etc.
- **Conditions**: When does this happen (always, sometimes, specific conditions)?

---

## Why It Matters

### Feature Impact
How does this quirk affect features or functionality?

**Examples**:
- "Cannot assume all timestamps are UTC - sorting breaks"
- "GPS data disappears after midnight - no historical analysis possible"
- "User IDs change between environments - joins fail in staging"

### What Goes Wrong If Ignored
Specific problems that occur if developers don't know about this:
1. Problem 1
2. Problem 2
3. Problem 3

---

## Root Cause

### Why This Exists
Technical or business reason for this behavior:
- System design choice
- Legacy data migration
- Vendor API limitation
- Performance optimization
- Retention policy

### Is It Fixable?
- **Upstream Fix Possible**: Yes/No
- **Our Workaround Required**: Yes/No
- **Why Not Fixed**: Reason if not fixable

---

## Detection

### How to Discover It
Steps to verify this quirk exists:

```javascript
// Example code to detect the quirk
// This helps future developers confirm the behavior
```

### Warning Signs
Indicators that you're hitting this quirk:
- Symptom 1
- Symptom 2
- Symptom 3

---

## Correct Patterns

### How to Handle It

**DO THIS** ✅:
```javascript
// Correct pattern that accounts for the quirk
// Show working code example
```

**NOT THIS** ❌:
```javascript
// Incorrect pattern that breaks due to the quirk
// Show what NOT to do
```

### Best Practices
1. **Practice 1**: Explanation
2. **Practice 2**: Explanation
3. **Practice 3**: Explanation

---

## Examples

### Example 1: [Use Case]
**Scenario**: Description of real-world scenario

**Code**:
```javascript
// Working example handling this quirk
```

**Result**: What happens

---

### Example 2: [Use Case]
**Scenario**: Description of real-world scenario

**Code**:
```javascript
// Another working example
```

**Result**: What happens

---

## Testing Strategy

### Pre-flight Checks
Checks to run before relying on this data:
- [ ] Check 1
- [ ] Check 2
- [ ] Check 3

### Unit Test Pattern
```javascript
// Example test that accounts for this quirk
describe('Feature with [quirk]', () => {
  it('should handle [quirk behavior]', () => {
    // Test code
  });
});
```

---

## Related Issues

- [Link to bug report that discovered this]
- [Link to feature implementation that handles it]
- [Link to upstream issue if applicable]

---

## Developer Checklist

When working with [affected data source]:

**Before implementation:**
- [ ] Read this quirk documentation
- [ ] Verify quirk still exists (may have been fixed)
- [ ] Plan for quirk in design

**During implementation:**
- [ ] Use correct pattern from above
- [ ] Add defensive checks
- [ ] Log unexpected behavior

**After implementation:**
- [ ] Test edge cases related to quirk
- [ ] Document quirk handling in code comments
- [ ] Update this doc if behavior changes

---

## Search Keywords

(For easy discovery)

`keyword1`, `keyword2`, `api-name`, `table-name`, `specific-field-name`

---

## Usage Instructions

To document a new data quirk:

1. Copy this template:
   ```bash
   cp docs/data-quirks/000-template.md docs/data-quirks/001-your-quirk-name.md
   ```

2. When to create a data quirk doc:
   - Data behaves differently than expected
   - Non-obvious retention/purge policies
   - Schema inconsistencies (NULL values, data types)
   - API returns inconsistent formats
   - Timezone or localization issues
   - Cross-environment data differences

3. Focus on detection and handling:
   - How do developers discover this quirk?
   - What's the correct way to handle it?
   - What breaks if ignored?

4. Keep it updated:
   - Mark as [RESOLVED] if upstream fixes it
   - Update if behavior changes
   - Add new examples as discovered

**Remember**: Data quirks compound - one quirk can cascade into multiple bugs across features. Document once, prevent many failures.
