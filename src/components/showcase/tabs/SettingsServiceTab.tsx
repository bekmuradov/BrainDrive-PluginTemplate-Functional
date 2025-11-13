import React, { useState } from 'react';
import { Services } from '../../../types';
import { useSettings } from '../../../hooks';
import CodeExample from '../CodeExample';
import TryItButton from '../TryItButton';
import ResultDisplay from '../ResultDisplay';
import { ErrorHandler } from '../../../utils/errorHandling';
import './SettingsServiceTab.css';

interface SettingsServiceTabProps {
  services: Services;
  errorHandler: ErrorHandler;
}

export const SettingsServiceTab: React.FC<SettingsServiceTabProps> = ({ services, errorHandler }) => {
  // Simple setting
  const {
    value: notificationsEnabled,
    setValue: setNotificationsEnabled,
    isLoading: notifLoading
  } = useSettings<boolean>(services.settings, 'plugin_notifications_enabled', false, errorHandler);

  // Complex setting
  const {
    value: preferences,
    setValue: setPreferences,
    isLoading: prefLoading
  } = useSettings(
    services.settings,
    'plugin_preferences',
    { refreshInterval: 60000, defaultView: 'grid', theme: 'auto' },
    errorHandler
  );

  const [tempPrefs, setTempPrefs] = useState(preferences || { refreshInterval: 60000, defaultView: 'grid', theme: 'auto' });

  const isAvailable = !!services.settings;

  if (!isAvailable) {
    return (
      <div className="settings-service-tab">
        <div className="service-unavailable">
          <h3>⚠️ Settings Service Unavailable</h3>
          <p>The settings service is not available in this environment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-service-tab">
      <div className="showcase-intro">
        <h2>⚙️ Settings Service - Remember User Preferences</h2>
        <p>
          The Settings Service provides persistent storage for user preferences.
          Settings are saved automatically and persist across sessions.
        </p>
        <div className="info-banner">
          <strong>⚠️ Important:</strong> All settings must be registered in your plugin's <code>settingDefinitions</code>
          in <code>lifecycle_manager.py</code> before they can be used.
        </div>
      </div>

      {/* Example 1: Simple Boolean Setting */}
      <div className="showcase-example">
        <h3>Example 1: Simple Boolean Setting</h3>
        <p>Toggle settings with automatic persistence.</p>

        <div className="demo-section">
          <div className="setting-control">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={notificationsEnabled || false}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                disabled={notifLoading}
                className="toggle-checkbox"
              />
              <span className="toggle-slider"></span>
              <span className="toggle-text">
                Enable Notifications {notifLoading && '(Saving...)'}
              </span>
            </label>
          </div>

          <ResultDisplay
            title="Current Value"
            data={{ notificationsEnabled, saved: !notifLoading }}
            variant="info"
          />
        </div>

        <CodeExample
          title="Simple boolean setting"
          code={`
const {
  value: notificationsEnabled,
  setValue: setNotificationsEnabled,
  isLoading
} = useSettings(
  services.settings,
  'plugin_notifications_enabled',
  false // default value
);

<input
  type="checkbox"
  checked={notificationsEnabled}
  onChange={(e) => setNotificationsEnabled(e.target.checked)}
  disabled={isLoading}
/>
          `}
        />
      </div>

      {/* Example 2: Complex Object Setting */}
      <div className="showcase-example">
        <h3>Example 2: Complex Object Settings</h3>
        <p>Store and manage complex configuration objects.</p>

        <div className="demo-section">
          <div className="settings-form">
            <div className="form-group">
              <label>Refresh Interval (ms):</label>
              <input
                type="number"
                value={tempPrefs.refreshInterval}
                onChange={(e) => setTempPrefs({ ...tempPrefs, refreshInterval: parseInt(e.target.value) || 60000 })}
                className="demo-input"
              />
            </div>

            <div className="form-group">
              <label>Default View:</label>
              <select
                value={tempPrefs.defaultView}
                onChange={(e) => setTempPrefs({ ...tempPrefs, defaultView: e.target.value })}
                className="demo-select"
              >
                <option value="grid">Grid</option>
                <option value="list">List</option>
                <option value="table">Table</option>
              </select>
            </div>

            <div className="form-group">
              <label>Theme Preference:</label>
              <select
                value={tempPrefs.theme}
                onChange={(e) => setTempPrefs({ ...tempPrefs, theme: e.target.value })}
                className="demo-select"
              >
                <option value="auto">Auto</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            <div className="button-group">
              <TryItButton
                onClick={async () => {
                  await setPreferences(tempPrefs);
                }}
                label="Save Settings"
                icon="💾"
                variant="success"
                loading={prefLoading}
              />
              <TryItButton
                onClick={() => setTempPrefs(preferences || { refreshInterval: 60000, defaultView: 'grid', theme: 'auto' })}
                label="Reset"
                icon="↺"
                variant="secondary"
              />
            </div>
          </div>

          <ResultDisplay
            title="Saved Preferences"
            data={preferences}
            variant="success"
          />
        </div>

        <CodeExample
          title="Complex object settings"
          code={`
const {
  value: preferences,
  setValue: setPreferences,
  isLoading
} = useSettings(
  services.settings,
  'plugin_preferences',
  {
    refreshInterval: 60000,
    defaultView: 'grid',
    theme: 'auto'
  }
);

// Update settings
const handleSave = () => {
  setPreferences({
    refreshInterval: 30000,
    defaultView: 'list',
    theme: 'dark'
  });
};
          `}
        />
      </div>

      {/* Example 3: Register Settings */}
      <div className="showcase-example">
        <h3>Example 3: Register Settings in lifecycle_manager.py</h3>
        <p>Before using settings, register them in your plugin's lifecycle manager.</p>

        <CodeExample
          title="Register settings in lifecycle_manager.py"
          code={`
# In lifecycle_manager.py, add settingDefinitions to plugin_data
self.plugin_data = {
    "name": "MyPlugin",
    "version": "1.0.0",
    # ... other fields ...
    "settingDefinitions": [
        {
            "id": "plugin_notifications_enabled",
            "name": "Enable Notifications",
            "description": "Enable or disable plugin notifications",
            "type": "boolean",
            "default": False,
            "category": "general",
            "scope": "user"
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
          `}
        />
      </div>

      {/* Example 4: Direct Access Methods */}
      <div className="showcase-example">
        <h3>Example 4: Direct Access (Without Hook)</h3>
        <p>Use getSetting and setSetting methods directly for one-off operations.</p>

        <CodeExample
          title="Direct settings access"
          code={`
// Get a setting
const loadSetting = async () => {
  if (!services.settings) return;

  const value = await services.settings.getSetting('my_setting_key');
  console.log('Setting value:', value);
};

// Set a setting
const saveSetting = async () => {
  if (!services.settings) return;

  await services.settings.setSetting('my_setting_key', {
    enabled: true,
    count: 42
  });
  console.log('Setting saved!');
};

// Get setting definitions (for dynamic forms)
const getDefinitions = async () => {
  if (!services.settings?.getSettingDefinitions) return;

  const defs = await services.settings.getSettingDefinitions();
  console.log('Available settings:', defs);
};
          `}
        />
      </div>

      {/* Best Practices */}
      <div className="showcase-tips">
        <h3>💡 Best Practices</h3>
        <ul>
          <li><strong>Use the hook:</strong> <code>useSettings</code> handles loading, saving, and state management</li>
          <li><strong>Provide defaults:</strong> Always specify a default value for graceful fallbacks</li>
          <li><strong>Use specific keys:</strong> Prefix keys with your plugin name to avoid conflicts</li>
          <li><strong>Handle loading states:</strong> Disable inputs while <code>isLoading</code> is true</li>
          <li><strong>Validate before saving:</strong> Use <code>useSettingsWithValidation</code> for complex validation</li>
          <li><strong>Save on change vs on submit:</strong> Choose based on UX requirements</li>
        </ul>
      </div>
    </div>
  );
};

export default SettingsServiceTab;
