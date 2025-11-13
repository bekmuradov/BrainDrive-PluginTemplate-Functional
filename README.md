# BrainDrive Functional Component Plugin Template

**Modern React Hooks template for BrainDrive plugin development**

This is the functional component template for [BrainDrive](https://github.com/BrainDriveAI/BrainDrive) plugins, featuring:

- ✅ **React Hooks** - Modern functional components with useState, useEffect, useCallback
- ✅ **Custom Hooks** - Reusable hooks for service integration (useTheme, useSettings, useAPI, etc.)
- ✅ **Proper Webpack Config** - Uses `externals` pattern to prevent React duplication
- ✅ **Comprehensive Error Handling** - ErrorBoundary + custom error management hooks
- ✅ **Service Bridges** - Full integration with BrainDrive services
- ✅ **TypeScript** - Complete type safety
- ✅ **Extensive Documentation** - Guides for hooks, services, and theming

## Quick Start

### 1. Copy the Template

```bash
cp -r BrainDrive-PluginTemplate-Functional my-plugin
cd my-plugin
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Customize Plugin Metadata

Update these files with your plugin information:

#### `webpack.config.js`
```javascript
const PLUGIN_NAME = "MyPlugin";  // Your plugin name
const PLUGIN_MODULE_NAME = "MyPluginModule";  // Module name
const PLUGIN_PORT = 3005;  // Available port
```

#### `lifecycle_manager.py`
```python
self.plugin_data = {
    "name": "MyPlugin",
    "description": "My awesome plugin",
    "version": "1.0.0",
    # ... update other fields
}

self.module_data = [
    {
        "name": "MyPluginModule",  # Must match webpack
        # ... update module config
    }
]
```

#### `package.json`
```json
{
  "name": "my-plugin",
  "description": "My awesome BrainDrive plugin",
  "version": "1.0.0"
}
```

### 4. Build Your Plugin

```bash
npm run build
```

### 5. Development Mode

```bash
npm run dev
# or
npm start
```

## Project Structure

```
BrainDrive-PluginTemplate-Functional/
├── src/
│   ├── components/          # React components
│   │   ├── ErrorBoundary.tsx   # Error boundary (class component)
│   │   ├── ErrorDisplay.tsx    # Error display component
│   │   ├── LoadingSpinner.tsx  # Loading state component
│   │   ├── SettingsExample.tsx # Settings component example
│   │   └── index.ts            # Component exports
│   ├── hooks/               # Custom React hooks
│   │   ├── useTheme.ts         # Theme service hook
│   │   ├── usePageContext.ts   # Page context hook
│   │   ├── useSettings.ts      # Settings service hook
│   │   ├── useAPI.ts           # API service hook
│   │   ├── useErrorHandler.ts  # Error handling hook
│   │   └── index.ts            # Hook exports
│   ├── services/            # Business logic
│   │   ├── PluginService.ts    # Plugin service example
│   │   └── index.ts            # Service exports
│   ├── utils/               # Utility functions
│   │   ├── errorHandling.ts    # Error handling utilities
│   │   └── utils.ts            # General utilities
│   ├── types.ts             # TypeScript definitions
│   ├── PluginTemplateFunctional.tsx  # Main component
│   ├── PluginTemplateFunctional.css  # Styles
│   └── index.tsx            # Entry point
├── docs/                    # Documentation
│   ├── SERVICE_BRIDGES.md     # Service integration guide
│   ├── THEMING.md             # Styling and theme guide
│   └── HOOKS_GUIDE.md         # React hooks best practices
├── public/                  # Static assets
│   └── index.html             # Dev HTML template
├── references/              # Reference documentation
│   └── ...                    # Lifecycle manager refs
├── webpack.config.js        # Webpack configuration
├── tsconfig.json            # TypeScript configuration
├── lifecycle_manager.py     # Plugin lifecycle manager
└── package.json             # NPM configuration
```

## Key Features

### 1. Modern React Hooks

The template uses functional components with hooks instead of class components:

```tsx
// Class component (old way)
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }
  componentDidMount() { /* ... */ }
  componentWillUnmount() { /* ... */ }
}

// Functional component with hooks (new way)
const MyComponent: React.FC<Props> = (props) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // componentDidMount logic
    return () => {
      // componentWillUnmount logic
    };
  }, []);
};
```

### 2. Custom Hooks for Services

Reusable hooks encapsulate service integration logic:

```tsx
import { useTheme, useSettings, useAPI } from './hooks';

const MyPlugin: React.FC<PluginProps> = ({ services }) => {
  // Theme integration with automatic cleanup
  const { currentTheme, toggleTheme } = useTheme(services.theme);

  // Settings with loading states
  const { value, setValue, isLoading } = useSettings(
    services.settings,
    'my_setting',
    'default'
  );

  // API calls with error handling
  const { get, data, loading, error } = useAPI(services.api);

  useEffect(() => {
    get('/api/my-data');
  }, []);

  return <div className={currentTheme === 'dark' ? 'dark' : 'light'}>...</div>;
};
```

### 3. Critical Webpack Configuration

**IMPORTANT**: This template uses the `externals` pattern instead of Module Federation's `shared` config:

```javascript
// webpack.config.js
module.exports = {
  // ...
  externals: {
    'react': 'React',  // Uses window.React from host
  },
  plugins: [
    new ModuleFederationPlugin({
      // NO 'shared' configuration!
      // This prevents React duplication
    })
  ]
};
```

**Why?** BrainDrive exposes `window.React` for plugins. Using `externals` tells webpack to use that instead of bundling React, which prevents the "Invalid hook call" error.

### 4. Comprehensive Error Handling

```tsx
import { useErrorHandler } from './hooks';

const MyComponent: React.FC = () => {
  const {
    error,
    handleError,
    handleRetry,
    safeAsync
  } = useErrorHandler();

  const fetchData = async () => {
    await safeAsync(async () => {
      const response = await fetch('/api/data');
      return response.json();
    }, ErrorStrategy.RETRY);
  };

  if (error) {
    return (
      <ErrorDisplay
        error={error}
        onRetry={handleRetry}
      />
    );
  }
};
```

## Documentation

### Essential Guides

1. **[SERVICE_BRIDGES.md](docs/SERVICE_BRIDGES.md)** - Complete guide to BrainDrive services
   - Theme Service
   - Page Context Service
   - Settings Service
   - API Service
   - Event Service
   - Usage examples and best practices

2. **[THEMING.md](docs/THEMING.md)** - Styling and theme integration
   - CSS custom properties (NO Tailwind!)
   - Dark/light mode support
   - Theme-aware components
   - Accessibility guidelines

3. **[HOOKS_GUIDE.md](docs/HOOKS_GUIDE.md)** - React hooks best practices
   - useState, useEffect, useRef, useCallback, useMemo
   - Custom hooks
   - Common patterns
   - Performance optimization
   - Common pitfalls

### Reference Documentation

- **[Lifecycle Manager Guide](references/LIFECYCLE_MANAGER_CUSTOMIZATION_GUIDE.md)** - Plugin lifecycle customization
- **[Plugin Data Reference](references/Plugin-Data-Field-Reference.md)** - Plugin metadata fields
- **[Module Data Reference](references/Module-Data-Field-Reference.md)** - Module configuration

## Conversion from Class Components

If you're converting from the class-based template, here are the key patterns:

### State Management
```tsx
// Class
this.state = { count: 0 }
this.setState({ count: 1 })

// Hooks
const [count, setCount] = useState(0)
setCount(1)
```

### Lifecycle Methods
```tsx
// Class
componentDidMount() { /* init */ }
componentWillUnmount() { /* cleanup */ }

// Hooks
useEffect(() => {
  // init
  return () => {
    // cleanup
  };
}, []);
```

### Instance Variables
```tsx
// Class
this.retryCount = 0

// Hooks
const retryCountRef = useRef(0)
retryCountRef.current = 1
```

### Methods
```tsx
// Class
handleClick() { /* ... */ }

// Hooks
const handleClick = useCallback(() => {
  /* ... */
}, [deps]);
```

## Common Tasks

### Adding a New Service

1. Create a custom hook in `src/hooks/`:

```tsx
// useMyService.ts
import { useState, useEffect } from 'react';

export function useMyService(service?: MyService) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!service) return;

    // Setup service
    const fetchData = async () => {
      const result = await service.getData();
      setData(result);
    };

    fetchData();

    // Cleanup
    return () => {
      // Cleanup logic
    };
  }, [service]);

  return { data };
}
```

2. Export from `src/hooks/index.ts`
3. Use in your component:

```tsx
import { useMyService } from './hooks';

const MyComponent: React.FC<Props> = ({ services }) => {
  const { data } = useMyService(services.myService);
  return <div>{JSON.stringify(data)}</div>;
};
```

### Fetching Data on Mount

```tsx
import { useEffect } from 'react';
import { useAPI } from './hooks';

const DataComponent: React.FC<Props> = ({ services }) => {
  const { get, data, loading, error } = useAPI(services.api);

  useEffect(() => {
    get('/api/my-endpoint');
  }, []); // Empty deps = run once

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;
  return <div>{JSON.stringify(data)}</div>;
};
```

### Saving Settings

```tsx
import { useSettings } from './hooks';

const SettingsComponent: React.FC<Props> = ({ services }) => {
  const {
    value: interval,
    setValue: setInterval,
    isLoading
  } = useSettings(services.settings, 'refresh_interval', 60000);

  return (
    <div>
      <input
        type="number"
        value={interval}
        onChange={(e) => setInterval(parseInt(e.target.value))}
        disabled={isLoading}
      />
    </div>
  );
};
```

## Troubleshooting

### "Invalid hook call" Error

**Cause**: Multiple instances of React (bundled React + host React)

**Solution**: Verify your webpack config uses `externals` not `shared`:

```javascript
// ✅ Correct
externals: {
  'react': 'React'
}

// ❌ Wrong
shared: {
  react: { singleton: true, eager: true }
}
```

### Service is Undefined

**Cause**: Service not declared in `lifecycle_manager.py`

**Solution**: Add service to `required_services` in module_data:

```python
"required_services": {
    "theme": {"methods": ["getCurrentTheme", "addThemeChangeListener"], "version": "1.0.0"},
    # ... other services
}
```

### Infinite Re-render Loop

**Cause**: Missing or incorrect useEffect dependency array

**Solution**: Add all dependencies used inside useEffect:

```tsx
// ❌ Wrong - missing dependencies
useEffect(() => {
  fetchData(userId);
}); // No dependency array

// ✅ Correct
useEffect(() => {
  fetchData(userId);
}, [userId]); // Include all dependencies
```

### Memory Leaks

**Cause**: Not cleaning up subscriptions

**Solution**: Always return cleanup function from useEffect:

```tsx
useEffect(() => {
  const listener = () => { /* ... */ };
  service.addEventListener(listener);

  // Cleanup
  return () => {
    service.removeEventListener(listener);
  };
}, [service]);
```

## Best Practices

1. ✅ **Use custom hooks** for service integration
2. ✅ **Always cleanup** subscriptions in useEffect
3. ✅ **Check service availability** before use
4. ✅ **Use functional updates** for state that depends on previous state
5. ✅ **Memoize callbacks** passed to child components
6. ✅ **Use CSS variables** for theming (NO Tailwind)
7. ✅ **Handle errors gracefully** with try/catch and error boundaries
8. ✅ **Test both themes** (dark and light)

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## Building for Production

```bash
npm run build
```

Output will be in `dist/remoteEntry.js`

## Need Help?

- 📖 [BrainDrive Documentation](https://docs.braindrive.ai)
- 💬 [Community Forum](https://community.braindrive.ai)
- 🐛 [Report Issues](https://github.com/BrainDriveAI/BrainDrive/issues)

## License

[MIT Licensed](LICENSE) - BrainDrive is built for your ownership & freedom. Your AI. Your Rules.

---

**Happy Plugin Development! 🚀**
