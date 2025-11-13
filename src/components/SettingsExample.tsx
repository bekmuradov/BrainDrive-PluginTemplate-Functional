import React, { useState, useEffect } from 'react';
import { Services } from '../types';
import { useTheme } from '../hooks';
import './SettingsExample.css';

interface SettingsExampleProps {
  pluginId?: string;
  moduleId?: string;
  instanceId?: string;
  services?: Services;
}

/**
 * SettingsExample Component (Functional with Hooks)
 *
 * This is a simple template for creating settings plugins in BrainDrive.
 * It demonstrates:
 * - Functional component with React Hooks
 * - Using custom hooks for service integration
 * - Theme awareness with useTheme hook
 * - Access to the settings service
 * - Clean, minimal UI following BrainDrive patterns
 *
 * Use this as a starting point for your own settings plugins.
 *
 * CONVERSION NOTES:
 * - Class state → useState hooks
 * - componentDidMount → useEffect(() => {}, [])
 * - componentWillUnmount → useEffect cleanup
 * - Instance variables → useRef (not needed here)
 * - this.props → direct destructuring from props parameter
 */
const SettingsExample: React.FC<SettingsExampleProps> = ({
  pluginId,
  moduleId,
  instanceId,
  services
}) => {
  // STATE MANAGEMENT
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // USE CUSTOM HOOKS
  // The useTheme hook handles all theme service integration automatically
  const { currentTheme } = useTheme(services?.theme);

  // LIFECYCLE: Component Mount
  // Equivalent to componentDidMount
  useEffect(() => {
    console.log('SettingsExample: Component mounted');
    console.log('SettingsExample props received:', {
      pluginId,
      moduleId,
      instanceId,
      hasServices: !!services,
      hasThemeService: services?.theme ? 'YES' : 'NO',
      hasSettingsService: services?.settings ? 'YES' : 'NO',
      hasApiService: services?.api ? 'YES' : 'NO'
    });

    // Validate services availability
    if (!services) {
      setError('Services not available');
    } else if (!services.theme) {
      setError('Theme service not available');
    }

    // Cleanup function (componentWillUnmount equivalent)
    // Note: useTheme hook handles theme listener cleanup automatically
    return () => {
      console.log('SettingsExample: Component unmounting');
    };
  }, [services, pluginId, moduleId, instanceId]);

  // RENDER
  return (
    <div className={`settings-example-container ${currentTheme === 'dark' ? 'dark-theme' : ''}`}>

      {/* Error message */}
      {error && (
        <div className="error-message">
          <strong>Error: </strong>{error}
        </div>
      )}

      {/* Main content */}
      <div className="settings-content">

        {/* Header */}
        <div className="settings-header">
          <h2>This is the Settings Plugin Template (Functional)!</h2>
          <p>A functional component template for creating BrainDrive settings plugins with React Hooks.</p>
        </div>

        {/* Plugin info */}
        <div className="plugin-info">
          <h3>Plugin Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <strong>Plugin ID:</strong> {pluginId || 'Not provided'}
            </div>
            <div className="info-item">
              <strong>Module ID:</strong> {moduleId || 'Not provided'}
            </div>
            <div className="info-item">
              <strong>Instance ID:</strong> {instanceId || 'Not provided'}
            </div>
            <div className="info-item">
              <strong>Current Theme:</strong> {currentTheme}
            </div>
            <div className="info-item">
              <strong>Services Available:</strong>
              <ul>
                <li>Theme: {services?.theme ? '✅' : '❌'}</li>
                <li>Settings: {services?.settings ? '✅' : '❌'}</li>
                <li>API: {services?.api ? '✅' : '❌'}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Hooks Example */}
        <div className="plugin-info">
          <h3>Using Custom Hooks</h3>
          <div className="info-grid">
            <div className="info-item">
              <strong>Theme Management:</strong>
              <p>This component uses the <code>useTheme</code> custom hook to automatically subscribe to theme changes.</p>
              <p>The hook handles:</p>
              <ul>
                <li>Getting initial theme</li>
                <li>Subscribing to theme changes</li>
                <li>Cleanup on unmount</li>
              </ul>
            </div>
            <div className="info-item">
              <strong>Benefits of Hooks:</strong>
              <ul>
                <li>Less boilerplate code</li>
                <li>Automatic cleanup</li>
                <li>Reusable logic</li>
                <li>Better composition</li>
                <li>Easier to test</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsExample;
