# Compounding Engineering Documentation

This directory contains the **Compounding Engineering** documentation system for the BrainDrive Plugin Template project.

## 📂 Directory Structure

```
docs/
├── decisions/           # Architecture Decision Records (ADRs)
│   └── 000-template.md
├── failures/            # Lessons learned from mistakes
│   └── 000-template.md
├── data-quirks/         # Non-obvious data behavior
│   └── 000-template.md
├── integrations/        # External API/service integration
│   └── 000-template.md
└── COMPOUNDING_GUIDE.md # Complete guide to this system
```

## 🚀 Quick Start

### For Developers

**To document a decision you made**:
```bash
cp docs/decisions/000-template.md docs/decisions/001-your-decision.md
# Edit the file with your decision details
```

**To document a mistake/failure**:
```bash
cp docs/failures/000-template.md docs/failures/001-your-failure.md
# Document what went wrong, why, and how to prevent it
```

**To document a data quirk**:
```bash
cp docs/data-quirks/000-template.md docs/data-quirks/001-quirk-name.md
# Document the unexpected behavior and correct handling
```

**To document an integration**:
```bash
cp docs/integrations/000-template.md docs/integrations/service-name.md
# Document the API, authentication, quirks, and examples
```

### For AI Agents

**Before implementing any feature**:
```bash
# Search existing knowledge
grep -r "keyword" docs/decisions/
grep -r "keyword" docs/failures/
grep -r "keyword" docs/data-quirks/
ls docs/integrations/
```

**Auto-document when**:
- ✅ Made architectural decision → Create ADR
- ✅ Discovered data quirk → Create Data Quirk Doc
- ✅ Hit error/made mistake → Create Failure Log
- ✅ Integrated external system → Create Integration Doc

## 📖 Documentation Types

### 1. Architecture Decision Records (ADRs)
**Purpose**: Document WHY architectural choices were made

**Contents**:
- Context (why decision needed)
- Problem statement
- Decision (what we're doing)
- Consequences (pros/cons)
- Alternatives considered
- References

**Example use cases**:
- Chose React Hooks over Class Components
- Selected webpack externals over Module Federation shared
- Decided to use CSS custom properties (no Tailwind)

---

### 2. Failure Logs
**Purpose**: Document mistakes so they're never repeated

**Contents**:
- What happened (the mistake)
- Root cause (why it happened)
- Impact (time wasted, consequences)
- Resolution (what worked)
- Prevention checklist

**Example use cases**:
- "Invalid hook call" error from React duplication
- Memory leak from missing useEffect cleanup
- Service undefined without lifecycle_manager declaration

---

### 3. Data Quirks
**Purpose**: Document non-obvious data behavior

**Contents**:
- The quirk (observed behavior)
- Why it matters (feature impact)
- Root cause (why it exists)
- Detection (how to find it)
- Correct patterns (how to handle)

**Example use cases**:
- BrainDrive services may be undefined if not declared
- CSS variables auto-update with theme changes
- PluginState service auto-loads on configuration

---

### 4. Integration Docs
**Purpose**: Document external API/service integrations

**Contents**:
- Purpose (what it does)
- Authentication (setup & credentials)
- Data format & schema
- Quirks & gotchas
- Error handling
- Usage examples

**Example use cases**:
- BrainDrive Theme Service integration
- BrainDrive API Service integration
- External API integration

---

## 💡 Why Compounding Engineering?

### The Problem
```
Developer 1: Spends 4 hours debugging issue X
Developer 2: Spends 4 hours debugging same issue X  ❌
Developer 3: Spends 4 hours debugging same issue X  ❌
Total: 12 hours wasted
```

### The Solution
```
Developer 1: Spends 4 hours debugging + 15 min documenting = 4.25 hours
Developer 2: Reads doc (5 min) + fixes correctly = 0.5 hours  ✅
Developer 3: Reads doc (5 min) + fixes correctly = 0.5 hours  ✅
Total: 5.25 hours
Savings: 6.75 hours (56% reduction)
```

## 🎯 When to Document

### Always Document
- ✅ Architectural decisions with long-term impact
- ✅ Mistakes that wasted >1 hour
- ✅ Non-obvious data behavior
- ✅ External integrations with gotchas

### Don't Document
- ❌ Routine tasks (daily work)
- ❌ Obvious patterns (well-known best practices)
- ❌ Temporary workarounds (will be removed)

## 📚 Related Documentation

- **[COMPOUNDING_GUIDE.md](COMPOUNDING_GUIDE.md)** - Complete guide with examples
- **[AI_AGENT_INSTRUCTIONS.md](AI_AGENT_INSTRUCTIONS.md)** - AI agent compounding behavior
- **[SERVICE_BRIDGES.md](SERVICE_BRIDGES.md)** - BrainDrive service integration
- **[HOOKS_GUIDE.md](HOOKS_GUIDE.md)** - React hooks best practices

## 🔄 Keeping Documentation Updated

### When to Update

1. **Decision superseded**: Mark as `[SUPERSEDED]`, create new ADR
2. **Failure resolved**: Mark as `[RESOLVED]`, note fix date
3. **Quirk fixed**: Mark as `[FIXED]`, document when/how
4. **Integration changed**: Update version, note breaking changes

### Versioning Pattern

```markdown
# ADR-001: Original Decision

**Status**: [SUPERSEDED by ADR-005]
**Date**: 2025-01-14

[Original content...]

---

## Update Log

- **2025-02-01**: Superseded by ADR-005 due to new requirements
```

## 🎓 Learning from This System

### First Week
- Create 1-2 docs (start small)
- Get comfortable with templates
- Link docs from code comments

### First Month
- Create docs habitually
- Reference docs in code reviews
- See time savings accumulate

### First Year
- Knowledge base grows to 20-30 docs
- Onboarding time cut in half
- Repeated mistakes eliminated

## ✅ Success Criteria

You know it's working when:

1. ✅ New developers onboard faster
2. ✅ Repeated mistakes decrease
3. ✅ Decisions are consistent
4. ✅ Integration is easier
5. ✅ AI agents work more effectively
6. ✅ Knowledge survives turnover

---

**Start today**: Document one thing from your current work. That's all it takes to begin compounding knowledge.

**Last updated**: 2025-01-14
**Maintainer**: Beck Muradov
