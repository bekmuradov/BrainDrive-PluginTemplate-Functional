import React, { useState, useEffect } from 'react';
import { Services } from '../../../types';
import { usePluginState } from '../../../hooks';
import CodeExample from '../CodeExample';
import TryItButton from '../TryItButton';
import ResultDisplay from '../ResultDisplay';
import { ErrorHandler } from '../../../utils/errorHandling';
import './PluginStateServiceTab.css';

interface PluginStateServiceTabProps {
  services: Services;
  errorHandler: ErrorHandler;
}

interface DemoState {
  counter: number;
  lastUpdated: string;
  userData: {
    name: string;
    preferences: string[];
  };
  sessionId: string;
}

/**
 * PluginStateServiceTab Component
 *
 * Demonstrates the PluginState service with interactive examples.
 * Shows how to persist plugin data across sessions with save, restore, and clear operations.
 */
export const PluginStateServiceTab: React.FC<PluginStateServiceTabProps> = ({ services, errorHandler }) => {
  // Configure the plugin state service on mount
  useEffect(() => {
    if (!services.pluginState?.configure) return;

    try {
      services.pluginState.configure({
        pluginId: 'PluginTemplateFunctional',
        stateStrategy: 'session', // 'session' or 'persistent'
        preserveKeys: ['counter', 'userData', 'lastUpdated', 'sessionId'],
        stateSchema: {
          counter: { type: 'number', required: false, default: 0 },
          lastUpdated: { type: 'string', required: false },
          userData: { type: 'object', required: false },
          sessionId: { type: 'string', required: false }
        },
        maxStateSize: 10240 // 10KB limit
      });
      console.log('PluginState service configured successfully');
    } catch (err) {
      console.error('Failed to configure PluginState service:', err);
    }
  }, [services.pluginState]);

  const { state, saveState, clearState, isLoading, error, isAvailable } = usePluginState<DemoState>(
    services.pluginState,
    errorHandler,
    true // Auto-load on mount
  );

  // Local form state
  const [counter, setCounter] = useState(0);
  const [userName, setUserName] = useState('Demo User');
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>([]);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);
  const [saveCount, setSaveCount] = useState(0);

  // Sync form state with loaded state
  useEffect(() => {
    if (state) {
      setCounter(state.counter || 0);
      setUserName(state.userData?.name || 'Demo User');
      setSelectedPrefs(state.userData?.preferences || []);
    }
  }, [state]);

  // Auto-save with debouncing
  useEffect(() => {
    if (!autoSaveEnabled || !services.pluginState) return;

    const timeoutId = setTimeout(() => {
      handleSave();
    }, 1000); // 1 second delay after last change

    return () => clearTimeout(timeoutId);
  }, [counter, userName, selectedPrefs, autoSaveEnabled]);

  const handleSave = async () => {
    const newState: DemoState = {
      counter,
      lastUpdated: new Date().toISOString(),
      userData: {
        name: userName,
        preferences: selectedPrefs
      },
      sessionId: Math.random().toString(36).substring(7)
    };

    try {
      await saveState(newState);
      setSaveCount(prev => prev + 1);
    } catch (err) {
      console.error('Failed to save state:', err);
    }
  };

  const handleClear = async () => {
    if (!confirm('Are you sure you want to clear all saved state?')) {
      return;
    }

    try {
      await clearState();
      setCounter(0);
      setUserName('Demo User');
      setSelectedPrefs([]);
      setSaveCount(0);
    } catch (err) {
      console.error('Failed to clear state:', err);
    }
  };

  const togglePreference = (pref: string) => {
    setSelectedPrefs(prev =>
      prev.includes(pref)
        ? prev.filter(p => p !== pref)
        : [...prev, pref]
    );
  };

  if (!isAvailable) {
    return (
      <div className="plugin-state-service-tab">
        <div className="service-unavailable">
          <h3>⚠️ PluginState Service Unavailable</h3>
          <p>The PluginState service is not available in this environment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="plugin-state-service-tab">
      {/* Introduction */}
      <div className="showcase-intro">
        <h2>💾 PluginState Service - Persistent Plugin Storage</h2>
        <p>
          The PluginState Service provides persistent key-value storage scoped to your plugin.
          Store user preferences, session data, and plugin state that persists across page reloads.
        </p>
      </div>

      {/* Current State Display */}
      {state && (
        <div className="current-state-banner">
          <h4>✅ Loaded State from Storage</h4>
          <p>
            Last saved: {new Date(state.lastUpdated).toLocaleString()} |
            Session: {state.sessionId} |
            Total saves: {saveCount}
          </p>
        </div>
      )}

      {/* Example 1: Save and Load State */}
      <div className="showcase-example">
        <h3>Example 1: Save and Load State</h3>
        <p>Persist plugin data and automatically restore it on next load.</p>

        <div className="demo-section">
          <div className="state-demo-grid">
            <div className="demo-controls">
              <div className="form-group">
                <label>Counter Value:</label>
                <div className="counter-controls">
                  <button
                    onClick={() => setCounter(prev => Math.max(0, prev - 1))}
                    className="counter-btn"
                    disabled={isLoading}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={counter}
                    onChange={(e) => setCounter(parseInt(e.target.value) || 0)}
                    className="demo-input counter-input"
                    disabled={isLoading}
                  />
                  <button
                    onClick={() => setCounter(prev => prev + 1)}
                    className="counter-btn"
                    disabled={isLoading}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>User Name:</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="demo-input"
                  placeholder="Enter name"
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label>Preferences:</label>
                <div className="preferences-grid">
                  {['Dark Mode', 'Notifications', 'Auto-Save', 'Analytics'].map(pref => (
                    <label key={pref} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedPrefs.includes(pref)}
                        onChange={() => togglePreference(pref)}
                        disabled={isLoading}
                      />
                      <span>{pref}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={autoSaveEnabled}
                    onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                    className="toggle-checkbox"
                  />
                  <span className="toggle-slider"></span>
                  <span className="toggle-text">
                    Auto-save (1s delay) {autoSaveEnabled && isLoading && '(Saving...)'}
                  </span>
                </label>
              </div>

              <div className="button-group">
                <TryItButton
                  onClick={handleSave}
                  label="Save State"
                  icon="💾"
                  variant="success"
                  loading={isLoading}
                  disabled={autoSaveEnabled}
                />
                <TryItButton
                  onClick={handleClear}
                  label="Clear State"
                  icon="🗑️"
                  variant="danger"
                  loading={isLoading}
                />
              </div>
            </div>

            <ResultDisplay
              title="Current State"
              data={state}
              error={error}
              loading={isLoading}
              empty="No state saved yet. Fill the form and click 'Save State'"
              variant={state ? 'success' : 'default'}
            />
          </div>

          <p className="demo-hint">
            💡 <strong>Try it:</strong> Change the values, save the state, then refresh the page.
            Your data will be automatically restored!
          </p>
        </div>

        <CodeExample
          title="Using the usePluginState hook"
          code={`
import { usePluginState } from './hooks';

const MyPlugin: React.FC<PluginProps> = ({ services }) => {
  const { state, saveState, clearState, isLoading } = usePluginState(
    services.pluginState,
    errorHandler,
    true // Auto-load on mount
  );

  const handleSave = async () => {
    await saveState({
      counter: 42,
      lastUpdated: new Date().toISOString(),
      userData: {
        name: 'John Doe',
        preferences: ['Dark Mode', 'Notifications']
      }
    });
  };

  const handleClear = async () => {
    await clearState();
  };

  return (
    <div>
      <pre>{JSON.stringify(state, null, 2)}</pre>
      <button onClick={handleSave} disabled={isLoading}>
        Save State
      </button>
      <button onClick={handleClear} disabled={isLoading}>
        Clear State
      </button>
    </div>
  );
};
          `}
        />
      </div>

      {/* Example 2: Manual State Management */}
      <div className="showcase-example">
        <h3>Example 2: Manual State Management (Without Hook)</h3>
        <p>For advanced use cases, interact with the service directly.</p>

        <CodeExample
          title="Direct service access"
          code={`
// Save state
const saveData = async () => {
  if (!services.pluginState) return;

  try {
    await services.pluginState.saveState({
      userId: 'user-123',
      settings: { theme: 'dark', lang: 'en' },
      lastLogin: Date.now()
    });
    console.log('State saved successfully');
  } catch (error) {
    console.error('Failed to save:', error);
  }
};

// Load state
const loadData = async () => {
  if (!services.pluginState) return;

  try {
    const state = await services.pluginState.getState();
    console.log('Loaded state:', state);
    return state;
  } catch (error) {
    console.error('Failed to load:', error);
    return null;
  }
};

// Clear state
const clearData = async () => {
  if (!services.pluginState) return;

  try {
    await services.pluginState.clearState();
    console.log('State cleared');
  } catch (error) {
    console.error('Failed to clear:', error);
  }
};
          `}
        />
      </div>

      {/* Example 3: State Configuration */}
      <div className="showcase-example">
        <h3>Example 3: Configure State Strategy</h3>
        <p>Configure how your plugin state is stored and managed.</p>

        <CodeExample
          title="State configuration options"
          code={`
// Configure plugin state on initialization
useEffect(() => {
  if (!services.pluginState?.configure) return;

  services.pluginState.configure({
    pluginId: 'my-plugin-id',
    stateStrategy: 'persistent', // 'session' or 'persistent'
    preserveKeys: ['userData', 'settings'], // Always preserve these keys
    stateSchema: {
      // Define validation schema
      userData: { type: 'object', required: true },
      settings: { type: 'object', required: false },
      counter: { type: 'number', default: 0 }
    },
    maxStateSize: 10240 // 10KB limit
  });
}, [services.pluginState]);

// Strategies:
// - 'session': State cleared when browser session ends
// - 'persistent': State persists across browser sessions
          `}
        />
      </div>

      {/* Example 4: Event Subscriptions */}
      <div className="showcase-example">
        <h3>Example 4: React to State Changes</h3>
        <p>Subscribe to state lifecycle events for advanced workflows.</p>

        <CodeExample
          title="State event subscriptions"
          code={`
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

  return () => {
    cleanupFns.forEach(fn => fn());
  };
}, [services.pluginState]);
          `}
        />
      </div>

      {/* Best Practices */}
      <div className="showcase-tips">
        <h3>💡 Best Practices</h3>
        <ul>
          <li>
            <strong>Use the hook:</strong> <code>usePluginState</code> handles loading, saving, and cleanup automatically
          </li>
          <li>
            <strong>Auto-save with debouncing:</strong> Delay saves by 1-2 seconds after last change to avoid excessive writes
          </li>
          <li>
            <strong>Validate before saving:</strong> Use schemas to ensure state structure integrity
          </li>
          <li>
            <strong>Handle errors gracefully:</strong> Always catch save/load errors and provide user feedback
          </li>
          <li>
            <strong>Size limits:</strong> Keep state under 10KB for optimal performance
          </li>
          <li>
            <strong>Choose strategy wisely:</strong> Use 'session' for temporary data, 'persistent' for long-term storage
          </li>
          <li>
            <strong>Clear on logout:</strong> Consider clearing sensitive state when users log out
          </li>
          <li>
            <strong>Version your state:</strong> Include version numbers to handle schema migrations
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PluginStateServiceTab;
