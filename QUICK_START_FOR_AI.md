# Quick Start for AI Coding Agent

## TL;DR - Critical Facts

1. **Location**: `backend/plugins/shared/BrainDrive-PluginTemplate-Functional/`

2. **DON'T TOUCH**: `webpack.config.js` externals pattern (prevents React duplication)

3. **NO TAILWIND**: Use CSS custom properties like `var(--bg-primary)`

4. **Names Must Match**:
   - `webpack.config.js`: `PLUGIN_NAME = "PluginTemplateFunctional"`
   - `lifecycle_manager.py`: `"name": "PluginTemplateFunctional"`
   - These MUST be synchronized

5. **ErrorBoundary.tsx**: MUST stay as class component (React requirement)

## What to Do Next

### Immediate: Test the Build

```bash
cd backend/plugins/shared/BrainDrive-PluginTemplate-Functional
npm install
npm run build
```

**Expected**: Build succeeds, creates `dist/remoteEntry.js`

### Phase 1: Testing & Validation (PRIORITY)

1. Build test (above)
2. Install in BrainDrive and verify no "Invalid hook call" errors
3. Test theme switching
4. Test all 5 custom hooks work
5. Check for memory leaks

### Phase 2: Add Examples

Create `src/examples/` with:
- DataFetchingExample.tsx (useAPI)
- FormWithSettingsExample.tsx (useSettings)
- ThemeSwitcherExample.tsx (useTheme)
- PageContextExample.tsx (usePageContext)
- ComplexStateExample.tsx (multiple hooks)

### Phase 3: Testing Infrastructure

- Add Jest config
- Add hook tests
- Add component tests
- Mock services for testing

### Phase 4: More Documentation

- MIGRATION_FROM_CLASS.md
- TROUBLESHOOTING.md
- API_REFERENCE.md

### Phase 5: Advanced Features

- More custom hooks (useDebounce, useLocalStorage, etc.)
- Performance optimization
- Accessibility features
- CI/CD setup

## Key Files to Read First

1. `README.md` - Overview and quick start
2. `AI_AGENT_INSTRUCTIONS.md` - Complete instructions (YOU ARE HERE)
3. `docs/SERVICE_BRIDGES.md` - Service integration patterns
4. `docs/HOOKS_GUIDE.md` - React hooks patterns
5. `src/PluginTemplateFunctional.tsx` - Main component example

## The Webpack Pattern (CRITICAL!)

```javascript
// webpack.config.js

// ✅ THIS IS CORRECT - DO NOT CHANGE
externals: {
  'react': 'React'  // Uses window.React from BrainDrive host
}

// In ModuleFederationPlugin:
plugins: [
  new ModuleFederationPlugin({
    name: PLUGIN_NAME,
    library: { type: "var", name: PLUGIN_NAME },
    filename: "remoteEntry.js",
    exposes: {
      [`./` + PLUGIN_MODULE_NAME]: "./src/index",
    },
    // NO 'shared' config! Using externals instead!
  })
]
```

**Why?** BrainDrive host exposes `window.React`. Using `externals` tells webpack to use that instead of bundling React. Module Federation's `shared` config causes duplicate React = broken hooks.

## Custom Hooks Available

```typescript
// Already implemented and ready to use:
import {
  useTheme,          // Theme service integration
  usePageContext,    // Page context service
  useSettings,       // Settings persistence
  useAPI,            // HTTP requests
  useErrorHandler    // Error management
} from './hooks';
```

## Example Usage Pattern

```tsx
import React, { useEffect } from 'react';
import { useTheme, useAPI } from './hooks';

const MyComponent: React.FC<PluginProps> = ({ services }) => {
  // Use custom hooks
  const { currentTheme } = useTheme(services.theme);
  const { get, data, loading, error } = useAPI(services.api);

  // Fetch data on mount
  useEffect(() => {
    get('/api/my-data');
  }, []);

  // Render
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={`my-component ${currentTheme === 'dark' ? 'dark-theme' : ''}`}>
      {JSON.stringify(data)}
    </div>
  );
};
```

## CSS Pattern (NO TAILWIND!)

```css
/* MyComponent.css */
.my-component {
  background-color: var(--bg-primary);    /* ✅ Use CSS variables */
  color: var(--text-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);

  /* ❌ Don't hardcode colors */
  /* background-color: #ffffff; */
}

.my-component.dark-theme {
  /* Usually not needed - CSS variables handle it automatically */
}
```

## What's Complete

- ✅ Project structure
- ✅ Webpack config with externals
- ✅ Main component converted to functional
- ✅ 5 custom hooks (useTheme, usePageContext, useSettings, useAPI, useErrorHandler)
- ✅ Error handling
- ✅ Component library
- ✅ Documentation (SERVICE_BRIDGES.md, THEMING.md, HOOKS_GUIDE.md)
- ✅ README.md

## What's Needed

- ⏳ Build testing
- ⏳ Integration testing with BrainDrive
- ⏳ Example components
- ⏳ Unit tests for hooks
- ⏳ More documentation
- ⏳ Advanced features

## Common Commands

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Development mode (watch)
npm run dev

# Start dev server
npm start

# Clean build
npm run clean
```

## Testing Checklist

Before marking complete:
- [ ] Build succeeds
- [ ] No TypeScript errors
- [ ] Plugin loads in BrainDrive
- [ ] Theme switching works
- [ ] No "Invalid hook call" errors
- [ ] All hooks work correctly
- [ ] No memory leaks
- [ ] Documentation is accurate

## Get Help

Read these files in order:
1. This file (QUICK_START_FOR_AI.md)
2. AI_AGENT_INSTRUCTIONS.md (detailed instructions)
3. README.md (user-facing docs)
4. docs/SERVICE_BRIDGES.md (service patterns)
5. docs/HOOKS_GUIDE.md (React hooks guide)

## Questions?

If stuck:
1. Check AI_AGENT_INSTRUCTIONS.md for detailed context
2. Review existing code in src/ for patterns
3. Read docs/ for usage examples
4. Check BrainDrive host code (frontend/src/) for integration details
5. Ask the user for clarification

**Start with Phase 1: Testing & Validation** to ensure the foundation is solid!
