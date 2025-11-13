import React from 'react';
import { Services } from '../../../types';
import { useTheme } from '../../../hooks';
import CodeExample from '../CodeExample';
import TryItButton from '../TryItButton';
import ResultDisplay from '../ResultDisplay';
import { ErrorHandler } from '../../../utils/errorHandling';
import './ThemeServiceTab.css';

interface ThemeServiceTabProps {
  services: Services;
  errorHandler: ErrorHandler;
}

/**
 * ThemeServiceTab Component
 *
 * Demonstrates theme service integration with interactive examples.
 * Shows how to make plugins theme-aware and responsive to theme changes.
 */
export const ThemeServiceTab: React.FC<ThemeServiceTabProps> = ({ services, errorHandler }) => {
  const { currentTheme, setTheme, toggleTheme, isAvailable } = useTheme(services.theme, errorHandler);

  if (!isAvailable) {
    return (
      <div className="theme-service-tab">
        <div className="service-unavailable">
          <h3>⚠️ Theme Service Unavailable</h3>
          <p>The theme service is not available in this environment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="theme-service-tab">
      {/* Introduction */}
      <div className="showcase-intro">
        <h2>🎨 Theme Service - Make Your Plugin Theme-Aware</h2>
        <p>
          The Theme Service allows your plugin to adapt to BrainDrive's theme system.
          Support both dark and light modes automatically, and respond to theme changes in real-time.
        </p>
      </div>

      {/* Example 1: Current Theme Display */}
      <div className="showcase-example">
        <h3>Example 1: Get Current Theme</h3>
        <p>Display the current theme and update automatically when it changes.</p>

        <div className="demo-section">
          <div className="theme-indicator">
            <div className={`theme-preview theme-preview-${currentTheme}`}>
              <span className="theme-icon">{currentTheme === 'dark' ? '🌙' : '☀️'}</span>
              <span className="theme-name">Current Theme: <strong>{currentTheme}</strong></span>
            </div>
          </div>

          <ResultDisplay
            title="Theme State"
            data={{ currentTheme, isAvailable }}
            variant="info"
          />
        </div>

        <CodeExample
          title="Using the useTheme hook"
          code={`
import { useTheme } from './hooks';

const MyPlugin: React.FC<PluginProps> = ({ services }) => {
  const { currentTheme, isAvailable } = useTheme(services.theme);

  return (
    <div>
      <p>Current theme: {currentTheme}</p>
      <p>Service available: {isAvailable ? 'Yes' : 'No'}</p>
    </div>
  );
};
          `}
        />
      </div>

      {/* Example 2: Toggle Theme */}
      <div className="showcase-example">
        <h3>Example 2: Toggle Theme</h3>
        <p>Switch between dark and light modes programmatically.</p>

        <div className="demo-section">
          <div className="button-group">
            <TryItButton
              onClick={toggleTheme}
              label="Toggle Theme"
              icon="🔄"
              variant="primary"
            />
            <TryItButton
              onClick={() => setTheme('light')}
              label="Set Light"
              icon="☀️"
              variant="secondary"
            />
            <TryItButton
              onClick={() => setTheme('dark')}
              label="Set Dark"
              icon="🌙"
              variant="secondary"
            />
          </div>

          <p className="demo-hint">
            💡 <strong>Try it:</strong> Click the buttons above to change the theme.
            Watch how the entire plugin adapts instantly!
          </p>
        </div>

        <CodeExample
          title="Toggle and set theme"
          code={`
const { toggleTheme, setTheme } = useTheme(services.theme);

// Toggle between dark and light
<button onClick={toggleTheme}>Toggle Theme</button>

// Set specific theme
<button onClick={() => setTheme('light')}>Light Mode</button>
<button onClick={() => setTheme('dark')}>Dark Mode</button>
          `}
        />
      </div>

      {/* Example 3: Theme-Aware Styling */}
      <div className="showcase-example">
        <h3>Example 3: Theme-Aware Components</h3>
        <p>Create components that adapt their styling based on the current theme.</p>

        <div className="demo-section">
          <div className="theme-aware-demo">
            <div className={`demo-card ${currentTheme === 'dark' ? 'dark-theme' : ''}`}>
              <h4>Theme-Aware Card</h4>
              <p>This card adapts to the current theme automatically.</p>
              <div className="demo-card-footer">
                <span className="demo-badge">Dynamic</span>
                <span className="demo-badge">Adaptive</span>
              </div>
            </div>

            <div className="demo-card demo-card-static">
              <h4>Static Card</h4>
              <p>This card has fixed colors and doesn't adapt.</p>
              <div className="demo-card-footer">
                <span className="demo-badge">Static</span>
                <span className="demo-badge">Fixed</span>
              </div>
            </div>
          </div>
        </div>

        <CodeExample
          title="Apply theme to components"
          code={`
const { currentTheme } = useTheme(services.theme);

return (
  <div className={\`my-component \${currentTheme === 'dark' ? 'dark-theme' : ''}\`}>
    {/* Component content */}
  </div>
);

// Or use CSS custom properties
// These automatically update when theme changes:
.my-component {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  border-color: var(--border-color);
}
          `}
        />
      </div>

      {/* Example 4: CSS Custom Properties */}
      <div className="showcase-example">
        <h3>Example 4: Using CSS Custom Properties</h3>
        <p>
          BrainDrive provides CSS custom properties that automatically update with theme changes.
          This is the recommended approach for theme-aware styling.
        </p>

        <div className="demo-section">
          <div className="css-vars-showcase">
            <div className="css-var-card" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
              <code>--bg-primary</code>
              <p>Background color</p>
            </div>
            <div className="css-var-card" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
              <code>--bg-secondary</code>
              <p>Secondary background</p>
            </div>
            <div className="css-var-card" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', borderLeft: '4px solid var(--accent-color)' }}>
              <code>--accent-color</code>
              <p>Accent/brand color</p>
            </div>
            <div className="css-var-card" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-secondary)' }}>
              <code>--text-secondary</code>
              <p>Muted text color</p>
            </div>
          </div>
        </div>

        <CodeExample
          title="CSS custom properties (recommended)"
          code={`
/* In your CSS file */
.my-component {
  /* Colors */
  background-color: var(--bg-primary);
  color: var(--text-primary);
  border-color: var(--border-color);

  /* Text colors */
  /* --text-primary for main text */
  /* --text-secondary for muted text */

  /* Accents */
  /* --accent-color for brand color */
  /* --success-color, --danger-color, etc. */
}

/* No JavaScript needed! */
/* Variables automatically update when theme changes */
          `}
        />
      </div>

      {/* Manual Implementation */}
      <div className="showcase-example">
        <h3>Advanced: Manual Theme Listener (Without Hook)</h3>
        <p>
          If you need more control, you can manually subscribe to theme changes.
          The hook handles this automatically, but here's how it works under the hood.
        </p>

        <CodeExample
          title="Manual theme subscription"
          code={`
import { useState, useEffect, useRef } from 'react';

const MyPlugin: React.FC<PluginProps> = ({ services }) => {
  const [theme, setTheme] = useState('light');
  const listenerRef = useRef<((theme: string) => void) | null>(null);

  useEffect(() => {
    if (!services.theme) return;

    // Get initial theme
    const currentTheme = services.theme.getCurrentTheme();
    setTheme(currentTheme);

    // Create listener
    listenerRef.current = (newTheme: string) => {
      setTheme(newTheme);
      console.log('Theme changed to:', newTheme);
    };

    // Subscribe to changes
    services.theme.addThemeChangeListener(listenerRef.current);

    // Cleanup on unmount
    return () => {
      if (listenerRef.current) {
        services.theme?.removeThemeChangeListener(listenerRef.current);
      }
    };
  }, [services.theme]);

  return <div>Current theme: {theme}</div>;
};
          `}
        />
      </div>

      {/* Best Practices */}
      <div className="showcase-tips">
        <h3>💡 Best Practices</h3>
        <ul>
          <li>
            <strong>Use the hook:</strong> <code>useTheme</code> handles subscriptions and cleanup automatically
          </li>
          <li>
            <strong>CSS variables:</strong> Prefer CSS custom properties over inline styles for better performance
          </li>
          <li>
            <strong>Always check availability:</strong> Check <code>isAvailable</code> before using theme methods
          </li>
          <li>
            <strong>Apply theme class:</strong> Add <code>dark-theme</code> class to your root element for conditional styling
          </li>
          <li>
            <strong>Test both themes:</strong> Always test your plugin in both light and dark modes
          </li>
          <li>
            <strong>Avoid hardcoded colors:</strong> Use CSS variables instead of hex/rgb values
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ThemeServiceTab;
