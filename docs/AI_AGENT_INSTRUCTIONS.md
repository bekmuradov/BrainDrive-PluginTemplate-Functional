# AI Coding Agent Instructions - BrainDrive Functional Plugin Template

## Project Overview

You are working on the **BrainDrive Functional Component Plugin Template** - a modern React Hooks-based template for developing BrainDrive plugins. This template was converted from a class-based architecture to functional components with hooks.

**Location**: `C:\Users\beck\Documents\GitHub\brain_drive\BrainDrive\backend\plugins\shared\BrainDrive-PluginTemplate-Functional`

## Critical Context You MUST Understand

### 1. The Webpack Configuration is CRITICAL

**DO NOT change this pattern:**

```javascript
// webpack.config.js
externals: {
  'react': 'React',  // Uses window.React from host
}

// In ModuleFederationPlugin:
// NO 'shared' configuration!
// This is INTENTIONAL to prevent React duplication
```

**Why?**
- BrainDrive host exposes `window.React` globally
- Using `externals` tells webpack to use that instead of bundling React
- Module Federation's `shared: { react: { singleton: true } }` causes duplicate React instances
- Duplicate React = "Invalid hook call" errors
- This is documented in recent git commits: "Add workaround for functional component hook errors"

### 2. Name Synchronization is CRITICAL

These names MUST match across files:

**webpack.config.js:**
```javascript
const PLUGIN_NAME = "PluginTemplateFunctional";
const PLUGIN_MODULE_NAME = "PluginTemplateFunctionalModule";
```

**lifecycle_manager.py:**
```python
class PluginTemplateFunctionalLifecycleManager(BaseLifecycleManager):
    self.plugin_data = {
        "name": "PluginTemplateFunctional",
        "scope": "PluginTemplateFunctional",
        "plugin_slug": "PluginTemplateFunctional",
    }

    self.module_data = [{
        "name": "PluginTemplateFunctionalModule",  # Must match webpack exposes
    }]
```

**src/index.tsx:**
```typescript
export default PluginTemplateFunctional;  // Must match module name
```

### 3. BrainDrive Plugin Architecture

**Host System** (frontend):
- Location: `frontend/src/main.tsx` - exposes `window.React = React`
- Plugin loader: `frontend/src/services/remotePluginService.ts`
- Plugin renderer: `frontend/src/features/plugin-studio/components/canvas/PluginModuleRenderer.tsx`

**Plugin receives these props:**
```typescript
interface PluginProps {
  id?: string;
  pluginId?: string;
  moduleId?: string;
  instanceId?: string;
  services: Services;
  // Plus any config fields defined in lifecycle_manager.py
}
```

**Services available:**
- `services.api` - HTTP requests to backend
- `services.theme` - Dark/light mode
- `services.settings` - Persistent user preferences
- `services.pageContext` - Current page information
- `services.event` - Inter-plugin messaging

### 4. Service Bridges Pattern

Services are injected by the host. Plugins must:
1. Check service availability (`if (!services.theme) return;`)
2. Subscribe to service updates in useEffect
3. Clean up subscriptions in useEffect return function
4. Use custom hooks (already created) for easier integration

### 5. No Tailwind CSS

**CRITICAL**: BrainDrive plugins do NOT use Tailwind CSS.

**Instead, use CSS custom properties:**
```css
.my-component {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
}
```

These variables automatically update when theme changes.

## Project Structure

```
BrainDrive-PluginTemplate-Functional/
├── src/
│   ├── components/              # React components
│   │   ├── ErrorBoundary.tsx    # Class component (MUST stay class)
│   │   ├── ErrorDisplay.tsx     # Functional
│   │   ├── LoadingSpinner.tsx   # Functional
│   │   ├── SettingsExample.tsx  # Functional with hooks
│   │   └── index.ts
│   ├── hooks/                   # Custom React hooks
│   │   ├── useTheme.ts          # Theme service integration
│   │   ├── usePageContext.ts    # Page context service
│   │   ├── useSettings.ts       # Settings service
│   │   ├── useAPI.ts            # API service
│   │   ├── useErrorHandler.ts   # Error handling
│   │   └── index.ts
│   ├── services/                # Business logic
│   │   ├── PluginService.ts     # Example service
│   │   └── index.ts
│   ├── utils/                   # Utilities
│   │   ├── errorHandling.ts     # Error classes and handlers
│   │   └── utils.ts
│   ├── types.ts                 # TypeScript interfaces
│   ├── PluginTemplateFunctional.tsx  # Main component
│   ├── PluginTemplateFunctional.css  # Styles (uses CSS variables)
│   └── index.tsx                # Entry point
├── docs/                        # Documentation
│   ├── SERVICE_BRIDGES.md       # Service integration guide
│   ├── THEMING.md               # Styling guide (NO Tailwind!)
│   └── HOOKS_GUIDE.md           # React hooks best practices
├── public/
│   └── index.html               # Dev server HTML
├── references/                  # Reference docs
│   ├── LIFECYCLE_MANAGER_CUSTOMIZATION_GUIDE.md
│   ├── Lifecycle-Manager-Reference.md
│   ├── Module-Data-Field-Reference.md
│   └── Plugin-Data-Field-Reference.md
├── webpack.config.js            # CRITICAL: Uses externals pattern
├── tsconfig.json
├── lifecycle_manager.py         # Plugin metadata and lifecycle
├── package.json
├── README.md                    # Main documentation
└── CONVERSION_PLAN.md           # Implementation checklist
```

## What's Already Complete

### ✅ Phase 1-10 (All Done)
- Project structure created
- Webpack config with externals pattern
- Main component converted to functional with hooks
- 5 custom hooks created (useTheme, usePageContext, useSettings, useAPI, useErrorHandler)
- Error handling with hooks
- Component library converted
- Comprehensive documentation (SERVICE_BRIDGES.md, THEMING.md, HOOKS_GUIDE.md)
- README.md with examples
- All files in place and working

## What Still Needs Work

### Priority 1: Testing & Validation

1. **Build Test**
   ```bash
   cd backend/plugins/shared/BrainDrive-PluginTemplate-Functional
   npm install
   npm run build
   ```
   - Verify build succeeds
   - Check dist/remoteEntry.js is created
   - Verify no webpack errors
   - Ensure no React bundled (should use external)

2. **Integration Test with BrainDrive**
   - Install plugin in BrainDrive
   - Verify plugin loads without "Invalid hook call" error
   - Test theme switching works
   - Test all custom hooks work correctly
   - Verify no memory leaks (subscriptions cleanup)

3. **Hook Testing**
   - Add unit tests for custom hooks using `@testing-library/react-hooks`
   - Test useTheme cleanup
   - Test useSettings async operations
   - Test useAPI error handling
   - Test useErrorHandler retry logic

### Priority 2: Additional Examples

Create example components in `src/examples/` directory:

1. **DataFetchingExample.tsx**
   ```tsx
   // Demonstrates:
   // - useAPI hook
   // - Loading states
   // - Error handling
   // - Data display
   ```

2. **FormWithSettingsExample.tsx**
   ```tsx
   // Demonstrates:
   // - useSettings hook
   // - Form state management
   // - Validation
   // - Persistence
   ```

3. **ThemeSwitcherExample.tsx**
   ```tsx
   // Demonstrates:
   // - useTheme hook
   // - CSS custom properties
   // - Theme-aware styling
   ```

4. **PageContextExample.tsx**
   ```tsx
   // Demonstrates:
   // - usePageContext hook
   // - Conditional rendering based on page
   // - Studio vs normal page behavior
   ```

5. **ComplexStateExample.tsx**
   ```tsx
   // Demonstrates:
   // - Multiple hooks composition
   // - useReducer for complex state
   // - useMemo for performance
   // - useCallback for event handlers
   ```

### Priority 3: Development Tools

1. **Dev Mode Enhancement**
   - Create `src/DevStandalone.tsx` for standalone development
   - Mock services for development without BrainDrive host
   - Hot reload support
   - Better error messages in dev mode

2. **TypeScript Improvements**
   - Add stricter type checking
   - Create utility types for common patterns
   - Add JSDoc comments to all hooks
   - Export all types from index files

3. **Testing Infrastructure**
   - Set up Jest configuration
   - Add testing utilities for hooks
   - Create mock services for testing
   - Add example test files

### Priority 4: Documentation Enhancements

1. **MIGRATION_FROM_CLASS.md**
   - Side-by-side comparison of class vs functional patterns
   - Step-by-step migration guide
   - Common gotchas during migration
   - Before/after code examples

2. **TROUBLESHOOTING.md**
   - Common errors and solutions
   - Debugging techniques
   - Performance issues
   - Build problems

3. **API_REFERENCE.md**
   - Complete API reference for all custom hooks
   - All hook options and return values
   - TypeScript interfaces
   - Usage examples for each

4. **Update README.md**
   - Add "Quick Examples" section with copy-paste code
   - Add screenshots or GIFs if possible
   - Add "Common Recipes" section
   - Add performance tips

### Priority 5: Advanced Features

1. **Additional Custom Hooks**
   - `useEventService` - Event service integration
   - `useDebounce` - Debounced values
   - `useLocalStorage` - Browser storage
   - `usePrevious` - Track previous values
   - `useWindowSize` - Responsive behavior
   - `useInterval` - Interval management with cleanup

2. **Performance Optimization**
   - Add React.memo to appropriate components
   - Optimize re-render patterns
   - Add performance monitoring
   - Document performance best practices

3. **Accessibility**
   - Add ARIA attributes examples
   - Keyboard navigation support
   - Focus management
   - Screen reader support

### Priority 6: CI/CD & Tooling

1. **Package Scripts**
   ```json
   {
     "scripts": {
       "build": "webpack --mode production",
       "build:dev": "webpack --mode development",
       "dev": "webpack --mode development --watch",
       "start": "webpack serve --mode development",
       "test": "jest",
       "test:watch": "jest --watch",
       "test:coverage": "jest --coverage",
       "lint": "eslint src --ext .ts,.tsx",
       "lint:fix": "eslint src --ext .ts,.tsx --fix",
       "type-check": "tsc --noEmit",
       "clean": "rm -rf dist"
     }
   }
   ```

2. **Linting & Formatting**
   - Add ESLint configuration
   - Add Prettier configuration
   - Add pre-commit hooks (husky)
   - Add lint-staged

3. **GitHub Actions**
   - Build validation
   - Type checking
   - Linting
   - Test running
   - Auto-deploy to releases

## Implementation Guidelines

### When Adding New Features

1. **Always use functional components with hooks**
   ```tsx
   // ✅ DO THIS
   const MyComponent: React.FC<Props> = (props) => {
     const [state, setState] = useState(initialValue);
     return <div>...</div>;
   };

   // ❌ DON'T DO THIS
   class MyComponent extends React.Component {
     // No class components (except ErrorBoundary)
   }
   ```

2. **Always check service availability**
   ```tsx
   useEffect(() => {
     if (!services.theme) {
       console.warn('Theme service not available');
       return;
     }
     // Use service
   }, [services.theme]);
   ```

3. **Always cleanup in useEffect**
   ```tsx
   useEffect(() => {
     // Setup
     const listener = () => { /* ... */ };
     service.addEventListener(listener);

     // Cleanup
     return () => {
       service.removeEventListener(listener);
     };
   }, [service]);
   ```

4. **Use custom hooks for service integration**
   ```tsx
   // ✅ DO THIS
   const { currentTheme } = useTheme(services.theme);

   // ❌ DON'T DO THIS
   const [theme, setTheme] = useState('light');
   useEffect(() => { /* manual theme setup */ }, []);
   ```

5. **Use CSS custom properties for styling**
   ```css
   /* ✅ DO THIS */
   .component {
     background-color: var(--bg-primary);
     color: var(--text-primary);
   }

   /* ❌ DON'T DO THIS */
   .component {
     background-color: #ffffff;
     color: #000000;
   }
   ```

### When Adding Documentation

1. **Include working code examples**
2. **Show both correct (✅) and incorrect (❌) patterns**
3. **Explain the "why" not just the "what"**
4. **Add troubleshooting sections**
5. **Keep it practical and focused**

### When Testing

1. **Test in both dark and light themes**
2. **Test service availability edge cases**
3. **Test cleanup functions are called**
4. **Test for memory leaks**
5. **Test TypeScript types are correct**

## Common Gotchas to Avoid

### 1. Don't Break the Webpack Config

```javascript
// ❌ NEVER DO THIS
shared: {
  react: { singleton: true }
}

// ✅ KEEP THIS
externals: {
  'react': 'React'
}
```

### 2. Don't Forget Cleanup

```tsx
// ❌ Memory leak
useEffect(() => {
  services.theme.addThemeChangeListener(listener);
  // Missing cleanup!
}, []);

// ✅ Proper cleanup
useEffect(() => {
  services.theme.addThemeChangeListener(listener);
  return () => {
    services.theme.removeThemeChangeListener(listener);
  };
}, []);
```

### 3. Don't Use Tailwind

```tsx
// ❌ Don't do this
<div className="bg-white text-black p-4 rounded-md">

// ✅ Do this
<div className="my-component">
/* CSS file: */
.my-component {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
}
```

### 4. Don't Forget Dependencies

```tsx
// ❌ Missing dependencies
useEffect(() => {
  console.log(count, name);
}, []); // Should include [count, name]

// ✅ All dependencies
useEffect(() => {
  console.log(count, name);
}, [count, name]);
```

### 5. Don't Change ErrorBoundary to Functional

```tsx
// ❌ Don't do this
const ErrorBoundary: React.FC = () => { /* ... */ };

// ✅ Keep it as class component
class ErrorBoundary extends React.Component { /* ... */ }
```

React Error Boundaries MUST be class components - there's no hooks equivalent.

## Testing Checklist

Before considering work complete:

- [ ] `npm install` succeeds
- [ ] `npm run build` succeeds
- [ ] No TypeScript errors
- [ ] No webpack warnings about React
- [ ] dist/remoteEntry.js is created
- [ ] Plugin loads in BrainDrive without errors
- [ ] Theme switching works
- [ ] All custom hooks work correctly
- [ ] No console errors about invalid hooks
- [ ] No memory leaks (check React DevTools Profiler)
- [ ] All documentation is accurate
- [ ] Examples work as documented

## Resources

### Inside This Project
- `docs/SERVICE_BRIDGES.md` - Complete service integration guide
- `docs/THEMING.md` - Styling guide (NO Tailwind!)
- `docs/HOOKS_GUIDE.md` - React hooks best practices
- `README.md` - Main documentation
- `CONVERSION_PLAN.md` - Implementation checklist
- `references/` - Lifecycle manager documentation

### BrainDrive Codebase
- `frontend/src/main.tsx` - Where React is exposed
- `frontend/src/services/remotePluginService.ts` - Plugin loader
- `frontend/src/features/plugin-studio/components/canvas/PluginModuleRenderer.tsx` - Plugin renderer
- `frontend/src/features/unified-dynamic-page-renderer/services/ServiceBridgeV2.ts` - Service bridges

### External Resources
- [React Hooks Documentation](https://react.dev/reference/react/hooks)
- [Module Federation](https://webpack.js.org/concepts/module-federation/)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

## Git Commit Context

Recent relevant commits:
- "fix: Add workaround for functional component hook errors in plugin test loading"
- "fix: Resolve React key prop warning in UnifiedPageRenderer"

These indicate the host system had issues with hooks before the externals fix.

## Questions to Ask User

If you're unsure about something:

1. **Architecture questions**: "Should this be a custom hook or a component?"
2. **Feature priority**: "Which example should I implement first?"
3. **Testing approach**: "Do you want unit tests or integration tests first?"
4. **Documentation style**: "Should I add more code examples or more explanations?"
5. **Performance concerns**: "Should I optimize this or keep it simple?"

## Your Mission

Your primary goal is to make this template:
1. **Production-ready** - Thoroughly tested and documented
2. **Developer-friendly** - Easy to understand and extend
3. **Well-documented** - Clear examples and guides
4. **Best-practice** - Following modern React patterns
5. **BrainDrive-compatible** - Works perfectly with the host system

Start with **Priority 1** (Testing & Validation) to ensure the foundation is solid, then move to examples and enhancements.

Good luck! 🚀
