# ADR-XXX: [Decision Title]

**Status**: [Proposed | Accepted | Deprecated | Superseded]
**Date**: YYYY-MM-DD
**Author**: [Your Name]
**Related**: [Links to commits, issues, PRs, other ADRs]

---

## Context

### Background
What is the situation and problem that needs a decision?
- What constraints exist (technical, business, time)?
- What is the current state?
- Why is a decision needed now?

### Problem Statement
Clear, concise statement of the problem this decision addresses.

---

## Decision

### What We're Doing
The specific approach we're taking (be concrete and actionable).

### Why This Approach
Key reasons for this decision:
1. **Reason 1**: Explanation
2. **Reason 2**: Explanation
3. **Reason 3**: Explanation

### Implementation Details
```javascript
// Code examples showing the decision in practice
// Be specific - show before/after if applicable
```

---

## Consequences

### Positive Consequences (Pros)
- ✅ **Benefit 1**: Description
- ✅ **Benefit 2**: Description
- ✅ **Benefit 3**: Description

### Negative Consequences (Cons)
- ❌ **Trade-off 1**: Description and mitigation strategy
- ❌ **Trade-off 2**: Description and mitigation strategy

### Risks
- ⚠️ **Risk 1**: Description and monitoring plan
- ⚠️ **Risk 2**: Description and monitoring plan

---

## Alternatives Considered

### Alternative 1: [Name]
**Description**: What this alternative would have been

**Pros**:
- Advantage 1
- Advantage 2

**Cons**:
- Disadvantage 1
- Disadvantage 2

**Why Rejected**: Specific reason(s) we didn't choose this

---

### Alternative 2: [Name]
**Description**: What this alternative would have been

**Pros**:
- Advantage 1
- Advantage 2

**Cons**:
- Disadvantage 1
- Disadvantage 2

**Why Rejected**: Specific reason(s) we didn't choose this

---

## References

- [Link to related issue/PR]
- [Link to documentation]
- [Link to research/article]
- [Link to team discussion]

---

## Notes

Additional context, future considerations, or follow-up tasks.

---

## Usage Instructions

To create a new ADR:

1. Copy this template:
   ```bash
   cp docs/decisions/000-template.md docs/decisions/001-your-decision-name.md
   ```

2. Fill in all sections:
   - Update the title with your decision
   - Set status (usually "Proposed" or "Accepted")
   - Add today's date
   - Complete all sections with specific details

3. When to create an ADR:
   - Chose between 2+ implementation approaches
   - Selected a library, framework, or tool
   - Made a significant architectural change
   - Established a pattern others should follow
   - Made a decision with long-term consequences

4. Link it:
   - Reference it in commit messages
   - Link from code comments when applying the pattern
   - Reference in PR descriptions

**Remember**: ADRs document WHY, not just WHAT. Future developers (including AI agents) need to understand the reasoning.
