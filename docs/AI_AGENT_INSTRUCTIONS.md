# AI Coding Agent Instructions - BrainDrive Functional Plugin Template

**Version**: 2.1.0
**Last Updated**: 2025-01-13
**GitHub**: https://github.com/bekmuradov/BrainDrive-PluginTemplate-Functional

## 🎯 What This Template Is

The **BrainDrive Functional Component Plugin Template** is a production-ready, fully-featured React Hooks template for building BrainDrive plugins. It serves as both:

1. **A Working Example** - Interactive showcase demonstrating all 6 BrainDrive service bridges
2. **A Starting Point** - Copy and customize for your own plugin
3. **A Learning Resource** - 25,000+ words of documentation capturing every lesson learned

This template embodies **compounding engineering** - where each feature makes the next feature easier to build, rather than harder.

## 🚀 Current State: PRODUCTION READY

### ✅ What's Complete

- **All 6 Service Bridges**: Theme, API, Settings, Events, PageContext, PluginState
- **Interactive Showcase**: 7 tabs with working examples developers can click and test
- **6 Custom Hooks**: Reusable hooks for every service bridge
- **Full TypeScript**: Complete type safety across all components
- **Comprehensive Error Handling**: ErrorBoundary + custom error management
- **Proper Webpack Config**: Uses externals pattern (no React duplication)
- **Theme Support**: Dark/light mode with CSS custom properties
- **Real API Examples**: Demonstrates actual BrainDrive backend endpoints
- **Complete Documentation**: SERVICE_BRIDGES.md, THEMING.md, HOOKS_GUIDE.md
- **Git Repository**: Public on GitHub with releases

### 📊 Statistics

- **Total Files**: 50+ TypeScript/React files
- **Custom Hooks**: 6 production-ready hooks
- **Interactive Examples**: 30+ working code examples across 7 tabs
- **Documentation**: 25,000+ words
- **Build Size**: 337 KB optimized
- **Service Bridges**: 6/6 (100% coverage of official BrainDrive services)

## 🧠 Compounding Engineering Paradigm

This template demonstrates **compounding engineering** - where each lesson learned makes future development easier:

### Traditional Engineering
```
Feature 1 → Complexity++
Feature 2 → Complexity+++
Feature 3 → Complexity++++ (each feature makes next harder)
```

### Compounding Engineering
```
Feature 1 → Codified Learnings
Feature 2 → Builds on Feature 1 patterns (easier)
Feature 3 → Reuses patterns from 1 & 2 (even easier)
```

### How This Template Achieves It

1. **Codified Learnings**
   - All conversion patterns from class to functional documented
   - Common pitfalls (stale closures, dependency arrays) explained with solutions
   - Webpack configuration issues captured in comments and docs
   - Every challenge encountered became a code comment or doc section

2. **AI Agent Context**
   - This file captures the complete context of WHY decisions were made
   - Documents what worked, what didn't, and what to avoid
   - Enables AI coding assistants to continue work without repeating mistakes
   - Testing checklist, troubleshooting guide, and common patterns included

3. **Making Future Features Easier**
   - Custom hooks abstract service complexity - just import and use
   - Error handling patterns established - copy-paste for consistency
   - Component library provides reusable building blocks
   - TypeScript types ensure correctness automatically
   - Interactive showcase examples serve as templates

4. **Captured in the Process**
   - Planning phase documented expectations vs reality
   - Testing phase revealed issues that became documented patterns
   - Each git commit message explains the "why" behind changes
   - Reference to BrainDrive-Core issue #195 for context

### Compounding Documentation System

This project now includes a **structured compounding documentation system** with 4 document types:

1. **Architecture Decision Records (ADRs)** - `docs/decisions/`
   - Documents WHY architectural choices were made
   - Template: `docs/decisions/000-template.md`

2. **Failure Logs** - `docs/failures/`
   - Documents mistakes, wrong assumptions, wasted time
   - Template: `docs/failures/000-template.md`

3. **Data Quirks** - `docs/data-quirks/`
   - Documents non-obvious data behavior
   - Template: `docs/data-quirks/000-template.md`

4. **Integration Docs** - `docs/integrations/`
   - Documents external API/service integration details
   - Template: `docs/integrations/000-template.md`

**📖 See [COMPOUNDING_GUIDE.md](COMPOUNDING_GUIDE.md) for complete guide on using this system.**

## 🏗️ Project Architecture

### Directory Structure

```
BrainDrive-PluginTemplate-Functional/
├── src/
│   ├── components/
│   │   ├── showcase/                    # 🆕 Interactive service bridge showcase
│   │   │   ├── tabs/                    # Individual service demonstration tabs
│   │   │   │   ├── OverviewTab.tsx      # Introduction to service bridges
│   │   │   │   ├── ThemeServiceTab.tsx  # Theme service examples
│   │   │   │   ├── APIServiceTab.tsx    # Real BrainDrive API examples
│   │   │   │   ├── SettingsServiceTab.tsx   # Settings persistence
│   │   │   │   ├── EventServiceTab.tsx  # Inter-plugin messaging
│   │   │   │   ├── PageContextServiceTab.tsx # Navigation awareness
│   │   │   │   ├── PluginStateServiceTab.tsx # Plugin data persistence
│   │   │   │   └── *.css                # Theme-aware styles
│   │   │   ├── TabView.tsx              # Tab navigation component
│   │   │   ├── CodeExample.tsx          # Syntax-highlighted code display
│   │   │   ├── TryItButton.tsx          # Interactive demo buttons
│   │   │   ├── ResultDisplay.tsx        # API response display
│   │   │   └── index.ts                 # Exports
│   │   ├── ServiceBridgeShowcase.tsx    # Main showcase orchestrator
│   │   ├── ErrorBoundary.tsx            # Class component (MUST stay class)
│   │   ├── ErrorDisplay.tsx             # Error UI component
│   │   ├── LoadingSpinner.tsx           # Loading state component
│   │   ├── SettingsExample.tsx          # Settings module
│   │   └── index.ts
│   ├── hooks/                           # Custom React hooks for services
│   │   ├── useTheme.ts                  # Theme service integration
│   │   ├── usePageContext.ts            # Page context service
│   │   ├── useSettings.ts               # Settings service
│   │   ├── useAPI.ts                    # API service with error handling
│   │   ├── usePluginState.ts            # 🆕 Plugin state persistence
│   │   ├── useErrorHandler.ts           # Error management
│   │   └── index.ts
│   ├── services/                        # Business logic layer
│   │   ├── PluginService.ts             # Example service class
│   │   └── index.ts
│   ├── utils/                           # Utility functions
│   │   ├── errorHandling.ts             # ErrorHandler class, strategies
│   │   └── utils.ts                     # General utilities
│   ├── types.ts                         # All TypeScript interfaces
│   ├── PluginTemplateFunctional.tsx     # Main plugin component
│   ├── PluginTemplateFunctional.css     # Main styles (CSS variables)
│   └── index.tsx                        # Entry point
├── docs/                                # Comprehensive documentation
│   ├── AI_AGENT_INSTRUCTIONS.md         # 👈 This file
│   ├── SERVICE_BRIDGES.md               # Complete service integration guide
│   ├── THEMING.md                       # Styling guide (NO Tailwind!)
│   └── HOOKS_GUIDE.md                   # React hooks best practices
├── references/                          # Lifecycle manager documentation
│   ├── LIFECYCLE_MANAGER_CUSTOMIZATION_GUIDE.md
│   ├── Lifecycle-Manager-Reference.md
│   ├── Module-Data-Field-Reference.md
│   └── Plugin-Data-Field-Reference.md
├── dist/                                # Build output (committed to git)
│   ├── remoteEntry.js                   # Main entry point for BrainDrive
│   ├── main.js                          # Application bundle
│   └── *.js                             # Chunked modules
├── public/
│   └── index.html                       # Dev server template
├── webpack.config.js                    # ⚠️ CRITICAL: Uses externals pattern
├── tsconfig.json                        # TypeScript configuration
├── lifecycle_manager.py                 # Plugin metadata & lifecycle
├── package.json                         # NPM configuration
├── README.md                            # Main documentation
├── QUICK_START_FOR_AI.md               # Quick reference for AI agents
└── TESTING_RESULTS.md                   # Test validation results
```

## ⚠️ CRITICAL: What You MUST NOT Change

### 1. Webpack Configuration (ABSOLUTELY CRITICAL)

**DO NOT MODIFY THIS PATTERN:**

```javascript
// webpack.config.js
externals: {
  'react': 'React',  // Uses window.React from BrainDrive host
}

// In ModuleFederationPlugin:
// NO 'shared' configuration!
// This is INTENTIONAL to prevent React duplication
```

**Why This Matters:**
- BrainDrive host exposes `window.React` globally in `frontend/src/main.tsx`
- Using `externals` tells webpack to use that instead of bundling React
- Module Federation's `shared: { react: { singleton: true } }` causes duplicate React instances
- Duplicate React = **"Invalid hook call" errors** that break all hooks
- This was hard-won knowledge documented in commit: "Add workaround for functional component hook errors"
- Changing this breaks the entire plugin system

### 2. Name Synchronization (CRITICAL)

These names MUST match across all files:

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
        "name": "PluginTemplateFunctionalModule",  # MUST match webpack exposes
    }]
```

**src/index.tsx:**
```typescript
export default PluginTemplateFunctional;  // MUST match module name
```

**Why**: BrainDrive's module federation loader uses these names to find and load your plugin. Mismatch = plugin won't load.

### 3. ErrorBoundary Must Stay as Class Component

```tsx
// ✅ CORRECT - ErrorBoundary as class
class ErrorBoundary extends React.Component {
  static getDerivedStateFromError(error) { /* ... */ }
  componentDidCatch(error, errorInfo) { /* ... */ }
}

// ❌ WRONG - Cannot convert to functional
const ErrorBoundary: React.FC = () => { /* ... */ };
```

**Why**: React Error Boundaries MUST be class components. There is no hooks equivalent for `componentDidCatch`. This is a React limitation, not a choice.

### 4. No Tailwind CSS

**CRITICAL**: BrainDrive plugins do NOT use Tailwind CSS.

```tsx
// ❌ WRONG
<div className="bg-white text-black p-4 rounded-md">

// ✅ CORRECT
<div className="my-component">
```

```css
/* Use CSS custom properties that auto-update with theme */
.my-component {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
}
```

**Why**: CSS custom properties automatically update when the theme changes. Tailwind hardcodes values and breaks theme switching.

## 🌉 The 6 Service Bridges (Complete Coverage)

BrainDrive provides 6 service bridges to plugins. This template demonstrates **all 6** with interactive examples:

### 1. Theme Service 🎨
**Purpose**: Dark/light mode integration
**Hook**: `useTheme(services.theme, errorHandler)`
**Methods**: `getCurrentTheme`, `setTheme`, `toggleTheme`, `addThemeChangeListener`, `removeThemeChangeListener`

**Example Tab**: Shows theme indicator, toggle buttons, theme-aware cards, CSS custom properties showcase

```tsx
const { currentTheme, setTheme, toggleTheme } = useTheme(services.theme);
```

### 2. API Service 🌐
**Purpose**: HTTP requests to BrainDrive backend
**Hook**: `useAPI(services.api, errorHandler)`
**Methods**: `get`, `post`, `put`, `delete`, `postStreaming`

**Example Tab**: Real BrainDrive endpoints (AI models list, tags CRUD operations)

```tsx
const { get, post, put, delete: del, data, loading, error } = useAPI(services.api);
await get('/api/v1/ai/providers/all-models');
await post('/api/v1/tags', { name: 'Demo Tag', color: '#9B59B6' });
```

### 3. Settings Service ⚙️
**Purpose**: Persistent user preferences
**Hook**: `useSettings(services.settings, key, defaultValue, errorHandler)`
**Methods**: `getSetting`, `setSetting`, `getSettingDefinitions`

**Example Tab**: Boolean toggle, complex object settings with auto-save

```tsx
const { value, setValue, isLoading } = useSettings(
  services.settings,
  'my_setting_key',
  defaultValue
);
```

### 4. Event Service 📡
**Purpose**: Inter-plugin messaging
**Hook**: Direct service usage (no hook yet)
**Methods**: `sendMessage`, `subscribeToMessages`, `unsubscribeFromMessages`

**Example Tab**: Message sending, subscription management, request-response patterns

```tsx
services.event?.sendMessage('channel-name', {
  type: 'MESSAGE_TYPE',
  data: { /* ... */ }
});

useEffect(() => {
  const handler = (msg) => console.log('Received:', msg);
  services.event?.subscribeToMessages('channel-name', handler);

  return () => {
    services.event?.unsubscribeFromMessages('channel-name', handler);
  };
}, [services.event]);
```

### 5. PageContext Service 📍
**Purpose**: Current page/navigation information
**Hook**: `usePageContext(services.pageContext, errorHandler)`
**Methods**: `getCurrentPageContext`, `onPageContextChange`

**Example Tab**: Page ID/name/route display, studio detection, conditional rendering examples

```tsx
const { pageContext, isStudioPage, pageId, pageName, pageRoute } =
  usePageContext(services.pageContext);
```

### 6. PluginState Service 💾 (NEW!)
**Purpose**: Persistent plugin data across sessions
**Hook**: `usePluginState(services.pluginState, errorHandler, autoLoad)`
**Methods**: `saveState`, `getState`, `clearState`, `configure` (optional), `onSave`/`onRestore`/`onClear` (events)

**Example Tab**: Counter, form data, auto-save with debouncing, state configuration

```tsx
const { state, saveState, clearState, isLoading, error } =
  usePluginState(services.pluginState, errorHandler, true);

await saveState({
  counter: 42,
  userData: { name: 'John', preferences: ['Dark Mode'] }
});
```

## 🎓 Interactive Showcase System

### What It Is

The showcase is a **7-tab interactive learning platform** embedded in the plugin itself:

1. **Overview Tab** - Introduction to service bridges, what's available
2. **Theme Tab** - Dark/light mode, CSS variables, theme-aware components
3. **API Tab** - Real BrainDrive API calls (AI models, tags CRUD)
4. **Settings Tab** - Boolean settings, complex objects, persistence
5. **Events Tab** - Inter-plugin messaging, subscriptions, patterns
6. **PageContext Tab** - Current page info, navigation, conditional rendering
7. **PluginState Tab** - Plugin data persistence, auto-save, event subscriptions

### Why It Exists

**The Problem**: Developers didn't understand service bridges - no working examples.

**The Solution**: Turn the template itself into an interactive learning platform where developers can:
- Click buttons to see services work in real-time
- View actual API responses
- Copy working code examples
- Understand every service bridge with hands-on demos

### Architecture

```
ServiceBridgeShowcase (Main orchestrator)
  └─> TabView (Tab navigation)
       ├─> OverviewTab
       ├─> ThemeServiceTab
       ├─> APIServiceTab
       ├─> SettingsServiceTab
       ├─> EventServiceTab
       ├─> PageContextServiceTab
       └─> PluginStateServiceTab

Shared Components:
  - CodeExample: Syntax-highlighted code with copy button
  - TryItButton: Interactive demo buttons with loading states
  - ResultDisplay: API response/data display with variants
```

### Key Features

- **Interactive Buttons**: Click to trigger actual service calls
- **Real-Time Results**: See API responses, state changes, events
- **Copy-Paste Code**: Every example includes working TypeScript code
- **Error Demonstrations**: Shows how errors are handled
- **Theme-Aware**: All components adapt to dark/light mode
- **Production Code**: Not fake demos - actual service integration

## 🔧 Custom Hooks: The Abstraction Layer

All service integration is abstracted through custom hooks. This is **compounding engineering in action**:

### 1. useTheme
**What it does**: Integrates with theme service, handles subscriptions, cleanup
**Returns**: `{ currentTheme, setTheme, toggleTheme, isAvailable }`
**Lines**: 120
**Handles**: Stale closures, cleanup, availability checking

### 2. usePageContext
**What it does**: Tracks current page, provides helper properties
**Returns**: `{ pageContext, isStudioPage, pageId, pageName, pageRoute, isAvailable }`
**Lines**: 95
**Handles**: Context parsing, change subscriptions, cleanup

### 3. useSettings
**What it does**: Load/save settings with loading states
**Returns**: `{ value, setValue, isLoading, error }`
**Lines**: 110
**Handles**: Async operations, debouncing, error states

### 4. useAPI
**What it does**: HTTP requests with loading, error, and success states
**Returns**: `{ get, post, put, delete, postStreaming, data, loading, error, clearError }`
**Lines**: 180
**Handles**: Async HTTP, error handling, loading states, cleanup

### 5. usePluginState (NEW!)
**What it does**: Plugin state persistence across sessions
**Returns**: `{ state, saveState, clearState, isLoading, error, isAvailable }`
**Lines**: 209
**Handles**: Auto-load, async save/clear, event subscriptions, mounted state

### 6. useErrorHandler
**What it does**: Comprehensive error management with strategies
**Returns**: `{ error, handleError, handleRetry, clearError, safeAsync }`
**Lines**: 250
**Handles**: Retry logic, error strategies, fallbacks, error state

## 📖 BrainDrive Plugin Architecture Context

### How BrainDrive Loads Plugins

1. **Host System** (`frontend/src/main.tsx`):
   ```typescript
   window.React = React;  // Exposes React globally
   ```

2. **Plugin Loader** (`frontend/src/services/remotePluginService.ts`):
   - Fetches `remoteEntry.js` from plugin
   - Uses Module Federation to load plugin modules
   - Injects services into plugin props

3. **Plugin Renderer** (`frontend/src/features/plugin-studio/components/canvas/PluginModuleRenderer.tsx`):
   - Wraps plugin in ErrorBoundary
   - Passes services and config as props
   - Renders plugin in the canvas

### Props Your Plugin Receives

```typescript
interface PluginProps {
  // Identity
  id?: string;
  pluginId?: string;
  moduleId?: string;
  instanceId?: string;

  // Services (injected by host)
  services: {
    api?: ApiService;
    theme?: ThemeService;
    settings?: SettingsService;
    event?: EventService;
    pageContext?: PageContextService;
    pluginState?: PluginStateService;
  };

  // Config (from lifecycle_manager.py settings)
  config?: {
    refreshInterval?: number;
    showAdvancedOptions?: boolean;
    customSetting?: string;
    // Any fields you define in lifecycle_manager.py
  };
}
```

### Service Declaration

Services must be declared in `lifecycle_manager.py`:

```python
"required_services": {
    "api": {
        "methods": ["get", "post", "put", "delete", "postStreaming"],
        "version": "1.0.0"
    },
    "theme": {
        "methods": ["getCurrentTheme", "setTheme", "toggleTheme",
                    "addThemeChangeListener", "removeThemeChangeListener"],
        "version": "1.0.0"
    },
    "settings": {
        "methods": ["getSetting", "setSetting", "getSettingDefinitions"],
        "version": "1.0.0"
    },
    "event": {
        "methods": ["sendMessage", "subscribeToMessages", "unsubscribeFromMessages"],
        "version": "1.0.0"
    },
    "pageContext": {
        "methods": ["getCurrentPageContext", "onPageContextChange"],
        "version": "1.0.0"
    },
    "pluginState": {
        "methods": ["saveState", "getState", "clearState"],
        "version": "1.0.0"
    }
}
```

**Without this declaration, services will be undefined in your plugin!**

## 🎯 Implementation Patterns (Codified Learnings)

### Pattern 1: Always Check Service Availability

```tsx
// ❌ WRONG - Will crash if service undefined
const theme = services.theme.getCurrentTheme();

// ✅ CORRECT - Check first
if (!services.theme) {
  console.warn('Theme service not available');
  return;
}
const theme = services.theme.getCurrentTheme();

// ✅ EVEN BETTER - Use custom hook (handles this automatically)
const { currentTheme, isAvailable } = useTheme(services.theme);
if (!isAvailable) return <div>Service unavailable</div>;
```

### Pattern 2: Always Cleanup Subscriptions

```tsx
// ❌ WRONG - Memory leak!
useEffect(() => {
  services.theme.addThemeChangeListener(handleThemeChange);
  // No cleanup!
}, []);

// ✅ CORRECT - Cleanup in return function
useEffect(() => {
  if (!services.theme) return;

  const handleThemeChange = (newTheme) => {
    console.log('Theme changed:', newTheme);
  };

  services.theme.addThemeChangeListener(handleThemeChange);

  return () => {
    services.theme.removeThemeChangeListener(handleThemeChange);
  };
}, [services.theme]);

// ✅ EVEN BETTER - Use custom hook (handles cleanup automatically)
const { currentTheme } = useTheme(services.theme);
```

### Pattern 3: Prevent Stale Closures with useRef

```tsx
// ❌ WRONG - Stale closure
useEffect(() => {
  const listener = () => {
    console.log(count); // Will always log initial count!
  };
  services.event.subscribeToMessages('channel', listener);

  return () => {
    services.event.unsubscribeFromMessages('channel', listener);
  };
}, []); // Empty deps = listener never updates

// ✅ CORRECT - Use ref for latest value
const countRef = useRef(count);
countRef.current = count; // Always update ref

useEffect(() => {
  const listener = () => {
    console.log(countRef.current); // Always gets latest!
  };
  services.event.subscribeToMessages('channel', listener);

  return () => {
    services.event.unsubscribeFromMessages('channel', listener);
  };
}, [services.event]); // Don't include count in deps
```

### Pattern 4: Functional Updates for State

```tsx
// ❌ WRONG - Can lose updates in rapid succession
const increment = () => {
  setCount(count + 1);
};

// ✅ CORRECT - Functional update ensures correct value
const increment = () => {
  setCount(prev => prev + 1);
};
```

### Pattern 5: Memoize Callbacks Passed to Children

```tsx
// ❌ WRONG - New function every render, child re-renders
const handleClick = () => {
  console.log('clicked');
};

// ✅ CORRECT - Memoized, child won't re-render unnecessarily
const handleClick = useCallback(() => {
  console.log('clicked');
}, []); // Only recreate if deps change
```

### Pattern 6: Use CSS Custom Properties

```css
/* ❌ WRONG - Hardcoded colors break theme switching */
.component {
  background-color: #ffffff;
  color: #000000;
}

/* ✅ CORRECT - Variables update automatically */
.component {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
}

/* Available CSS variables (from BrainDrive theme):
   Colors:
   - --bg-primary, --bg-secondary, --bg-tertiary
   - --text-primary, --text-secondary, --text-muted
   - --accent-color, --success-color, --danger-color, --warning-color
   - --border-color

   Spacing:
   - --spacing-xs, --spacing-sm, --spacing-md, --spacing-lg, --spacing-xl

   Borders:
   - --radius-sm, --radius-md, --radius-lg
*/
```

## 🧪 Testing Checklist

Before considering work complete:

### Build Tests
- [ ] `npm install` succeeds without errors
- [ ] `npm run build` succeeds
- [ ] No TypeScript compilation errors
- [ ] No webpack warnings about React
- [ ] `dist/remoteEntry.js` is created (main entry point)
- [ ] Build size reasonable (~300-400 KB)

### Integration Tests
- [ ] Plugin loads in BrainDrive without errors
- [ ] No "Invalid hook call" errors in console
- [ ] Theme switching works (dark ↔ light)
- [ ] All tabs in showcase load correctly
- [ ] All custom hooks work correctly

### Service Tests (Click through showcase tabs)
- [ ] Theme service: Toggle theme button works
- [ ] API service: GET AI models returns data
- [ ] API service: Create/update/delete tag works
- [ ] Settings service: Toggle setting persists
- [ ] Settings service: Complex object settings save correctly
- [ ] Events service: Send/receive messages works
- [ ] PageContext service: Shows correct page info
- [ ] PluginState service: Save/load state persists across reload

### Memory Leak Tests
- [ ] No console warnings about missing cleanup
- [ ] React DevTools Profiler shows no memory growth
- [ ] Navigate away and back - no duplicate subscriptions

### Documentation Tests
- [ ] All code examples in docs are accurate
- [ ] README instructions work from scratch
- [ ] AI_AGENT_INSTRUCTIONS.md reflects current state

## 🚫 Common Pitfalls (Lessons Learned)

### Pitfall 1: Forgetting useEffect Dependencies

```tsx
// ❌ WRONG - Missing dependencies
useEffect(() => {
  fetchData(userId, apiKey);
}, []); // Should include [userId, apiKey]!

// React will warn: "React Hook useEffect has missing dependencies"
// This causes stale data and bugs

// ✅ CORRECT
useEffect(() => {
  fetchData(userId, apiKey);
}, [userId, apiKey]);
```

**Lesson**: Always include ALL values used inside useEffect in the dependency array. Use ESLint's `react-hooks/exhaustive-deps` rule.

### Pitfall 2: Not Handling Service Unavailability

```tsx
// ❌ WRONG - Crashes if service undefined
const MyComponent: React.FC<Props> = ({ services }) => {
  const theme = services.theme.getCurrentTheme(); // CRASH!

  return <div>{theme}</div>;
};

// ✅ CORRECT - Check availability
const MyComponent: React.FC<Props> = ({ services }) => {
  if (!services.theme) {
    return <div>Theme service unavailable</div>;
  }

  const theme = services.theme.getCurrentTheme();
  return <div>{theme}</div>;
};
```

**Lesson**: Services may not be available in all contexts (dev mode, missing declaration). Always check.

### Pitfall 3: Creating New Functions in Render

```tsx
// ❌ WRONG - New function every render
return (
  <ChildComponent
    onClick={() => console.log('clicked')}  // New function each time!
  />
);

// ✅ CORRECT - Memoized callback
const handleClick = useCallback(() => {
  console.log('clicked');
}, []);

return <ChildComponent onClick={handleClick} />;
```

**Lesson**: Use `useCallback` for functions passed to child components to prevent unnecessary re-renders.

### Pitfall 4: Mutating State Directly

```tsx
// ❌ WRONG - Mutating state
const [items, setItems] = useState([1, 2, 3]);
items.push(4);  // WRONG! Doesn't trigger re-render
setItems(items);  // Still wrong - same reference

// ✅ CORRECT - Create new array
setItems([...items, 4]);
// or
setItems(prev => [...prev, 4]);
```

**Lesson**: State must be treated as immutable. Always create new objects/arrays.

### Pitfall 5: Using Async Functions in useEffect Directly

```tsx
// ❌ WRONG - useEffect callback can't be async
useEffect(async () => {  // ERROR!
  const data = await fetchData();
}, []);

// ✅ CORRECT - Define async function inside
useEffect(() => {
  const loadData = async () => {
    const data = await fetchData();
    setData(data);
  };

  loadData();
}, []);
```

**Lesson**: useEffect callback must return void or a cleanup function, not a Promise.

## 📚 Documentation Files Reference

### For Developers Using This Template

1. **README.md** - Start here
   - Quick start guide
   - Project structure
   - Common tasks
   - Troubleshooting

2. **docs/SERVICE_BRIDGES.md** - Service integration
   - All 6 service bridges explained
   - Code examples for each
   - Best practices
   - Common patterns

3. **docs/THEMING.md** - Styling guide
   - CSS custom properties reference
   - Dark/light mode support
   - Theme-aware components
   - NO Tailwind explanation

4. **docs/HOOKS_GUIDE.md** - React hooks
   - useState, useEffect, useRef, useCallback, useMemo
   - Custom hooks patterns
   - Performance optimization
   - Common mistakes

### For AI Agents

1. **docs/AI_AGENT_INSTRUCTIONS.md** - This file
   - Complete context for AI agents
   - What to change, what not to change
   - Codified patterns and learnings
   - Testing checklist

2. **QUICK_START_FOR_AI.md** - Quick reference
   - Most common commands
   - File locations
   - Quick patterns

### For Plugin Configuration

1. **references/LIFECYCLE_MANAGER_CUSTOMIZATION_GUIDE.md**
   - How to customize lifecycle_manager.py
   - Field explanations

2. **references/Plugin-Data-Field-Reference.md**
   - All plugin metadata fields
   - Required vs optional

3. **references/Module-Data-Field-Reference.md**
   - Module configuration options
   - Service declarations

## 🛠️ Common Commands

```bash
# Development
npm install              # Install dependencies
npm run dev             # Development mode with watch
npm start               # Dev server on http://localhost:3004

# Building
npm run build           # Production build
npm run build:dev       # Development build (with source maps)

# Testing
npm test                # Run tests (if configured)
npm run type-check      # TypeScript type checking only

# Linting
npm run lint            # Lint code (if configured)
npm run lint:fix        # Auto-fix linting issues
```

## 🎯 Your Mission as an AI Agent

When working on this template, your goals are:

1. **Preserve What Works**
   - Don't break webpack config
   - Don't change ErrorBoundary to functional
   - Don't remove name synchronization
   - Don't add Tailwind

2. **Maintain Compounding Engineering**
   - Document WHY, not just WHAT
   - Create reusable patterns
   - Add to existing hooks rather than creating new ones
   - Keep examples practical and copy-paste ready
   - **AUTO-DOCUMENT decisions, failures, quirks, and integrations**

3. **Enhance Learning**
   - Add interactive examples to showcase
   - Improve documentation clarity
   - Add troubleshooting sections
   - Keep code comments up to date

4. **Follow Established Patterns**
   - Use custom hooks for service integration
   - Always check service availability
   - Always cleanup in useEffect
   - Use CSS custom properties
   - TypeScript for everything

### 🤖 Auto-Compounding: When to Create Documentation

As an AI agent, you should **automatically create documentation** in these scenarios:

#### Trigger 1: Made Architectural Decision
**IF** you chose between 2+ approaches OR selected a library/framework OR changed core architecture
**THEN** create ADR:
```bash
cp docs/decisions/000-template.md docs/decisions/00X-decision-name.md
```

**Example scenarios**:
- Chose React hooks over class components → Create ADR
- Selected webpack externals over Module Federation shared → Create ADR
- Decided on custom hooks pattern for services → Create ADR

---

#### Trigger 2: Discovered Data Quirk
**IF** data behaves unexpectedly OR service has undocumented limitation OR API returns inconsistent format
**THEN** create Data Quirk Doc:
```bash
cp docs/data-quirks/000-template.md docs/data-quirks/00X-quirk-name.md
```

**Example scenarios**:
- BrainDrive services may be undefined → Create Data Quirk
- CSS variables auto-update with theme → Create Data Quirk
- PluginState auto-loads on configuration → Create Data Quirk

---

#### Trigger 3: Hit Error or Made Mistake
**IF** wrong assumption made (>1 hour wasted) OR approach failed (later fixed) OR unexpected error
**THEN** create Failure Log:
```bash
cp docs/failures/000-template.md docs/failures/00X-failure-name.md
```

**Example scenarios**:
- "Invalid hook call" from React duplication → Create Failure Log
- Memory leak from missing useEffect cleanup → Create Failure Log
- Service undefined without lifecycle_manager declaration → Create Failure Log

---

#### Trigger 4: Integrated External System
**IF** connected to new API/service OR created service wrapper OR integrated BrainDrive service bridge
**THEN** create Integration Doc:
```bash
cp docs/integrations/000-template.md docs/integrations/service-name.md
```

**Example scenarios**:
- Integrated Theme Service → Create Integration Doc
- Integrated API Service → Create Integration Doc
- Connected to external API → Create Integration Doc

---

### Before Implementing Features: Check Existing Knowledge

**ALWAYS search documentation before starting work**:

```bash
# 1. Check for related decisions
grep -r "keyword" docs/decisions/

# 2. Check for past failures
grep -r "keyword" docs/failures/

# 3. Check for data quirks
grep -r "keyword" docs/data-quirks/

# 4. Check integrations
ls docs/integrations/
```

**Example workflow**:
```
User: "Add theme switching to the plugin"

AI Agent:
1. Search: grep -r "theme" docs/decisions/
   → Found ADR-003 about CSS custom properties
2. Search: grep -r "theme" docs/failures/
   → Found Failure-002 about missing cleanup
3. Search: grep -r "theme" docs/integrations/
   → Found braindrive-theme-service.md (if exists)
4. Implement using established patterns from docs
5. If new pattern needed → Create ADR documenting approach
```

**📖 Complete compounding engineering guide**: [docs/COMPOUNDING_GUIDE.md](COMPOUNDING_GUIDE.md)

## 🔗 External Resources

### BrainDrive Core
- **Repository**: https://github.com/BrainDriveAI/BrainDrive-Core
- **Issue Context**: https://github.com/BrainDriveAI/BrainDrive-Core/issues/195
- **Documentation**: https://docs.braindrive.ai

### Official Service Bridge Examples
- API Bridge: https://github.com/BrainDriveAI/BrainDrive-API-Service-Bridge-Example-Plugin
- Events Bridge: https://github.com/BrainDriveAI/BrainDrive-Events-Service-Bridge-Example-Plugin
- Theme Bridge: https://github.com/BrainDriveAI/BrainDrive-Theme-Service-Bridge-Example-Plugin
- Settings Bridge: https://github.com/BrainDriveAI/BrainDrive-Settings-Service-Bridge-Example-Plugin
- PageContext Bridge: https://github.com/BrainDriveAI/BrainDrive-Page-Context-Service-Bridge-Example-Plugin
- PluginState Bridge: https://github.com/BrainDriveAI/BrainDrive-Plugin-State-Service-Bridge-Example-Plugin

### React Documentation
- **Hooks**: https://react.dev/reference/react/hooks
- **Rules of Hooks**: https://react.dev/warnings/invalid-hook-call-warning
- **useEffect**: https://react.dev/reference/react/useEffect

### Webpack
- **Module Federation**: https://webpack.js.org/concepts/module-federation/
- **Externals**: https://webpack.js.org/configuration/externals/

## 📊 Recent Changes Log

### v2.1.0 (2025-01-13)
- ✅ Added PluginState Service Bridge (6th service)
- ✅ Created usePluginState custom hook
- ✅ Added PluginStateServiceTab with 4 examples
- ✅ Updated lifecycle_manager.py with pluginState declaration
- ✅ Updated all documentation to reflect 6/6 service coverage
- ✅ Aligned with official BrainDrive service bridge documentation

### v2.0.0 (2025-01-12)
- ✅ Created interactive service bridge showcase system
- ✅ Implemented 7-tab navigation (Overview + 6 service tabs)
- ✅ Added real BrainDrive API examples (AI models, tags CRUD)
- ✅ Created shared showcase components (CodeExample, TryItButton, ResultDisplay)
- ✅ Full theme support across all showcase components
- ✅ 30+ interactive code examples
- ✅ Comprehensive error handling demonstrations

### v1.0.0 (Initial Release)
- ✅ Converted from class to functional components
- ✅ Created 5 custom hooks (Theme, PageContext, Settings, API, ErrorHandler)
- ✅ Fixed webpack config (externals pattern)
- ✅ Complete documentation suite
- ✅ Production-ready error handling

## 🎉 Success Criteria

You know you're doing it right when:

1. ✅ Build succeeds without warnings
2. ✅ Plugin loads in BrainDrive without errors
3. ✅ All showcase tabs work interactively
4. ✅ Theme switching works everywhere
5. ✅ No "Invalid hook call" errors
6. ✅ No memory leaks (subscriptions cleaned up)
7. ✅ Code is self-documenting with comments
8. ✅ Examples are copy-paste ready
9. ✅ Documentation matches code reality
10. ✅ Next developer can understand and extend easily

## 💡 Final Wisdom

This template represents **25,000+ words** of hard-won knowledge about React hooks, BrainDrive plugins, and service integration. Every decision has a reason. Every pattern was learned through trial and error.

**When in doubt:**
- Read the comments in the code
- Check the documentation
- Look at the showcase examples
- Ask yourself: "Does this make the next feature easier or harder?"

**Remember**: Compounding engineering means each feature should make future features easier to build. If you're adding complexity without adding reusability, stop and refactor.

**Good luck building amazing BrainDrive plugins! 🚀**

---

**Last updated**: 2025-01-13
**Maintainer**: Beck Muradov
**License**: MIT
