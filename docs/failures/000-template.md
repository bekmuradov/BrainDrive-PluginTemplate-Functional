# Failure-XXX: [Failure Title - What Went Wrong]

**Date**: YYYY-MM-DD
**Author**: [Your Name]
**Time Wasted**: [Estimate: X hours]
**Impact**: [Low | Medium | High | Critical]
**Status**: [Resolved | Unresolved | Partially Resolved]

---

## What Happened

### The Mistake
Clear description of what went wrong or what incorrect approach was taken.

### How We Got Here
Steps that led to this mistake:
1. Step 1
2. Step 2
3. Step 3 (where it went wrong)

### Code Example (Before - What Failed)
```javascript
// The code or approach that didn't work
// Show the actual mistake
```

---

## Root Cause

### Why It Happened
Deep analysis of the underlying reason:
- **Incorrect Assumption**: What did we assume that was wrong?
- **Missing Knowledge**: What information did we lack?
- **Tool Limitation**: Was this a limitation of a tool/framework?
- **Communication Gap**: Was this a misunderstanding?

### Warning Signs (What We Missed)
Signs that this approach was problematic:
- Warning sign 1
- Warning sign 2
- Warning sign 3

---

## Impact

### Immediate Consequences
- Impact 1: Description
- Impact 2: Description

### Time Cost
- **Investigation**: X hours
- **Implementation**: Y hours
- **Debugging**: Z hours
- **Rollback/Fix**: W hours
- **Total**: Sum hours

### Technical Debt Created
Any long-term consequences or technical debt introduced.

---

## Resolution

### What We Did Instead
The correct approach that actually worked.

### Code Example (After - What Worked)
```javascript
// The corrected code or approach
// Show the working solution
```

### Key Differences
What made the working solution different from the failed approach:
1. Difference 1
2. Difference 2

---

## Lessons Learned

### What NOT to Do
- ❌ **Mistake 1**: Never do X because Y
- ❌ **Mistake 2**: Avoid Z because W
- ❌ **Mistake 3**: Don't assume A without checking B

### What TO Do Instead
- ✅ **Correct Pattern 1**: Always do X when Y
- ✅ **Correct Pattern 2**: Check Z before W
- ✅ **Correct Pattern 3**: Verify A by testing B

### Key Takeaway
One-sentence summary of the most important lesson.

---

## Prevention Checklist

For future developers/AI agents working on similar features:

**Before implementing [related feature], check:**
- [ ] Condition 1 that would lead to this mistake
- [ ] Condition 2 that would lead to this mistake
- [ ] Condition 3 that would lead to this mistake

**During implementation:**
- [ ] Verification step 1
- [ ] Verification step 2
- [ ] Verification step 3

**After implementation:**
- [ ] Test case 1 to catch this issue
- [ ] Test case 2 to catch this issue

---

## Related Documentation

- [Link to ADR if one was created from this failure]
- [Link to issue/PR where this was discovered]
- [Link to documentation updated as a result]

---

## Search Keywords

(For easy discovery by AI agents and developers)

`keyword1`, `keyword2`, `keyword3`, `error-message`, `framework-feature`

---

## Usage Instructions

To document a new failure:

1. Copy this template:
   ```bash
   cp docs/failures/000-template.md docs/failures/001-your-failure-name.md
   ```

2. When to create a failure log:
   - Made incorrect assumption (>1 hour wasted)
   - Implemented feature that didn't work (later fixed)
   - Hit unexpected error that took significant time
   - Used wrong approach (discovered better way)
   - Made mistake others might repeat

3. Be honest and specific:
   - Don't hide mistakes - document them for learning
   - Include actual error messages
   - Show real code that failed
   - Explain the exact thought process that led to the mistake

4. Focus on prevention:
   - How can future developers avoid this?
   - What warning signs should they watch for?
   - What questions should they ask first?

**Remember**: Failures documented = Failures prevented. One hour documenting saves 10 hours of repeated mistakes.
