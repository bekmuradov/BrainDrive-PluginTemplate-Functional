# Theming in BrainDrive Plugins

## Overview

BrainDrive has a built-in theming system that supports dark and light modes. Your plugin should integrate with this system to provide a consistent user experience.

**IMPORTANT**: BrainDrive plugins do NOT use Tailwind CSS. You must use CSS custom properties (CSS variables) and standard CSS.

## Why No Tailwind?

1. **Bundle Size**: Tailwind would significantly increase plugin bundle size
2. **Conflicts**: Multiple plugins with different Tailwind versions would conflict
3. **Consistency**: Custom properties ensure consistent theming across all plugins
4. **Flexibility**: CSS variables allow dynamic theme switching without rebuilding

## BrainDrive Theme System

### CSS Custom Properties

Brain Drive provides theme-aware CSS custom properties that automatically update when the theme changes:

#### Colors

```css
/* Background colors */
--bg-primary: /* Main background color */
--bg-secondary: /* Secondary background */
--bg-tertiary: /* Tertiary background */
--bg-hover: /* Hover state background */
--bg-active: /* Active/selected state */

/* Text colors */
--text-primary: /* Primary text color */
--text-secondary: /* Secondary text color */
--text-tertiary: /* Muted/disabled text */
--text-link: /* Link text color */

/* Border colors */
--border-primary: /* Main border color */
--border-secondary: /* Secondary borders */
--border-focus: /* Focus state borders */

/* Status colors */
--color-success: /* Success state */
--color-error: /* Error state */
--color-warning: /* Warning state */
--color-info: /* Info state */

/* Component colors */
--button-primary-bg: /* Primary button background */
--button-primary-text: /* Primary button text */
--button-secondary-bg: /* Secondary button background */
--button-secondary-text: /* Secondary button text */

/* Shadows */
--shadow-sm: /* Small shadow */
--shadow-md: /* Medium shadow */
--shadow-lg: /* Large shadow */
```

#### Spacing

```css
--spacing-xs: 0.25rem;   /* 4px */
--spacing-sm: 0.5rem;    /* 8px */
--spacing-md: 1rem;      /* 16px */
--spacing-lg: 1.5rem;    /* 24px */
--spacing-xl: 2rem;      /* 32px */
--spacing-2xl: 3rem;     /* 48px */
```

#### Typography

```css
--font-family-sans: /* Sans-serif font stack */
--font-family-mono: /* Monospace font stack */

--font-size-xs: 0.75rem;    /* 12px */
--font-size-sm: 0.875rem;   /* 14px */
--font-size-base: 1rem;     /* 16px */
--font-size-lg: 1.125rem;   /* 18px */
--font-size-xl: 1.25rem;    /* 20px */
--font-size-2xl: 1.5rem;    /* 24px */
--font-size-3xl: 1.875rem;  /* 30px */

--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;

--line-height-tight: 1.25;
--line-height-normal: 1.5;
--line-height-relaxed: 1.75;
```

#### Border Radius

```css
--radius-sm: 0.25rem;  /* 4px */
--radius-md: 0.5rem;   /* 8px */
--radius-lg: 0.75rem;  /* 12px */
--radius-xl: 1rem;     /* 16px */
--radius-full: 9999px; /* Fully rounded */
```

## Using the Theme Service

### With Hooks (Recommended)

```tsx
import { useTheme } from './hooks';

const MyPlugin: React.FC<PluginProps> = ({ services }) => {
  const { currentTheme, toggleTheme } = useTheme(services.theme);

  return (
    <div className={`my-plugin ${currentTheme === 'dark' ? 'dark-theme' : ''}`}>
      <h3>Current Theme: {currentTheme}</h3>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};
```

### Manual Implementation

```tsx
import { useState, useEffect, useRef } from 'react';

const MyPlugin: React.FC<PluginProps> = ({ services }) => {
  const [theme, setTheme] = useState('light');
  const listenerRef = useRef<((theme: string) => void) | null>(null);

  useEffect(() => {
    if (!services.theme) return;

    // Get initial theme
    setTheme(services.theme.getCurrentTheme());

    // Subscribe to theme changes
    listenerRef.current = (newTheme: string) => setTheme(newTheme);
    services.theme.addThemeChangeListener(listenerRef.current);

    // Cleanup
    return () => {
      if (services.theme && listenerRef.current) {
        services.theme.removeThemeChangeListener(listenerRef.current);
      }
    };
  }, [services.theme]);

  return <div className={theme === 'dark' ? 'dark' : 'light'}>...</div>;
};
```

## Styling Your Plugin

### Basic Pattern

1. **Add theme class to root element**
2. **Use CSS custom properties**
3. **Define theme-specific overrides if needed**

#### Example Component

```tsx
const MyPlugin: React.FC<PluginProps> = ({ services }) => {
  const { currentTheme } = useTheme(services.theme);

  return (
    <div className={`my-plugin ${currentTheme === 'dark' ? 'dark-theme' : ''}`}>
      <div className="card">
        <h3 className="title">My Plugin</h3>
        <p className="description">This is theme-aware!</p>
        <button className="btn-primary">Click Me</button>
      </div>
    </div>
  );
};
```

#### Corresponding CSS

```css
/* MyPlugin.css */

.my-plugin {
  /* Use CSS custom properties */
  background-color: var(--bg-primary);
  color: var(--text-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  font-family: var(--font-family-sans);
}

.card {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}

.title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.description {
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  line-height: var(--line-height-normal);
}

.btn-primary {
  background-color: var(--button-primary-bg);
  color: var(--button-primary-text);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  border: none;
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-primary:hover {
  opacity: 0.9;
}

/* Optional: Theme-specific overrides */
.my-plugin.dark-theme {
  /* Add dark mode specific styles if needed */
  /* Usually not necessary if using CSS variables correctly */
}
```

### Advanced: Custom Colors

If you need plugin-specific colors that still respect the theme:

```css
.my-plugin {
  /* Define your colors as custom properties */
  --plugin-accent: #3b82f6; /* Blue */
  --plugin-accent-hover: #2563eb;
}

.my-plugin.dark-theme {
  /* Adjust for dark mode */
  --plugin-accent: #60a5fa; /* Lighter blue for dark mode */
  --plugin-accent-hover: #3b82f6;
}

.accent-button {
  background-color: var(--plugin-accent);
  color: white;
}

.accent-button:hover {
  background-color: var(--plugin-accent-hover);
}
```

## Complete Example

### Component

```tsx
import React from 'react';
import { useTheme } from './hooks';
import './ThemeAwarePlugin.css';

interface ThemeAwarePluginProps {
  services: Services;
  title?: string;
}

const ThemeAwarePlugin: React.FC<ThemeAwarePluginProps> = ({
  services,
  title = "Theme-Aware Plugin"
}) => {
  const { currentTheme, toggleTheme } = useTheme(services.theme);

  return (
    <div className={`theme-aware-plugin ${currentTheme === 'dark' ? 'dark-theme' : ''}`}>
      <header className="plugin-header">
        <h2 className="plugin-title">{title}</h2>
        <button className="theme-toggle" onClick={toggleTheme}>
          {currentTheme === 'dark' ? '☀️' : '🌙'}
        </button>
      </header>

      <div className="plugin-content">
        <div className="info-card">
          <h3 className="card-title">Current Theme</h3>
          <p className="card-text">{currentTheme}</p>
        </div>

        <div className="button-group">
          <button className="btn btn-primary">Primary</button>
          <button className="btn btn-secondary">Secondary</button>
          <button className="btn btn-success">Success</button>
          <button className="btn btn-error">Error</button>
        </div>
      </div>
    </div>
  );
};

export default ThemeAwarePlugin;
```

### CSS

```css
/* ThemeAwarePlugin.css */

.theme-aware-plugin {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  min-height: 300px;
  font-family: var(--font-family-sans);
}

/* Header */
.plugin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--border-primary);
}

.plugin-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin: 0;
}

.theme-toggle {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-lg);
  cursor: pointer;
  transition: all 0.2s;
}

.theme-toggle:hover {
  background-color: var(--bg-hover);
}

/* Content */
.plugin-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.info-card {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-sm);
}

.card-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-sm) 0;
}

.card-text {
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  margin: 0;
}

/* Buttons */
.button-group {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  border: none;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
}

.btn:hover {
  opacity: 0.9;
}

.btn:active {
  transform: scale(0.98);
}

.btn-primary {
  background-color: var(--button-primary-bg);
  color: var(--button-primary-text);
}

.btn-secondary {
  background-color: var(--button-secondary-bg);
  color: var(--button-secondary-text);
}

.btn-success {
  background-color: var(--color-success);
  color: white;
}

.btn-error {
  background-color: var(--color-error);
  color: white;
}

/* Dark mode specific adjustments (if needed) */
.theme-aware-plugin.dark-theme {
  /* Most styling is handled by CSS variables automatically */
  /* Add specific overrides only if absolutely necessary */
}
```

## Best Practices

### ✅ DO

1. **Use CSS custom properties** for all colors, spacing, and typography
2. **Add theme class** to your plugin's root element
3. **Subscribe to theme changes** using the Theme Service
4. **Test both themes** during development
5. **Use semantic class names** (e.g., `.card-title` not `.text-blue-500`)
6. **Provide smooth transitions** for better UX

### ❌ DON'T

1. **Don't use Tailwind CSS** - it's not supported
2. **Don't hardcode colors** - use CSS variables
3. **Don't forget to cleanup** theme listeners
4. **Don't assume the theme** - always check current theme
5. **Don't use inline styles** for theme-dependent values
6. **Don't forget accessibility** - ensure sufficient contrast

## Accessibility

### Color Contrast

Always ensure sufficient contrast between text and background:

```css
/* Good - uses theme variables that ensure contrast */
.text {
  color: var(--text-primary);
  background-color: var(--bg-primary);
}

/* Bad - might not have sufficient contrast */
.text {
  color: #666;
  background-color: #888;
}
```

### Focus States

Always provide visible focus states:

```css
.btn:focus {
  outline: 2px solid var(--border-focus);
  outline-offset: 2px;
}

.input:focus {
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px var(--border-focus-shadow);
}
```

## Testing Your Theme

### Manual Testing

1. Load your plugin in BrainDrive
2. Toggle between dark and light modes
3. Verify all colors update correctly
4. Check that text is readable in both themes
5. Test hover and focus states
6. Verify borders and shadows are visible

### Automated Testing

```tsx
import { render } from '@testing-library/react';

describe('ThemeAwarePlugin', () => {
  it('applies dark theme class when theme is dark', () => {
    const mockServices = {
      theme: {
        getCurrentTheme: () => 'dark',
        addThemeChangeListener: jest.fn(),
        removeThemeChangeListener: jest.fn()
      }
    };

    const { container } = render(
      <ThemeAwarePlugin services={mockServices} />
    );

    expect(container.firstChild).toHaveClass('dark-theme');
  });
});
```

## Common Issues

### Issue: Colors don't update when theme changes

**Solution**: Ensure you're subscribed to theme changes:

```tsx
const { currentTheme } = useTheme(services.theme); // ✅ Correct
const theme = services.theme?.getCurrentTheme(); // ❌ Only gets initial value
```

### Issue: Colors look wrong in one theme

**Solution**: Use CSS variables instead of hardcoded colors:

```css
/* ❌ Wrong */
.card {
  background-color: #ffffff;
  color: #000000;
}

/* ✅ Correct */
.card {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}
```

### Issue: Text is unreadable

**Solution**: Use appropriate text color variables:

```css
/* For primary content */
color: var(--text-primary);

/* For secondary/muted content */
color: var(--text-secondary);

/* For disabled/tertiary content */
color: var(--text-tertiary);
```

## Resources

- [Service Bridges Documentation](./SERVICE_BRIDGES.md) - Using the Theme Service
- [Hooks Guide](./HOOKS_GUIDE.md) - React hooks best practices
- [CSS Variables MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Accessible Colors](https://webaim.org/resources/contrastchecker/)

## Next Steps

- Implement theme support in your plugin
- Test with both dark and light modes
- Ensure accessibility standards are met
- Review [SERVICE_BRIDGES.md](./SERVICE_BRIDGES.md) for other services
