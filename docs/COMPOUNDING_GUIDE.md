# Compounding Engineering Guide - BrainDrive Plugin Template

**Version**: 1.0.0
**Date**: 2025-01-14
**Purpose**: Transform development sessions into compound-interest knowledge assets

---

## 🎯 What is Compounding Engineering?

**Compounding Engineering** is a documentation philosophy where every development session leaves behind structured knowledge for future developers and AI agents, multiplying productivity over time.

### Traditional Development
```
Developer 1: Tries fuzzy matching → 6 hours → Discovers it fails
Developer 2: Tries fuzzy matching → 6 hours → Discovers same failure  ❌
Developer 3: Tries fuzzy matching → 6 hours → Discovers same failure  ❌
```

### Compounding Engineering
```
Developer 1: Tries fuzzy matching → 6 hours → Documents Failure-001
Developer 2: Reads Failure-001 → 5 minutes → Uses correct approach  ✅
Developer 3: Reads Failure-001 → 5 minutes → Uses correct approach  ✅

Savings: 11.5 hours after just 2 developers!
```

---

## 📚 The 4 Document Types

### 1. Architecture Decision Records (ADRs)
**Location**: `docs/decisions/`
**Template**: `docs/decisions/000-template.md`

**When to create**:
- ✅ Chose between 2+ implementation approaches
- ✅ Selected a library, framework, or tool
- ✅ Made significant architectural change
- ✅ Established pattern others should follow

**BrainDrive-specific examples**:
- Chose React hooks over class components → ADR-001
- Selected `externals` pattern over Module Federation `shared` → ADR-002
- Decided to use CSS custom properties (no Tailwind) → ADR-003
- Custom hooks pattern for service integration → ADR-004

---

### 2. Failure Logs
**Location**: `docs/failures/`
**Template**: `docs/failures/000-template.md`

**When to create**:
- ✅ Made incorrect assumption (>1 hour wasted)
- ✅ Implemented feature that didn't work (later fixed)
- ✅ Hit unexpected error
- ✅ Used wrong approach (discovered better way)

**BrainDrive-specific examples**:
- "Invalid hook call" error from React duplication → Failure-001
- Memory leak from missing useEffect cleanup → Failure-002
- Settings service not available without lifecycle_manager declaration → Failure-003
- Stale closure in event listener callback → Failure-004

---

### 3. Data Quirks
**Location**: `docs/data-quirks/`
**Template**: `docs/data-quirks/000-template.md`

**When to create**:
- ✅ Non-obvious data behavior discovered
- ✅ Service returns inconsistent formats
- ✅ API has undocumented limitations
- ✅ Schema or data validation surprises

**BrainDrive-specific examples**:
- BrainDrive service bridges may be undefined if not declared → Data-Quirk-001
- CSS custom properties must be used (Tailwind not supported) → Data-Quirk-002
- Theme service requires cleanup of listeners → Data-Quirk-003
- PluginState service auto-loads on configuration if enabled → Data-Quirk-004

---

### 4. Integration Docs
**Location**: `docs/integrations/`
**Template**: `docs/integrations/000-template.md`

**When to create**:
- ✅ Connected to external API/service
- ✅ Integrated BrainDrive service bridge
- ✅ Created service wrapper
- ✅ Set up authentication

**BrainDrive-specific examples**:
- Theme Service integration → `braindrive-theme-service.md`
- API Service integration → `braindrive-api-service.md`
- Settings Service integration → `braindrive-settings-service.md`
- Event Service integration → `braindrive-event-service.md`
- PageContext Service integration → `braindrive-pagecontext-service.md`
- PluginState Service integration → `braindrive-pluginstate-service.md`

---

## 🤖 For AI Agents: Auto-Compounding Behavior

### Core Principle
**You don't just write code - you compound knowledge for future developers/agents.**

### When to Auto-Document

#### Trigger 1: Made Architectural Decision
```
IF (chose between 2+ approaches)
  OR (selected library/framework)
  OR (changed core architecture)
THEN
  → Create ADR in docs/decisions/
  → Use template: docs/decisions/000-template.md
  → Document: Context, Decision, Consequences, Alternatives
```

**Example**:
```bash
# User asks: "Should we use Redux or Context API for state?"
# AI responds with decision AND creates:
cp docs/decisions/000-template.md docs/decisions/001-context-api-for-state.md
# Fill in why Context API was chosen, what Redux trade-offs were
```

---

#### Trigger 2: Discovered Data Quirk
```
IF (data behaves unexpectedly)
  OR (service has undocumented limitation)
  OR (API returns inconsistent format)
THEN
  → Create Data Quirk Doc in docs/data-quirks/
  → Document: Behavior, Impact, Detection, Correct Pattern
```

**Example**:
```bash
# AI discovers theme service requires cleanup
# AI creates:
cp docs/data-quirks/000-template.md docs/data-quirks/001-theme-listener-cleanup.md
# Document the memory leak risk and correct useEffect pattern
```

---

#### Trigger 3: Hit Error or Made Mistake
```
IF (wrong assumption made)
  OR (approach failed, later fixed)
  OR (wasted >1 hour debugging)
THEN
  → Create Failure Log in docs/failures/
  → Document: What happened, Root cause, Resolution, Prevention
```

**Example**:
```bash
# AI tries Module Federation 'shared' config → "Invalid hook call"
# AI debugs, discovers 'externals' pattern works
# AI creates:
cp docs/failures/000-template.md docs/failures/001-invalid-hook-call-react-duplication.md
# Document the mistake, why it happened, how to prevent
```

---

#### Trigger 4: Integrated External System
```
IF (connected to new API/service)
  OR (created service wrapper)
  OR (integrated BrainDrive service bridge)
THEN
  → Create Integration Doc in docs/integrations/
  → Document: Purpose, Auth, Schema, Quirks, Errors
```

**Example**:
```bash
# AI implements usePluginState hook for PluginState service
# AI creates:
cp docs/integrations/000-template.md docs/integrations/braindrive-pluginstate-service.md
# Document API, methods, auth, error handling, examples
```

---

### Before Writing Code Checklist

```bash
# 1. Search existing decisions
grep -r "keyword" docs/decisions/

# 2. Check past failures
grep -r "keyword" docs/failures/

# 3. Review data quirks
grep -r "keyword" docs/data-quirks/

# 4. Check integrations
ls docs/integrations/
```

**Example**:
```
User: "Implement theme switching feature"

AI (before coding):
  1. grep -r "theme" docs/decisions/     → Found ADR-003 about CSS variables
  2. grep -r "theme" docs/failures/      → Found Failure-002 about cleanup
  3. grep -r "theme" docs/integrations/  → Found braindrive-theme-service.md
  4. Now implement using established patterns from docs
```

---

## 🏗️ BrainDrive-Specific Compounding Patterns

### Pattern 1: Service Bridge Integration

**When adding new service bridge:**

1. **Check existing integration docs**:
   ```bash
   ls docs/integrations/braindrive-*
   ```

2. **Follow established pattern**:
   - Create custom hook in `src/hooks/use[ServiceName].ts`
   - Export from `src/hooks/index.ts`
   - Add to `lifecycle_manager.py` required_services
   - Create tab in showcase (if applicable)

3. **Document the integration**:
   ```bash
   cp docs/integrations/000-template.md docs/integrations/braindrive-[service]-service.md
   ```

4. **Update related docs**:
   - Add to `docs/SERVICE_BRIDGES.md`
   - Update `docs/AI_AGENT_INSTRUCTIONS.md`
   - Update README.md with new hook example

---

### Pattern 2: React Hooks Development

**When creating custom hook:**

1. **Check for similar hooks**:
   ```bash
   ls src/hooks/
   grep -r "useEffect.*cleanup" src/hooks/
   ```

2. **Follow cleanup pattern**:
   ```typescript
   useEffect(() => {
     if (!service) return;

     // Subscribe/setup
     const handler = () => { /* ... */ };
     service.addListener(handler);

     // ALWAYS cleanup
     return () => {
       service.removeListener(handler);
     };
   }, [service]);
   ```

3. **Document if mistake found**:
   - If you forget cleanup → Create Failure Log
   - If you hit stale closure → Create Failure Log
   - Pattern becomes searchable for future developers

---

### Pattern 3: Webpack Configuration Changes

**⚠️ CRITICAL: Webpack config is fragile**

1. **Before changing webpack.config.js**:
   ```bash
   grep -r "webpack" docs/decisions/
   grep -r "externals" docs/failures/
   ```

2. **If change is needed**:
   - Create ADR documenting WHY change is needed
   - Test thoroughly (build + integration test)
   - Document any issues encountered

3. **The externals pattern is sacred**:
   ```javascript
   // NEVER CHANGE THIS WITHOUT ADR + EXTENSIVE TESTING
   externals: {
     'react': 'React'  // Uses window.React from BrainDrive host
   }
   ```

---

### Pattern 4: Theme and Styling

**When adding styles:**

1. **Check THEMING.md first**:
   ```bash
   cat docs/THEMING.md
   ```

2. **Use CSS custom properties**:
   ```css
   /* ✅ CORRECT - Compounds with theme system */
   .component {
     background-color: var(--bg-primary);
     color: var(--text-primary);
   }

   /* ❌ WRONG - Hardcoded, breaks theme switching */
   .component {
     background-color: #ffffff;
     color: #000000;
   }
   ```

3. **If you try Tailwind and it fails**:
   - Document in Failure Log why Tailwind doesn't work
   - Link to ADR-003 about CSS custom properties decision

---

## 📊 Compounding Metrics for This Project

### Current State (As of 2025-01-14)

| Document Type | Count | Coverage |
|---------------|-------|----------|
| ADRs | 0 | **Opportunity!** |
| Failure Logs | 0 | **Opportunity!** |
| Data Quirks | 0 | **Opportunity!** |
| Integration Docs | 0 | **Opportunity!** |

### What Should Be Documented (Backlog)

#### High Priority ADRs
1. **ADR-001**: Why React Hooks over Class Components
   - Context: Modernizing BrainDrive plugin template
   - Decision: Functional components + hooks
   - Why: Better DX, easier testing, less boilerplate

2. **ADR-002**: Webpack Externals Pattern
   - Context: "Invalid hook call" errors with Module Federation
   - Decision: Use `externals: { 'react': 'React' }`
   - Why: Prevents React duplication, uses host's React

3. **ADR-003**: CSS Custom Properties (No Tailwind)
   - Context: Styling approach for plugins
   - Decision: CSS variables for theming
   - Why: BrainDrive doesn't bundle Tailwind, variables auto-update with theme

4. **ADR-004**: Custom Hooks for Service Integration
   - Context: How to integrate BrainDrive services
   - Decision: One custom hook per service
   - Why: Encapsulation, cleanup, reusability

#### High Priority Failure Logs
1. **Failure-001**: Invalid Hook Call Error
   - Mistake: Used Module Federation `shared` for React
   - Impact: All hooks broke, 4+ hours debugging
   - Resolution: Switched to `externals` pattern
   - Prevention: Never remove externals from webpack config

2. **Failure-002**: Memory Leak from Missing Cleanup
   - Mistake: Forgot `return () => cleanup()` in useEffect
   - Impact: Theme listeners accumulated on each render
   - Resolution: Added cleanup to all hooks
   - Prevention: Always check cleanup in useEffect

3. **Failure-003**: Service Undefined Error
   - Mistake: Used service without checking availability
   - Impact: Runtime crash when service not declared
   - Resolution: Check `if (!service) return`
   - Prevention: Always check service exists first

#### High Priority Data Quirks
1. **Data-Quirk-001**: Services May Be Undefined
   - Behavior: BrainDrive services undefined if not in lifecycle_manager
   - Impact: Runtime errors if not checked
   - Pattern: Always check `if (!services.api)` before use

2. **Data-Quirk-002**: CSS Variables Update on Theme Change
   - Behavior: CSS custom properties automatically update
   - Impact: Hardcoded colors won't update with theme
   - Pattern: Always use `var(--color-name)`

3. **Data-Quirk-003**: Plugin Props Structure
   - Behavior: Props include services, config, id fields
   - Impact: Must handle missing services gracefully
   - Pattern: Destructure carefully, check availability

#### High Priority Integration Docs
1. `braindrive-theme-service.md` - Theme service integration
2. `braindrive-api-service.md` - API service integration
3. `braindrive-settings-service.md` - Settings service integration
4. `braindrive-event-service.md` - Event service integration
5. `braindrive-pagecontext-service.md` - PageContext service integration
6. `braindrive-pluginstate-service.md` - PluginState service integration

---

## 🚀 Getting Started with Compounding

### Step 1: Document One Thing Today

Pick ONE from the backlog above and document it right now:

```bash
# Example: Document the React hooks decision
cp docs/decisions/000-template.md docs/decisions/001-react-hooks-over-classes.md

# Fill it in:
# - Why did we choose hooks?
# - What are the benefits?
# - What trade-offs exist?
# - What alternatives did we consider?
```

**Time investment**: 10-15 minutes
**ROI**: Saves future developers 2+ hours of research

---

### Step 2: Make It a Habit

**For Human Developers**:
- Before committing: "Did I make a decision worth documenting?"
- After hitting a bug: "Should I document this so others don't hit it?"
- When finishing a feature: "What did I learn that's non-obvious?"

**For AI Agents**:
- After making architectural decision → Auto-create ADR
- After discovering quirk → Auto-create Data Quirk Doc
- After hitting error → Auto-create Failure Log
- After integrating service → Auto-create Integration Doc

---

### Step 3: Reference in Code

Link documentation from code:

```typescript
// src/hooks/useTheme.ts

/**
 * Custom hook for BrainDrive Theme Service integration
 *
 * @see docs/integrations/braindrive-theme-service.md - Full integration guide
 * @see docs/decisions/004-custom-hooks-for-services.md - Why we use hooks
 * @see docs/failures/002-memory-leak-missing-cleanup.md - Why cleanup is critical
 */
export function useTheme(themeService?: ThemeService) {
  // Hook implementation
}
```

---

## 📈 Measuring Compound Value

### Time Saved Calculation

**Without compounding**:
```
Bug 1: Developer A spends 4 hours debugging
Bug 1: Developer B spends 4 hours debugging same issue
Bug 1: Developer C spends 4 hours debugging same issue
Total: 12 hours wasted
```

**With compounding**:
```
Bug 1: Developer A spends 4 hours debugging + 15 min documenting = 4.25 hours
Bug 1: Developer B reads Failure Log (5 min) + fixes correctly = 0.5 hours
Bug 1: Developer C reads Failure Log (5 min) + fixes correctly = 0.5 hours
Total: 5.25 hours
Savings: 6.75 hours (56% reduction)
```

### Knowledge Multiplier

Each documented decision/failure/quirk:
- **First developer**: Learning cost (time to discover/debug)
- **Every future developer**: Near-zero cost (5 min to read doc)
- **Multiplier effect**: More developers = more savings

---

## 🎓 Examples from This Project

### Example 1: Webpack Externals Decision

**Scenario**: Implementing BrainDrive plugin with React hooks

**What happened**:
1. Initial attempt used Module Federation `shared: { react: { singleton: true } }`
2. Got "Invalid hook call" error
3. 4+ hours debugging
4. Discovered BrainDrive exposes `window.React`
5. Switched to `externals: { 'react': 'React' }`
6. Fixed the issue

**Compounding action**:
- **Created**: `docs/decisions/002-webpack-externals-pattern.md`
- **Created**: `docs/failures/001-invalid-hook-call-react-duplication.md`
- **Added comment** in `webpack.config.js` linking to both docs

**Result**:
- Next developer searches "Invalid hook call"
- Finds Failure-001
- Reads ADR-002
- Implements correctly in 5 minutes
- **Saved**: 4 hours

---

### Example 2: Theme Service Cleanup

**Scenario**: Implementing useTheme hook

**What happened**:
1. Created useTheme hook
2. Added theme change listener in useEffect
3. Forgot to remove listener on unmount
4. Memory leak: listeners accumulated
5. React DevTools Profiler showed growth
6. Added cleanup: `return () => service.removeThemeChangeListener(handler)`

**Compounding action**:
- **Created**: `docs/failures/002-memory-leak-missing-cleanup.md`
- **Created**: `docs/data-quirks/003-theme-listener-cleanup.md`
- **Added comment** in all hooks with cleanup pattern

**Result**:
- Next developer creating usePageContext hook
- Searches for similar hook patterns
- Finds useTheme with cleanup comment
- Implements cleanup from the start
- **Saved**: 2 hours debugging memory leak

---

## 🔄 Continuous Improvement

### Update Documentation When

1. **Decision Changes**:
   - Mark old ADR as [SUPERSEDED]
   - Create new ADR explaining why change was needed
   - Link between old and new

2. **Failure Resolved Upstream**:
   - Mark Failure Log as [RESOLVED]
   - Note when/how it was fixed
   - Keep doc for historical context

3. **Data Quirk Fixed**:
   - Mark Data Quirk as [FIXED]
   - Document fix date and version
   - Keep doc to explain past issues

4. **Integration Updated**:
   - Update Integration Doc with new version
   - Note breaking changes
   - Update code examples

---

## 💡 Tips for Success

### Do's ✅
- ✅ Document WHY, not just WHAT
- ✅ Include code examples (before/after)
- ✅ Be honest about mistakes
- ✅ Keep it concise (1-2 pages max)
- ✅ Link related docs together
- ✅ Update when things change

### Don'ts ❌
- ❌ Don't document routine tasks
- ❌ Don't write novels (be concise)
- ❌ Don't hide mistakes
- ❌ Don't skip templates (consistency matters)
- ❌ Don't let docs go stale

---

## 🎯 Success Criteria

You're doing compounding engineering right when:

1. ✅ New developers onboard faster (read docs, not just code)
2. ✅ Repeated mistakes decrease (failures documented)
3. ✅ Architectural decisions are consistent (ADRs provide rationale)
4. ✅ Integration is easier (patterns documented)
5. ✅ AI agents work more effectively (context available)
6. ✅ Knowledge survives turnover (institutional memory preserved)

---

## 📚 Further Reading

- **[AI_AGENT_INSTRUCTIONS.md](AI_AGENT_INSTRUCTIONS.md)** - Complete AI agent guide
- **[SERVICE_BRIDGES.md](SERVICE_BRIDGES.md)** - BrainDrive service integration
- **[THEMING.md](THEMING.md)** - Styling and theme guide
- **[HOOKS_GUIDE.md](HOOKS_GUIDE.md)** - React hooks best practices

---

## 🚀 Next Steps

1. **Document one thing from the backlog** (15 minutes)
2. **Link it from your code** (5 minutes)
3. **Commit with descriptive message** (2 minutes)
4. **Watch productivity compound** (priceless)

**Remember**: The best time to document was yesterday. The second best time is now.

---

**Last updated**: 2025-01-14
**Maintainer**: Beck Muradov
**License**: MIT
