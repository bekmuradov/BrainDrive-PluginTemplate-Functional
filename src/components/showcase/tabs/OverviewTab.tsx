import React from 'react';
import { Services } from '../../../types';
import CodeExample from '../CodeExample';
import './OverviewTab.css';

interface OverviewTabProps {
  services: Services;
}

/**
 * OverviewTab Component
 *
 * Welcome screen that introduces service bridges and shows what's available.
 * Helps new developers understand the plugin architecture.
 */
export const OverviewTab: React.FC<OverviewTabProps> = ({ services }) => {
  const serviceList = [
    {
      name: 'Theme Service',
      icon: '🎨',
      available: !!services.theme,
      description: 'Integrate with BrainDrive\'s theme system (dark/light mode)',
      methods: ['getCurrentTheme', 'setTheme', 'toggleTheme', 'addThemeChangeListener']
    },
    {
      name: 'API Service',
      icon: '🌐',
      available: !!services.api,
      description: 'Make HTTP requests to the BrainDrive backend',
      methods: ['get', 'post', 'put', 'delete', 'postStreaming']
    },
    {
      name: 'Settings Service',
      icon: '⚙️',
      available: !!services.settings,
      description: 'Store and retrieve user preferences persistently',
      methods: ['getSetting', 'setSetting', 'getSettingDefinitions']
    },
    {
      name: 'Event Service',
      icon: '📡',
      available: !!services.event,
      description: 'Send messages between plugins for inter-plugin communication',
      methods: ['sendMessage', 'subscribeToMessages', 'unsubscribeFromMessages']
    },
    {
      name: 'Page Context Service',
      icon: '📍',
      available: !!services.pageContext,
      description: 'Know which page the user is on and react to navigation',
      methods: ['getCurrentPageContext', 'onPageContextChange']
    }
  ];

  const availableCount = serviceList.filter(s => s.available).length;

  return (
    <div className="overview-tab">
      {/* Hero Section */}
      <div className="overview-hero">
        <h2>🧩 Welcome to BrainDrive Plugin Development!</h2>
        <p className="overview-subtitle">
          This template demonstrates how to use <strong>Service Bridges</strong> -
          the communication layer between your plugin and the BrainDrive platform.
        </p>
      </div>

      {/* What are Service Bridges */}
      <div className="overview-section">
        <h3>What are Service Bridges?</h3>
        <p>
          Service Bridges are <strong>pre-built APIs</strong> that BrainDrive provides to your plugin.
          Instead of building everything from scratch, you can use these services to:
        </p>
        <ul className="overview-benefits">
          <li>🎨 <strong>Adapt to theme changes</strong> (dark/light mode)</li>
          <li>🌐 <strong>Communicate with the backend</strong> (HTTP requests)</li>
          <li>💾 <strong>Save user preferences</strong> (persistent settings)</li>
          <li>📨 <strong>Talk to other plugins</strong> (inter-plugin messaging)</li>
          <li>🗺️ <strong>Know user context</strong> (which page, what route)</li>
        </ul>
      </div>

      {/* Service Availability */}
      <div className="overview-section">
        <h3>Available Services ({availableCount}/5)</h3>
        <div className="service-grid">
          {serviceList.map(service => (
            <div key={service.name} className={`service-card ${service.available ? 'available' : 'unavailable'}`}>
              <div className="service-card-header">
                <span className="service-icon">{service.icon}</span>
                <div className="service-info">
                  <h4>{service.name}</h4>
                  <span className={`service-status ${service.available ? 'status-available' : 'status-unavailable'}`}>
                    {service.available ? '✅ Available' : '❌ Unavailable'}
                  </span>
                </div>
              </div>
              <p className="service-description">{service.description}</p>
              <div className="service-methods">
                <strong>Methods:</strong>
                <ul>
                  {service.methods.map(method => (
                    <li key={method}><code>{method}()</code></li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How Services are Injected */}
      <div className="overview-section">
        <h3>How Do I Access Services?</h3>
        <p>
          Services are automatically injected into your plugin component via props.
          You don't need to import or configure anything!
        </p>

        <CodeExample
          title="Services are provided in your component props"
          code={`
// Your plugin component automatically receives services
const MyPlugin: React.FC<PluginTemplateProps> = ({ services }) => {
  // All services are ready to use!
  // services.theme    - Theme integration
  // services.api      - HTTP requests
  // services.settings - Persistent storage
  // services.event    - Inter-plugin messaging
  // services.pageContext - Page information

  // Always check if a service is available before using it
  if (services.theme) {
    const currentTheme = services.theme.getCurrentTheme();
    console.log('Current theme:', currentTheme);
  }

  return <div>My Plugin</div>;
};
          `}
        />
      </div>

      {/* Using Custom Hooks */}
      <div className="overview-section">
        <h3>Using Custom Hooks (Recommended)</h3>
        <p>
          This template provides custom React hooks that make using services even easier.
          They handle subscriptions, cleanup, and state management automatically!
        </p>

        <CodeExample
          title="Example: Using the useTheme hook"
          code={`
import { useTheme } from './hooks';

const MyPlugin: React.FC<PluginTemplateProps> = ({ services }) => {
  // The hook handles everything automatically!
  const { currentTheme, setTheme, toggleTheme } = useTheme(services.theme);

  return (
    <div className={\`plugin \${currentTheme === 'dark' ? 'dark-theme' : ''}\`}>
      <h3>Current Theme: {currentTheme}</h3>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};
          `}
        />

        <p className="overview-note">
          💡 <strong>Tip:</strong> This template includes 5 custom hooks that correspond to each service bridge.
          Check the tabs above to see them in action!
        </p>
      </div>

      {/* Next Steps */}
      <div className="overview-section overview-next-steps">
        <h3>🚀 Explore the Examples</h3>
        <p>
          Click the tabs above to see each service bridge in action with interactive examples:
        </p>
        <div className="next-steps-grid">
          <div className="next-step-card">
            <span className="next-step-icon">🎨</span>
            <strong>Theme Service</strong>
            <p>Make your plugin theme-aware</p>
          </div>
          <div className="next-step-card">
            <span className="next-step-icon">🌐</span>
            <strong>API Service</strong>
            <p>Connect to your backend</p>
          </div>
          <div className="next-step-card">
            <span className="next-step-icon">⚙️</span>
            <strong>Settings Service</strong>
            <p>Remember user preferences</p>
          </div>
          <div className="next-step-card">
            <span className="next-step-icon">📡</span>
            <strong>Event Service</strong>
            <p>Communicate with other plugins</p>
          </div>
          <div className="next-step-card">
            <span className="next-step-icon">📍</span>
            <strong>Page Context</strong>
            <p>Know where the user is</p>
          </div>
        </div>
      </div>

      {/* Documentation Links */}
      <div className="overview-section overview-docs">
        <h3>📚 Additional Resources</h3>
        <ul className="overview-links">
          <li>
            <a href="#" onClick={(e) => { e.preventDefault(); console.log('Open SERVICE_BRIDGES.md'); }}>
              📖 Service Bridges Documentation
            </a>
          </li>
          <li>
            <a href="#" onClick={(e) => { e.preventDefault(); console.log('Open HOOKS_GUIDE.md'); }}>
              🎣 React Hooks Guide
            </a>
          </li>
          <li>
            <a href="#" onClick={(e) => { e.preventDefault(); console.log('Open README.md'); }}>
              📘 Template README
            </a>
          </li>
          <li>
            <a href="https://github.com/bekmuradov/BrainDrive-PluginTemplate-Functional" target="_blank" rel="noopener noreferrer">
              🔗 GitHub Repository
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default OverviewTab;
