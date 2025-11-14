# For AI Coding Agents - BrainDrive Plugin Template

**Universal AI Agent Guide** | Compatible with: Claude Code, GitHub Copilot, Cursor, Windsurf, and all AI coding assistants

---

## 🎯 Quick Context

You're working on the **BrainDrive Functional Component Plugin Template** - a production-ready React Hooks template for building BrainDrive plugins.

**Key Facts**:
- React 18 + TypeScript 5
- Functional components with hooks (NOT classes)
- 6 custom hooks for BrainDrive service integration
- Webpack Module Federation with critical externals pattern
- CSS custom properties (NO Tailwind)

---

## ⚠️ CRITICAL - Do Not Change

### 1. Webpack Externals Pattern (ABSOLUTELY CRITICAL)

```javascript
// webpack.config.js
externals: {
  'react': 'React'  // Uses window.React from BrainDrive host
}
```

**Why**: BrainDrive exposes `window.React`. Changing this to Module Federation `shared` config causes "Invalid hook call" errors. **This took 4+ hours to debug. Don't repeat this mistake.**

### 2. Name Synchronization

These MUST match:
- `webpack.config.js`: `PLUGIN_MODULE_NAME = "PluginTemplateFunctionalModule"`
- `lifecycle_manager.py`: `module_data[0]["name"] = "PluginTemplateFunctionalModule"`
- `src/index.tsx`: `export default PluginTemplateFunctional`

### 3. ErrorBoundary Must Stay as Class

React Error Boundaries MUST be class components. No hooks equivalent exists.

### 4. No Tailwind CSS

Use CSS custom properties: `var(--bg-primary)`, `var(--text-primary)`, etc.

---

## 📚 Compounding Engineering System

This project uses **Compounding Engineering** - every decision, failure, and quirk is documented for future developers and AI agents.

### Before Writing Code

```bash
# Check existing decisions
grep -r "keyword" docs/decisions/

# Check past failures
grep -r "keyword" docs/failures/

# Check data quirks
grep -r "keyword" docs/data-quirks/

# Check integrations
ls docs/integrations/
```

### Auto-Document When

**Trigger 1: Made architectural decision**
→ Create ADR: `cp docs/decisions/000-template.md docs/decisions/00X-name.md`

**Trigger 2: Discovered data quirk**
→ Create Data Quirk: `cp docs/data-quirks/000-template.md docs/data-quirks/00X-name.md`

**Trigger 3: Hit error or made mistake**
→ Create Failure Log: `cp docs/failures/000-template.md docs/failures/00X-name.md`

**Trigger 4: Integrated external system**
→ Create Integration Doc: `cp docs/integrations/000-template.md docs/integrations/name.md`

---

## 🏗️ Project Structure

```
BrainDrive-PluginTemplate-Functional/
├── src/
│   ├── components/          # React components
│   │   ├── showcase/        # Interactive service demos
│   │   ├── ErrorBoundary.tsx   # Class component (MUST stay class)
│   │   └── ...
│   ├── hooks/               # Custom hooks for services
│   │   ├── useTheme.ts         # Theme service integration
│   │   ├── useAPI.ts           # API service integration
│   │   ├── useSettings.ts      # Settings service integration
│   │   ├── usePageContext.ts   # Page context integration
│   │   ├── usePluginState.ts   # Plugin state integration
│   │   └── useErrorHandler.ts  # Error handling
│   ├── services/            # Business logic
│   ├── utils/               # Utilities
│   └── types.ts             # TypeScript definitions
├── docs/
│   ├── decisions/           # Architecture Decision Records
│   ├── failures/            # Lessons from mistakes
│   ├── data-quirks/         # Non-obvious data behavior
│   ├── integrations/        # External API/service docs
│   ├── COMPOUNDING_GUIDE.md # Complete compounding guide
│   ├── AI_AGENT_INSTRUCTIONS.md  # Detailed AI guide
│   ├── SERVICE_BRIDGES.md   # BrainDrive services guide
│   ├── THEMING.md          # Styling guide
│   └── HOOKS_GUIDE.md      # React hooks best practices
├── webpack.config.js        # ⚠️ CRITICAL: Externals pattern
├── lifecycle_manager.py     # Plugin metadata & lifecycle
└── package.json
```

---

## 🌉 BrainDrive Service Bridges

### Available Services

```typescript
interface PluginProps {
  services: {
    api?: ApiService;           // HTTP requests
    theme?: ThemeService;       // Dark/light mode
    settings?: SettingsService; // User preferences
    event?: EventService;       // Inter-plugin messaging
    pageContext?: PageContextService; // Page awareness
    pluginState?: PluginStateService; // State persistence
  }
}
```

### Integration Pattern

**Always check availability**:
```typescript
if (!services.theme) {
  console.warn('Theme service not available');
  return;
}
```

**Use custom hooks** (handles availability, cleanup automatically):
```typescript
const { currentTheme, toggleTheme } = useTheme(services.theme);
const { get, post } = useAPI(services.api);
const { value, setValue } = useSettings(services.settings, 'key', default);
```

**Always cleanup subscriptions**:
```typescript
useEffect(() => {
  if (!service) return;

  const handler = () => { /* ... */ };
  service.addListener(handler);

  return () => {
    service.removeListener(handler); // CRITICAL: Prevents memory leaks
  };
}, [service]);
```

---

## 🎓 Common Patterns

### Pattern 1: Service Availability Check
```typescript
// ❌ WRONG - Will crash if service undefined
const theme = services.theme.getCurrentTheme();

// ✅ CORRECT - Check first or use custom hook
const { currentTheme, isAvailable } = useTheme(services.theme);
if (!isAvailable) return <div>Service unavailable</div>;
```

### Pattern 2: useEffect Cleanup
```typescript
// ❌ WRONG - Memory leak!
useEffect(() => {
  services.theme.addThemeChangeListener(handleThemeChange);
}, []);

// ✅ CORRECT - Always cleanup
useEffect(() => {
  if (!services.theme) return;

  services.theme.addThemeChangeListener(handleThemeChange);

  return () => {
    services.theme.removeThemeChangeListener(handleThemeChange);
  };
}, [services.theme]);
```

### Pattern 3: CSS Custom Properties
```css
/* ❌ WRONG - Hardcoded colors */
.component {
  background-color: #ffffff;
  color: #000000;
}

/* ✅ CORRECT - Variables auto-update with theme */
.component {
  background-color: var(--bg-primary);
  color: var(--text-primary);
}
```

### Pattern 4: Functional State Updates
```typescript
// ❌ WRONG - Can lose updates
setCount(count + 1);

// ✅ CORRECT - Always gets latest value
setCount(prev => prev + 1);
```

---

## 🚫 Common Mistakes (Documented Failures)

### Mistake 1: Invalid Hook Call Error
**Cause**: Using Module Federation `shared` config instead of `externals`
**Solution**: Use `externals: { 'react': 'React' }` in webpack.config.js
**Time Wasted**: 4+ hours
**Documented**: Should be in `docs/failures/001-invalid-hook-call.md` (create if needed)

### Mistake 2: Memory Leak from Missing Cleanup
**Cause**: Forgot `return () => cleanup()` in useEffect
**Solution**: Always return cleanup function
**Time Wasted**: 2+ hours debugging
**Documented**: Should be in `docs/failures/002-memory-leak-cleanup.md` (create if needed)

### Mistake 3: Service Undefined Error
**Cause**: Service not declared in lifecycle_manager.py
**Solution**: Add service to `required_services` in module_data
**Time Wasted**: 1+ hour
**Documented**: Should be in `docs/failures/003-service-undefined.md` (create if needed)

---

## 📖 Documentation Guide

### Essential Reading (Priority Order)

1. **[FOR-AI-CODING-AGENTS.md](FOR-AI-CODING-AGENTS.md)** (this file) - Start here
2. **[docs/COMPOUNDING_GUIDE.md](docs/COMPOUNDING_GUIDE.md)** - Compounding system guide
3. **[docs/AI_AGENT_INSTRUCTIONS.md](docs/AI_AGENT_INSTRUCTIONS.md)** - Detailed AI guide
4. **[docs/SERVICE_BRIDGES.md](docs/SERVICE_BRIDGES.md)** - Service integration
5. **[docs/HOOKS_GUIDE.md](docs/HOOKS_GUIDE.md)** - React hooks patterns
6. **[docs/THEMING.md](docs/THEMING.md)** - Styling guide
7. **[README.md](README.md)** - User documentation

### When to Read What

**Starting new feature**: Check decisions/, failures/, data-quirks/
**Integrating service**: Read SERVICE_BRIDGES.md + docs/integrations/
**Styling components**: Read THEMING.md
**Creating custom hook**: Read HOOKS_GUIDE.md
**Hit an error**: Search failures/ for similar issues

---

## 🔧 Common Commands

```bash
# Development
npm install              # Install dependencies
npm run dev             # Watch mode
npm start               # Dev server (http://localhost:3004)

# Building
npm run build           # Production build
npm run build:dev       # Dev build with source maps

# Verification
npm run type-check      # TypeScript validation

# Project structure
ls src/hooks/           # View custom hooks
ls docs/decisions/      # View ADRs
ls docs/failures/       # View failure logs
```

---

## 🎯 Your Mission as AI Agent

### Do's ✅
- ✅ Search existing docs before implementing
- ✅ Use custom hooks for service integration
- ✅ Always check service availability
- ✅ Always cleanup subscriptions
- ✅ Use CSS custom properties
- ✅ Document decisions, failures, and quirks
- ✅ Follow established patterns

### Don'ts ❌
- ❌ Change webpack externals pattern
- ❌ Convert ErrorBoundary to functional
- ❌ Add Tailwind CSS
- ❌ Skip useEffect cleanup
- ❌ Assume services are available
- ❌ Forget to document learnings

---

## 🚀 Quick Start Workflow

### For New Feature Implementation

1. **Search existing knowledge**:
   ```bash
   grep -r "feature-keyword" docs/
   ```

2. **Read related documentation**:
   - Check ADRs for architectural decisions
   - Check failures for common mistakes
   - Check integrations if using services

3. **Implement using patterns**:
   - Use custom hooks from `src/hooks/`
   - Follow patterns in `docs/HOOKS_GUIDE.md`
   - Style with CSS variables from `docs/THEMING.md`

4. **Document if applicable**:
   - Made decision? → Create ADR
   - Hit error? → Create Failure Log
   - Found quirk? → Create Data Quirk Doc

5. **Test thoroughly**:
   - Build: `npm run build`
   - TypeScript: `npm run type-check`
   - Integration: Test in BrainDrive

---

## 💡 Pro Tips

1. **Use existing hooks**: Check `src/hooks/` before creating new ones
2. **Copy-paste patterns**: Showcase tabs have working examples
3. **Link docs in code**: Reference ADRs/failures in comments
4. **Update when wrong**: Mark deprecated docs, create replacements
5. **Think compound**: Will this doc save future dev time?

---

## 🆘 Troubleshooting

### Build fails with "Invalid hook call"
→ Check webpack.config.js has `externals: { 'react': 'React' }`

### Service is undefined
→ Check lifecycle_manager.py has service in `required_services`

### Memory leak / listeners accumulate
→ Check useEffect has `return () => cleanup()`

### Theme not updating
→ Check using `var(--color-name)` not hardcoded colors

### TypeScript errors
→ Run `npm run type-check` for details

---

## 📊 Project Stats

- **Files**: 50+ TypeScript/React files
- **Custom Hooks**: 6 production-ready hooks
- **Service Coverage**: 6/6 BrainDrive services (100%)
- **Documentation**: 25,000+ words
- **Interactive Examples**: 30+ working demos
- **Build Size**: ~337 KB optimized

---

## 🔗 Quick Links

- **GitHub**: https://github.com/bekmuradov/BrainDrive-PluginTemplate-Functional
- **BrainDrive Core**: https://github.com/BrainDriveAI/BrainDrive-Core
- **Issue Context**: https://github.com/BrainDriveAI/BrainDrive-Core/issues/195

---

## ✅ Success Criteria

You're doing it right when:

1. ✅ Build succeeds without warnings
2. ✅ All tests pass (when implemented)
3. ✅ No "Invalid hook call" errors
4. ✅ No memory leaks (subscriptions cleaned)
5. ✅ Theme switching works
6. ✅ Services integrate correctly
7. ✅ Code follows established patterns
8. ✅ New patterns are documented

---

**Remember**: This is a compounding project. Every decision, failure, and quirk you document multiplies productivity for future developers and AI agents.

**Start small**: Document one thing today. Watch knowledge compound over time.

---

**Last updated**: 2025-01-14
**Maintainer**: Beck Muradov
**License**: MIT
