# Service Bridges in BrainDrive

## What Are Service Bridges?

Service Bridges are the communication layer between your plugin and the BrainDrive host application. They provide access to core platform features like theming, settings, API calls, events, and page context.

Think of Service Bridges as APIs that your plugin can call to:
- Get and set user preferences
- Make authenticated HTTP requests
- Subscribe to system events
- Respond to theme changes
- Access page-level context

## How Service Bridges Work

### 1. Service Injection

When BrainDrive loads your plugin, it automatically injects a `services` object into your component props:

```tsx
interface PluginProps {
  services: Services;
  // ... other props
}

const MyPlugin: React.FC<PluginProps> = ({ services }) => {
  // Access services here
};
```

### 2. Available Services

```typescript
interface Services {
  api?: ApiService;          // HTTP requests
  event?: EventService;      // Inter-plugin messaging
  theme?: ThemeService;      // Dark/light mode
  settings?: SettingsService; // User preferences
  pageContext?: PageContextService; // Page information
  pluginState?: PluginStateService; // Persistent plugin storage
}
```

**Important**: Services are optional (`?`) - always check for availability before use.

## Service Bridge Reference

### 1. Theme Service

Controls the application's visual theme (dark/light mode).

#### Interface

```typescript
interface ThemeService {
  getCurrentTheme(): string;
  setTheme(theme: string): void;
  toggleTheme(): void;
  addThemeChangeListener(callback: (theme: string) => void): void;
  removeThemeChangeListener(callback: (theme: string) => void): void;
}
```

#### Using with Hooks

```tsx
import { useTheme } from './hooks';

const MyPlugin: React.FC<PluginProps> = ({ services }) => {
  const { currentTheme, setTheme, toggleTheme } = useTheme(services.theme);

  return (
    <div className={`plugin ${currentTheme === 'dark' ? 'dark-theme' : ''}`}>
      <h3>Current Theme: {currentTheme}</h3>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};
```

#### Manual Implementation

```tsx
import { useState, useEffect, useRef } from 'react';

const MyPlugin: React.FC<PluginProps> = ({ services }) => {
  const [theme, setTheme] = useState('light');
  const listenerRef = useRef<((theme: string) => void) | null>(null);

  useEffect(() => {
    if (!services.theme) return;

    // Get initial theme
    const currentTheme = services.theme.getCurrentTheme();
    setTheme(currentTheme);

    // Subscribe to changes
    listenerRef.current = (newTheme: string) => {
      setTheme(newTheme);
    };
    services.theme.addThemeChangeListener(listenerRef.current);

    // Cleanup on unmount
    return () => {
      if (services.theme && listenerRef.current) {
        services.theme.removeThemeChangeListener(listenerRef.current);
      }
    };
  }, [services.theme]);

  return <div className={theme === 'dark' ? 'dark' : 'light'}>...</div>;
};
```

**Key Points**:
- Always check `if (services.theme)` before use
- Always cleanup listeners in useEffect return function
- Use `useRef` to store listener function reference
- Theme changes are automatic - just subscribe and react

---

### 2. Page Context Service

Provides information about the current page the plugin is displayed on.

#### Interface

```typescript
interface PageContextService {
  getCurrentPageContext(): PageContext | null;
  onPageContextChange(callback: (context: PageContext) => void): () => void;
}

interface PageContext {
  pageId: string;
  pageName: string;
  pageRoute: string;
  isStudioPage: boolean;
}
```

#### Using with Hooks

```tsx
import { usePageContext } from './hooks';

const MyPlugin: React.FC<PluginProps> = ({ services }) => {
  const { pageContext, isStudioPage, pageName } = usePageContext(services.pageContext);

  if (!pageContext) {
    return <div>Loading page context...</div>;
  }

  return (
    <div>
      <h3>Page: {pageName}</h3>
      <p>Route: {pageContext.pageRoute}</p>
      {isStudioPage && <p>This is a studio page!</p>}
    </div>
  );
};
```

#### Manual Implementation

```tsx
import { useState, useEffect, useRef } from 'react';

const MyPlugin: React.FC<PluginProps> = ({ services }) => {
  const [pageContext, setPageContext] = useState<PageContext | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!services.pageContext) return;

    // Get initial context
    const context = services.pageContext.getCurrentPageContext();
    setPageContext(context);

    // Subscribe to changes
    unsubscribeRef.current = services.pageContext.onPageContextChange((newContext) => {
      setPageContext(newContext);
    });

    // Cleanup
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [services.pageContext]);

  return <div>{pageContext?.pageName || 'Unknown page'}</div>;
};
```

**Key Points**:
- Page context can be `null` initially
- `onPageContextChange` returns an unsubscribe function
- Always call the unsubscribe function on unmount
- Use for page-specific behavior or context-aware UI

---

### 3. Settings Service

Manages persistent user settings and configuration.

> **⚠️ CRITICAL REQUIREMENT**: All settings MUST be registered in `lifecycle_manager.py` before use!
>
> Attempting to save a setting without registration will throw:
> `Error: Setting definition <setting_id> not found`

#### Interface

```typescript
interface SettingsService {
  get(key: string): any;
  set(key: string, value: any): Promise<void>;
  getSetting?(id: string): Promise<any>;
  setSetting?(id: string, value: any): Promise<any>;
  getSettingDefinitions?(): Promise<any>;
}
```

#### Step 1: Register Settings in lifecycle_manager.py

**Before using ANY setting**, you must register it in your plugin's `settingDefinitions`:

```python
# In lifecycle_manager.py
self.plugin_data = {
    "name": "MyPlugin",
    "version": "1.0.0",
    # ... other fields ...

    # REQUIRED: Register all settings here
    "settingDefinitions": [
        {
            "id": "plugin_notifications_enabled",  # Setting key
            "name": "Enable Notifications",         # Display name
            "description": "Enable or disable plugin notifications",
            "type": "boolean",                      # boolean, string, number, object, array
            "default": False,                       # Default value
            "category": "general",                  # Grouping category
            "scope": "user"                         # user-scoped or global
        },
        {
            "id": "plugin_preferences",
            "name": "Plugin Preferences",
            "description": "Complex preference settings",
            "type": "object",
            "default": {
                "refreshInterval": 60000,
                "defaultView": "grid",
                "theme": "auto"
            },
            "category": "general",
            "scope": "user"
        }
    ]
}
```

**Supported Types**: `boolean`, `string`, `number`, `object`, `array`

**Scopes**:
- `user`: Different value per user (most common)
- `global`: Shared across all users

#### Step 2: Using with Hooks

Once registered in `lifecycle_manager.py`, you can use the setting:

```tsx
import { useSettings } from './hooks';

const MyPlugin: React.FC<PluginProps> = ({ services }) => {
  const {
    value: refreshInterval,
    setValue: setRefreshInterval,
    isLoading,
    error
  } = useSettings(services.settings, 'plugin_refresh_interval', 60000);

  return (
    <div>
      <label>Refresh Interval (ms):</label>
      <input
        type="number"
        value={refreshInterval}
        onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
        disabled={isLoading}
      />
      {error && <p className="error">{error}</p>}
    </div>
  );
};
```

#### With Validation

```tsx
import { useSettingsWithValidation } from './hooks';

const MyPlugin: React.FC<PluginProps> = ({ services }) => {
  const {
    value: port,
    setValue: setPort,
    isValid,
    validationError
  } = useSettingsWithValidation(
    services.settings,
    'port_number',
    3000,
    [
      (val) => val > 0 || 'Port must be positive',
      (val) => val < 65536 || 'Port must be less than 65536'
    ]
  );

  return (
    <div>
      <input value={port} onChange={(e) => setPort(parseInt(e.target.value))} />
      {!isValid && <p className="error">{validationError}</p>}
    </div>
  );
};
```

#### Manual Implementation

```tsx
import { useState, useCallback } from 'react';

const MyPlugin: React.FC<PluginProps> = ({ services }) => {
  const [value, setValue] = useState<any>(null);

  // Load setting
  const loadSetting = useCallback(async (key: string) => {
    if (!services.settings) return;
    try {
      const saved = await services.settings.getSetting?.(key);
      setValue(saved);
    } catch (error) {
      console.error('Failed to load setting:', error);
    }
  }, [services.settings]);

  // Save setting
  const saveSetting = useCallback(async (key: string, value: any) => {
    if (!services.settings) return;
    try {
      await services.settings.setSetting?.(key, value);
      setValue(value);
    } catch (error) {
      console.error('Failed to save setting:', error);
    }
  }, [services.settings]);

  return <div>...</div>;
};
```

**Key Points**:
- **MUST register in lifecycle_manager.py first** - This is the #1 cause of errors
- Settings are async operations - use `async/await`
- Settings persist across sessions
- Use meaningful, namespaced keys (e.g., `plugin_notifications_enabled`)
- Handle errors gracefully (will throw if setting not registered)
- Provide default values in both `settingDefinitions` AND hook calls
- Setting IDs in code must match `id` field in `settingDefinitions`

**Common Errors**:
```
❌ Error: Setting definition my_setting not found
   → Solution: Add setting to settingDefinitions in lifecycle_manager.py

❌ TypeError: services.settings is undefined
   → Solution: Add 'settings' to required_services in module_data
```

---

### 4. API Service

Makes authenticated HTTP requests to the BrainDrive backend.

#### Interface

```typescript
interface ApiService {
  get(url: string, options?: any): Promise<ApiResponse>;
  post(url: string, data: any, options?: any): Promise<ApiResponse>;
  put(url: string, data: any, options?: any): Promise<ApiResponse>;
  delete(url: string, options?: any): Promise<ApiResponse>;
  postStreaming?(url: string, data: any, onChunk: (chunk: string) => void, options?: any): Promise<ApiResponse>;
}

interface ApiResponse {
  data?: any;
  status?: number;
  id?: string;
  [key: string]: any;
}
```

#### Using with Hooks

```tsx
import { useAPI } from './hooks';

const MyPlugin: React.FC<PluginProps> = ({ services }) => {
  const { get, post, data, loading, error } = useAPI(services.api);

  useEffect(() => {
    get('/api/plugin/data');
  }, []);

  const handleSave = async () => {
    const result = await post('/api/plugin/save', { name: 'test' });
    if (result) {
      console.log('Saved successfully');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};
```

#### Manual Implementation

```tsx
const MyPlugin: React.FC<PluginProps> = ({ services }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!services.api) {
      setError('API service not available');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await services.api.get('/api/endpoint');
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return <div>...</div>;
};
```

**Key Points**:
- All requests are automatically authenticated
- Handle loading and error states
- API responses have a standard structure
- Use absolute paths from backend root (e.g., `/api/collections`)
- Streaming is available for long-running operations

---

### 5. Event Service

Enables inter-plugin communication and system events.

#### Interface

```typescript
interface EventService {
  sendMessage(target: string, message: any, options?: any): void;
  subscribeToMessages(target: string, callback: (message: any) => void): void;
  unsubscribeFromMessages(target: string, callback: (message: any) => void): void;
}
```

#### Usage Example

```tsx
import { useEffect, useCallback, useRef } from 'react';

const MyPlugin: React.FC<PluginProps> = ({ services }) => {
  const callbackRef = useRef<((message: any) => void) | null>(null);

  useEffect(() => {
    if (!services.event) return;

    // Define message handler
    callbackRef.current = (message: any) => {
      console.log('Received message:', message);
      // Handle message
    };

    // Subscribe to messages
    services.event.subscribeToMessages('my-plugin-channel', callbackRef.current);

    // Cleanup
    return () => {
      if (services.event && callbackRef.current) {
        services.event.unsubscribeFromMessages('my-plugin-channel', callbackRef.current);
      }
    };
  }, [services.event]);

  const sendMessage = useCallback(() => {
    if (!services.event) return;
    services.event.sendMessage('other-plugin-channel', {
      type: 'UPDATE',
      data: { value: 123 }
    });
  }, [services.event]);

  return <button onClick={sendMessage}>Send Message</button>;
};
```

**Key Points**:
- Use consistent channel names
- Always unsubscribe on unmount
- Messages can be any serializable data
- Use for plugin-to-plugin communication
- Not for heavy data transfer

---

### 6. PluginState Service

Provides persistent key-value storage scoped to your plugin. Store user preferences, session data, and plugin state that persists across page reloads.

> **⚠️ CRITICAL REQUIREMENT**: Must call `configure()` before using any state methods!
>
> Attempting to save state without configuration will throw:
> `Error: Plugin state service not configured. Call configure() first.`

#### Interface

```typescript
interface PluginStateService {
  configure?(config: {
    pluginId: string;
    stateStrategy?: 'session' | 'persistent';
    preserveKeys?: string[];
    stateSchema?: any;
    maxStateSize?: number;
  }): void;
  saveState(stateData: any): Promise<void>;
  getState(): Promise<any>;
  clearState(): Promise<void>;
  validateState?(state: any): boolean;
  sanitizeState?(state: any): any;
  onSave?(callback: (state: any) => void) => () => void;
  onRestore?(callback: (state: any) => void) => () => void;
  onClear?(callback: () => void) => () => void;
}
```

#### Step 1: Configure on Component Mount

**REQUIRED**: Configure the service before any state operations:

```tsx
import { useEffect } from 'react';

const MyPlugin: React.FC<PluginProps> = ({ services }) => {
  // Configure PluginState service on mount
  useEffect(() => {
    if (!services.pluginState?.configure) return;

    try {
      services.pluginState.configure({
        pluginId: 'MyPlugin',                    // REQUIRED: Your plugin ID
        stateStrategy: 'session',                // 'session' or 'persistent'
        preserveKeys: ['userData', 'settings'],  // Keys to always preserve
        stateSchema: {                           // Validation schema
          userData: { type: 'object', required: false },
          settings: { type: 'object', required: false },
          counter: { type: 'number', default: 0 }
        },
        maxStateSize: 10240                      // 10KB limit
      });
      console.log('PluginState configured successfully');
    } catch (err) {
      console.error('Failed to configure PluginState:', err);
    }
  }, [services.pluginState]);

  // ... rest of component
};
```

**Configuration Options**:
- `pluginId` (required): Unique identifier for your plugin
- `stateStrategy`:
  - `'session'`: State cleared when browser session ends
  - `'persistent'`: State persists across browser sessions (default)
- `preserveKeys`: Array of keys that should never be cleared
- `stateSchema`: Validation schema for state structure
- `maxStateSize`: Maximum state size in bytes (default: 10KB)

#### Step 2: Using with Hooks

Once configured, use the `usePluginState` hook:

```tsx
import { usePluginState } from './hooks';

interface MyState {
  counter: number;
  userData: {
    name: string;
    preferences: string[];
  };
  lastUpdated: string;
}

const MyPlugin: React.FC<PluginProps> = ({ services }) => {
  const { state, saveState, clearState, isLoading, error } = usePluginState<MyState>(
    services.pluginState,
    errorHandler,
    true  // auto-load on mount
  );

  const handleSave = async () => {
    await saveState({
      counter: 42,
      userData: {
        name: 'John Doe',
        preferences: ['Dark Mode', 'Notifications']
      },
      lastUpdated: new Date().toISOString()
    });
  };

  const handleClear = async () => {
    await clearState();
  };

  if (isLoading) return <div>Loading state...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <pre>{JSON.stringify(state, null, 2)}</pre>
      <button onClick={handleSave} disabled={isLoading}>Save State</button>
      <button onClick={handleClear} disabled={isLoading}>Clear State</button>
    </div>
  );
};
```

#### Manual Implementation

```tsx
import { useState, useEffect } from 'react';

const MyPlugin: React.FC<PluginProps> = ({ services }) => {
  const [state, setState] = useState(null);

  // Configure on mount
  useEffect(() => {
    if (!services.pluginState?.configure) return;

    services.pluginState.configure({
      pluginId: 'MyPlugin',
      stateStrategy: 'persistent'
    });
  }, [services.pluginState]);

  // Save state
  const saveData = async () => {
    if (!services.pluginState) return;

    try {
      await services.pluginState.saveState({
        userId: 'user-123',
        settings: { theme: 'dark' },
        lastLogin: Date.now()
      });
      console.log('State saved');
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  // Load state
  const loadData = async () => {
    if (!services.pluginState) return;

    try {
      const savedState = await services.pluginState.getState();
      setState(savedState);
      console.log('State loaded:', savedState);
    } catch (error) {
      console.error('Load failed:', error);
    }
  };

  // Clear state
  const clearData = async () => {
    if (!services.pluginState) return;

    try {
      await services.pluginState.clearState();
      setState(null);
      console.log('State cleared');
    } catch (error) {
      console.error('Clear failed:', error);
    }
  };

  return <div>...</div>;
};
```

#### Event Subscriptions

Subscribe to state lifecycle events:

```tsx
useEffect(() => {
  if (!services.pluginState) return;

  const cleanupFns: Array<() => void> = [];

  // Listen for save events
  if (services.pluginState.onSave) {
    const unsubscribeSave = services.pluginState.onSave((savedState) => {
      console.log('State was saved:', savedState);
      showNotification('State saved successfully!');
    });
    cleanupFns.push(unsubscribeSave);
  }

  // Listen for restore events
  if (services.pluginState.onRestore) {
    const unsubscribeRestore = services.pluginState.onRestore((restoredState) => {
      console.log('State was restored:', restoredState);
      applyRestoredState(restoredState);
    });
    cleanupFns.push(unsubscribeRestore);
  }

  // Listen for clear events
  if (services.pluginState.onClear) {
    const unsubscribeClear = services.pluginState.onClear(() => {
      console.log('State was cleared');
      resetToDefaults();
    });
    cleanupFns.push(unsubscribeClear);
  }

  // Cleanup all subscriptions
  return () => {
    cleanupFns.forEach(fn => fn());
  };
}, [services.pluginState]);
```

**Key Points**:
- **MUST call configure() before any state operations** - This is the #1 cause of errors
- Configure in a `useEffect` on component mount
- Use `usePluginState` hook for automatic loading, saving, and cleanup
- Auto-save with debouncing: Delay saves by 1-2 seconds after last change
- Validate before saving: Use schemas to ensure state structure integrity
- Size limits: Keep state under 10KB for optimal performance
- Choose strategy wisely: Use `'session'` for temporary data, `'persistent'` for long-term
- Clear on logout: Consider clearing sensitive state when users log out
- Version your state: Include version numbers to handle schema migrations

**Common Errors**:
```
❌ Error: Plugin state service not configured. Call configure() first.
   → Solution: Add configure() call in useEffect on component mount

❌ TypeError: services.pluginState is undefined
   → Solution: Add 'pluginState' to required_services in module_data

❌ State size exceeds maxStateSize limit
   → Solution: Reduce state size or increase maxStateSize in configure()
```

---

## Best Practices

### 1. Always Check Service Availability

```tsx
if (!services.theme) {
  console.warn('Theme service not available');
  return null; // or show fallback UI
}
```

### 2. Always Cleanup Subscriptions

```tsx
useEffect(() => {
  if (!services.theme) return;

  const listener = (theme: string) => setTheme(theme);
  services.theme.addThemeChangeListener(listener);

  // CRITICAL: Cleanup
  return () => {
    services.theme?.removeThemeChangeListener(listener);
  };
}, [services.theme]);
```

### 3. Use Custom Hooks

Custom hooks encapsulate service logic and handle cleanup automatically:

```tsx
// Instead of manual implementation:
const { currentTheme } = useTheme(services.theme);

// Instead of:
const [theme, setTheme] = useState('light');
useEffect(() => { /* setup and cleanup */ }, [services.theme]);
```

### 4. Handle Errors Gracefully

```tsx
try {
  const data = await services.api.get('/endpoint');
} catch (error) {
  console.error('API request failed:', error);
  // Show user-friendly error message
  setError('Failed to load data. Please try again.');
}
```

### 5. Provide Default Values

```tsx
const { value = 60000 } = useSettings(services.settings, 'refresh_interval', 60000);
```

## Common Patterns

### Pattern 1: Loading Data on Mount

```tsx
const MyPlugin: React.FC<PluginProps> = ({ services }) => {
  const { get, data, loading, error } = useAPI(services.api);

  useEffect(() => {
    get('/api/my-data');
  }, []); // Empty deps - run once

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return <div>{JSON.stringify(data)}</div>;
};
```

### Pattern 2: Theme-Aware Components

```tsx
const MyPlugin: React.FC<PluginProps> = ({ services }) => {
  const { currentTheme } = useTheme(services.theme);

  return (
    <div className={`plugin ${currentTheme === 'dark' ? 'dark-theme' : ''}`}>
      {/* Component content */}
    </div>
  );
};
```

### Pattern 3: Settings with Form

```tsx
const MyPlugin: React.FC<PluginProps> = ({ services }) => {
  const { value, setValue, isLoading } = useSettings(
    services.settings,
    'my_setting',
    'default'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await setValue(value);
    if (success) {
      alert('Settings saved!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      <button disabled={isLoading}>Save</button>
    </form>
  );
};
```

## Troubleshooting

### Service is undefined

**Problem**: `services.theme` is `undefined`

**Solutions**:
1. Check that the service is declared in `lifecycle_manager.py` `required_services`
2. Verify the plugin is loaded correctly
3. Check browser console for service initialization errors
4. Ensure BrainDrive version supports the service

### Subscription not cleaning up

**Problem**: Memory leaks from event listeners

**Solution**: Always return cleanup function from useEffect:

```tsx
useEffect(() => {
  const listener = () => { /* ... */ };
  services.theme?.addThemeChangeListener(listener);

  return () => {
    services.theme?.removeThemeChangeListener(listener);
  };
}, [services.theme]);
```

### Infinite re-render loop

**Problem**: Component keeps re-rendering

**Solution**: Check useEffect dependency arrays:

```tsx
// ❌ Missing dependencies
useEffect(() => {
  fetchData();
}); // No dependency array - runs every render!

// ✅ Empty dependencies
useEffect(() => {
  fetchData();
}, []); // Runs once on mount

// ✅ Specific dependencies
useEffect(() => {
  if (pluginId) {
    fetchData(pluginId);
  }
}, [pluginId]); // Runs when pluginId changes
```

### Settings Service: "Setting definition not found"

**Problem**: `Error: Setting definition my_setting not found`

**Root Cause**: Setting not registered in `lifecycle_manager.py`

**Solution**:
1. Open `lifecycle_manager.py`
2. Find `self.plugin_data = { ... }`
3. Add or update `settingDefinitions` array:
```python
"settingDefinitions": [
    {
        "id": "my_setting",  # Must match key used in code
        "name": "My Setting",
        "description": "Setting description",
        "type": "string",    # boolean, string, number, object, array
        "default": "default_value",
        "category": "general",
        "scope": "user"
    }
]
```
4. Rebuild plugin: `npm run build`
5. Reinstall/update plugin in BrainDrive

**Verification**:
- Setting ID in code must exactly match `id` in `settingDefinitions`
- Check for typos in setting key
- Ensure plugin was reinstalled after adding definition

### PluginState Service: "not configured"

**Problem**: `Error: Plugin state service not configured. Call configure() first.`

**Root Cause**: Missing `configure()` call before using state methods

**Solution**:
```tsx
const MyPlugin: React.FC<PluginProps> = ({ services }) => {
  // Add this useEffect at top of component
  useEffect(() => {
    if (!services.pluginState?.configure) return;

    services.pluginState.configure({
      pluginId: 'MyPluginId',  // Use your actual plugin ID
      stateStrategy: 'persistent'
    });
  }, [services.pluginState]);

  // Now you can use state methods
  const { state, saveState } = usePluginState(services.pluginState);
  // ...
};
```

**Verification**:
- `configure()` is called in `useEffect` with `[services.pluginState]` dependency
- `configure()` is called BEFORE any `saveState()`, `getState()`, or `clearState()` calls
- Check browser console for configuration errors

### PluginState Service: State size limit exceeded

**Problem**: `Error: State size exceeds maxStateSize limit`

**Solutions**:
1. **Reduce state size**: Remove unnecessary data, use references instead of full objects
2. **Increase limit**: Adjust `maxStateSize` in configure (use sparingly):
```tsx
services.pluginState.configure({
  pluginId: 'MyPlugin',
  maxStateSize: 20480  // 20KB instead of default 10KB
});
```
3. **Split state**: Use multiple keys or external storage for large data

**Best Practice**: Keep plugin state under 10KB for optimal performance

### Settings vs PluginState: When to use which?

| Feature | Settings Service | PluginState Service |
|---------|-----------------|---------------------|
| **Purpose** | User preferences, config | Plugin runtime state |
| **Registration** | Must register in lifecycle_manager.py | Must configure() on mount |
| **Scope** | User or global | Plugin-scoped |
| **Size Limit** | No strict limit | 10KB default |
| **Persistence** | Always persistent | Session or persistent |
| **Use Cases** | Theme preference, notification settings, user options | Form data, UI state, temporary cache |

**Rule of Thumb**:
- Use **Settings** for user-configurable options that should appear in settings UI
- Use **PluginState** for internal plugin data that users don't directly configure

## Next Steps

- Read [THEMING.md](./THEMING.md) for styling guidelines
- Read [HOOKS_GUIDE.md](./HOOKS_GUIDE.md) for hooks best practices
- Review the main [README.md](../README.md) for setup instructions
