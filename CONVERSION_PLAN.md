# BrainDrive Functional Component Plugin Template - Conversion Plan

## Overview
Convert the existing class-based plugin template to a modern functional component template with hooks, while preserving all error handling, service bridges, and lifecycle management.

## Phase 1: Project Setup & Structure
- [x] Create new directory: `backend/plugins/shared/BrainDrive-PluginTemplate-Functional/`
- [x] Copy base files from class template (package.json, tsconfig.json, LICENSE, etc.)
- [x] Update package.json name to "braindrive-plugin-template-functional"
- [x] Create docs/ directory for SERVICE_BRIDGES.md and THEMING.md

## Phase 2: Webpack Configuration (CRITICAL)
- [x] Convert webpack.config.js to use `externals` pattern (NOT shared config)
- [x] Remove entire `shared` section from ModuleFederationPlugin
- [x] Add `externals: { 'react': 'React' }` to use window.React
- [x] Verify Module Federation exposes matches lifecycle_manager.py
- [x] Test that React hooks work correctly with this configuration

## Phase 3: Core Component Conversion
- [x] Convert PluginTemplate.tsx from class to functional component
  - [x] Replace `this.state` with useState hooks
  - [x] Convert `componentDidMount` to useEffect(() => {}, [])
  - [x] Convert `componentWillUnmount` to useEffect cleanup (return function)
  - [x] Replace instance variables (this.retryCount) with useRef hooks
  - [x] Convert bound methods to useCallback hooks
  - [x] Add comments explaining hook equivalents to class lifecycle

## Phase 4: Service Bridge Integration
- [x] Create useServices custom hook for service initialization
- [x] Create useTheme custom hook for theme service integration
- [x] Create usePageContext custom hook for page context service
- [x] Create useSettings custom hook for settings service
- [x] Create useAPI custom hook for API service calls
- [x] Ensure all hooks have proper cleanup functions
- [x] Add dependency arrays to prevent infinite re-renders

## Phase 5: Error Handling with Hooks
- [x] Keep ErrorBoundary.tsx as-is (class component required for error boundaries)
- [x] Convert error handling logic to functional patterns
- [x] Create useErrorHandler custom hook
- [x] Implement retry logic with hooks
- [x] Preserve all error types and strategies from class version
- [x] Add error state management with useState

## Phase 6: Component Library
- [x] Keep ErrorBoundary.tsx (class component)
- [x] Convert ErrorDisplay.tsx to functional (if not already)
- [x] Convert LoadingSpinner.tsx to functional (if not already)
- [x] Convert SettingsExample.tsx to functional with hooks
- [x] Create example custom hooks library

## Phase 7: Documentation
- [x] Create docs/SERVICE_BRIDGES.md with:
  - What service bridges are
  - How to use each service (Theme, PageContext, Settings, API, Event)
  - Hook patterns for service subscriptions
  - Complete code examples with hooks
  - Cleanup patterns
- [x] Create docs/THEMING.md with:
  - CSS custom properties reference
  - Why Tailwind is NOT supported
  - How to use theme service
  - Example theme-aware components
  - Dark/light mode patterns
- [x] Create docs/HOOKS_GUIDE.md with:
  - useState examples
  - useEffect patterns and pitfalls
  - useCallback and useMemo usage
  - Custom hooks best practices
  - Dependency array guidelines
- [x] Update README.md for functional component approach
- [x] Update DEVELOPER_GUIDE.md with hooks patterns
- [x] Add MIGRATION_FROM_CLASS.md guide

## Phase 8: Example Implementations
- [x] Create example: Simple data fetching with hooks
- [x] Create example: Theme-aware component
- [x] Create example: Settings integration with subscriptions
- [x] Create example: Real-time updates with event service
- [x] Create example: Complex state management patterns
- [x] Create example: Custom hooks composition

## Phase 9: Testing & Validation
- [x] Test webpack build produces correct output
- [x] Verify React hooks don't cause "Invalid hook call" error
- [x] Test all service bridges work correctly
- [x] Verify theme switching works
- [x] Test settings persistence
- [x] Verify cleanup functions are called on unmount
- [x] Check for memory leaks from subscriptions
- [x] Test error boundaries catch hook errors

## Phase 10: Release Preparation
- [x] Create comparison table: Class vs Functional patterns
- [x] Add troubleshooting section for common hook issues
- [x] Update all inline comments and TODOs
- [x] Create CHANGELOG.md
- [x] Version as 2.0.0 to distinguish from class template
- [x] Final review of all documentation

## Key Conversion Patterns Reference

### State Management
```typescript
// Class: this.state = { count: 0 }
// Functional: const [count, setCount] = useState(0)
```

### Lifecycle Methods
```typescript
// componentDidMount → useEffect(() => {}, [])
// componentWillUnmount → useEffect(() => { return () => cleanup }, [])
// componentDidUpdate → useEffect(() => {}, [dependency])
```

### Instance Variables
```typescript
// Class: this.retryCount = 0
// Functional: const retryCountRef = useRef(0)
```

### Methods
```typescript
// Class: handleClick() { }
// Functional: const handleClick = useCallback(() => { }, [deps])
```

### Critical Webpack Change
```javascript
// REMOVE:
shared: {
  react: { singleton: true, eager: true }
}

// ADD:
externals: {
  'react': 'React'
}
```

This ensures plugins use window.React from the host, preventing duplicate React instances that break hooks.

## Progress Tracking

As you complete each task, mark it with [x] instead of [ ].

Last Updated: 2025-11-13
