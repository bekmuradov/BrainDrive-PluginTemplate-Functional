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

#### Using with Hooks

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
- Settings are async operations - use `async/await`
- Settings persist across sessions
- Use meaningful, namespaced keys (e.g., `my_plugin_theme_preference`)
- Handle errors gracefully
- Provide default values

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

## Next Steps

- Read [THEMING.md](./THEMING.md) for styling guidelines
- Read [HOOKS_GUIDE.md](./HOOKS_GUIDE.md) for hooks best practices
- Check [examples](../src/examples/) for complete implementations
- Review the main [README.md](../README.md) for setup instructions
