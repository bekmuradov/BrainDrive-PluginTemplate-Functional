import React, { useState, useEffect, useRef, useCallback } from 'react';
import './PluginTemplateFunctional.css';
import {
  PluginTemplateProps,
  PluginData,
  Services
} from './types';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorDisplay, { ErrorInfo } from './components/ErrorDisplay';
import {
  ErrorHandler,
  PluginError,
  ServiceError,
  ValidationError,
  ErrorStrategy,
  ErrorSeverity,
  ErrorUtils
} from './utils/errorHandling';

// TEMPLATE: Import your components here
// import { YourComponent } from './components';

/**
 * TEMPLATE: Main Plugin Component (Functional with Hooks)
 *
 * This is the main functional component for your BrainDrive plugin.
 * TODO: Customize this component for your specific plugin functionality.
 *
 * Key patterns to follow:
 * 1. Use functional components with React Hooks
 * 2. Initialize services in useEffect(() => {}, [])
 * 3. Clean up listeners in useEffect cleanup (return function)
 * 4. Handle theme changes automatically with useTheme hook
 * 5. Provide error boundaries and loading states
 * 6. Use useCallback for event handlers to prevent re-renders
 * 7. Use useRef for mutable values that don't trigger re-renders
 */

/**
 * PluginTemplateFunctional Component
 *
 * CONVERSION NOTES:
 * - Class state → useState hooks
 * - componentDidMount → useEffect(() => {}, [])
 * - componentWillUnmount → useEffect cleanup function (return)
 * - Instance variables (this.retryCount) → useRef hooks
 * - Bound methods (this.handleRetry) → useCallback hooks
 * - this.props → direct props parameter
 * - this.state → individual state variables
 */
const PluginTemplateFunctional: React.FC<PluginTemplateProps> = (props) => {
  const {
    title = "Plugin Template (Functional)",
    description = "A functional component template for BrainDrive plugins with React Hooks",
    services,
    moduleId,
    config,
    pluginId,
    instanceId
  } = props;

  // STATE MANAGEMENT
  // Class equivalent: this.state = { ... }
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentTheme, setCurrentTheme] = useState('light');
  const [isInitializing, setIsInitializing] = useState(true);
  const [data, setData] = useState<any>(null); // TODO: Replace with your plugin's data structure
  const [lastError, setLastError] = useState<Error | null>(null);
  const [retryAvailable, setRetryAvailable] = useState(false);

  // REFS FOR MUTABLE VALUES
  // Class equivalent: this.retryCount = 0
  // useRef persists values across renders without causing re-renders
  const retryCountRef = useRef(0);
  const maxRetriesRef = useRef(3);
  const themeChangeListenerRef = useRef<((theme: string) => void) | null>(null);
  const pageContextUnsubscribeRef = useRef<(() => void) | null>(null);
  const errorHandlerRef = useRef<ErrorHandler | null>(null);

  // Initialize error handler on first render
  // This runs once before any other effects
  if (!errorHandlerRef.current) {
    errorHandlerRef.current = new ErrorHandler(
      {
        maxRetries: maxRetriesRef.current,
        retryDelay: 1000,
        enableLogging: true,
        enableReporting: true,
        userNotification: true,
        fallbackValues: {
          plugindata: null,
          theme: 'light',
          settings: {}
        }
      },
      {
        component: 'PluginTemplateFunctional',
        pluginId: pluginId || 'PluginTemplateFunctional',
        moduleId: moduleId || 'main'
      }
    );
  }

  const errorHandler = errorHandlerRef.current;

  /**
   * Handle component-level errors with comprehensive error management
   * Class equivalent: private handleComponentError = (error, context) => { ... }
   *
   * useCallback prevents function recreation on every render
   * Dependencies: values used inside the function
   */
  const handleComponentError = useCallback((error: unknown, context: string) => {
    const normalizedError = ErrorUtils.normalizeError(error);
    const pluginError = new PluginError(
      `Component error in ${context}: ${normalizedError.message}`,
      'COMPONENT_ERROR',
      { context, originalError: normalizedError },
      true
    );

    console.error(`PluginTemplateFunctional: ${context} error:`, pluginError);

    setError(ErrorUtils.getUserMessage(pluginError));
    setIsInitializing(false);
    setIsLoading(false);
    setLastError(pluginError);
    setRetryAvailable(retryCountRef.current < maxRetriesRef.current);
  }, []); // Empty dependencies - function doesn't depend on any external values

  /**
   * Handle retry action from user
   * Class equivalent: private handleRetry = async () => { ... }
   */
  const handleRetry = useCallback(async () => {
    if (retryCountRef.current >= maxRetriesRef.current) {
      console.warn('PluginTemplateFunctional: Max retries exceeded');
      setRetryAvailable(false);
      return;
    }

    retryCountRef.current++;
    console.log(`PluginTemplateFunctional: Retry attempt ${retryCountRef.current}/${maxRetriesRef.current}`);

    setIsLoading(true);
    setError('');
    setLastError(null);

    // Retry initialization by resetting state
    setIsInitializing(true);
  }, []); // Empty dependencies - uses refs which don't need to be in deps

  /**
   * Handle error dismissal
   * Class equivalent: private handleDismissError = () => { ... }
   */
  const handleDismissError = useCallback(() => {
    setError('');
    setLastError(null);
    setRetryAvailable(false);
  }, []);

  /**
   * Initialize BrainDrive services with comprehensive error handling
   * Class equivalent: private async initializeServices(): Promise<void> { ... }
   */
  const initializeServices = useCallback(async (): Promise<void> => {
    // Initialize theme service with error handling
    await errorHandler.safeAsync(async () => {
      if (services.theme) {
        const theme = errorHandler.safeSync(
          () => services.theme!.getCurrentTheme(),
          'light'
        );
        setCurrentTheme(theme);

        // Listen for theme changes with error handling
        themeChangeListenerRef.current = (theme: string) => {
          errorHandler.safeSync(() => {
            setCurrentTheme(theme);
          });
        };

        services.theme.addThemeChangeListener(themeChangeListenerRef.current);
        console.log('PluginTemplateFunctional: Theme service initialized successfully');
      } else {
        console.warn('PluginTemplateFunctional: Theme service not available');
      }
    }, undefined, ErrorStrategy.FALLBACK).catch(error => {
      throw new ServiceError(
        'Failed to initialize theme service',
        'theme',
        'THEME_INIT_ERROR',
        error
      );
    });

    // Initialize page context service with error handling
    await errorHandler.safeAsync(async () => {
      if (services.pageContext) {
        pageContextUnsubscribeRef.current = services.pageContext.onPageContextChange((context) => {
          errorHandler.safeSync(() => {
            console.log('PluginTemplateFunctional: Page context changed:', context);
            // TODO: Handle page context changes if needed
          });
        });
        console.log('PluginTemplateFunctional: Page context service initialized successfully');
      } else {
        console.warn('PluginTemplateFunctional: Page context service not available');
      }
    }, undefined, ErrorStrategy.FALLBACK).catch(error => {
      throw new ServiceError(
        'Failed to initialize page context service',
        'pageContext',
        'PAGE_CONTEXT_INIT_ERROR',
        error
      );
    });

    // Initialize settings service with comprehensive error handling
    await errorHandler.safeAsync(async () => {
      if (services.settings) {
        try {
          const savedConfig = await services.settings.getSetting?.('plugin_template_config');
          if (savedConfig) {
            // Validate configuration before applying
            const validatedConfig = errorHandler.validate(
              savedConfig,
              [
                (config) => typeof config === 'object' || 'Configuration must be an object',
                (config) => config !== null || 'Configuration cannot be null'
              ],
              'plugin_template_config'
            );

            // TODO: Apply saved configuration
            console.log('PluginTemplateFunctional: Loaded and validated saved config:', validatedConfig);
          }
          console.log('PluginTemplateFunctional: Settings service initialized successfully');
        } catch (error) {
          if (error instanceof ValidationError) {
            console.error('PluginTemplateFunctional: Invalid configuration:', error);
            // Use default configuration
          } else {
            throw new ServiceError(
              'Failed to load settings',
              'settings',
              'SETTINGS_LOAD_ERROR',
              error
            );
          }
        }
      } else {
        console.warn('PluginTemplateFunctional: Settings service not available');
      }
    }, undefined, ErrorStrategy.FALLBACK);

    // TODO: Initialize other services as needed with similar error handling patterns
    console.log('PluginTemplateFunctional: All services initialized');
  }, [services, errorHandler]); // Dependencies: values used in the function

  /**
   * Clean up services and listeners with error handling
   * Class equivalent: private cleanupServices(): void { ... }
   */
  const cleanupServices = useCallback((): void => {
    // Clean up theme service listener
    errorHandler.safeSync(() => {
      if (services.theme && themeChangeListenerRef.current) {
        services.theme.removeThemeChangeListener(themeChangeListenerRef.current);
        themeChangeListenerRef.current = null;
        console.log('PluginTemplateFunctional: Theme service cleaned up');
      }
    });

    // Clean up page context subscription
    errorHandler.safeSync(() => {
      if (pageContextUnsubscribeRef.current) {
        pageContextUnsubscribeRef.current();
        pageContextUnsubscribeRef.current = null;
        console.log('PluginTemplateFunctional: Page context service cleaned up');
      }
    });

    // Reset error handler state
    errorHandler.resetErrorCounts();
    console.log('PluginTemplateFunctional: All services cleaned up successfully');
  }, [services, errorHandler]);

  /**
   * Load initial data for the plugin
   * Class equivalent: private async loadInitialData(): Promise<void> { ... }
   */
  const loadInitialData = useCallback(async (): Promise<void> => {
    // TODO: Add your plugin's data loading logic here
    setIsLoading(false);
    setError('');
  }, []);

  /**
   * LIFECYCLE: Component Mount & Initialization
   * Class equivalent: async componentDidMount() { ... }
   *
   * useEffect with empty dependency array [] runs once after first render
   * Return function runs on unmount (componentWillUnmount equivalent)
   */
  useEffect(() => {
    // Only initialize once when component mounts or when isInitializing becomes true
    if (!isInitializing) return;

    const initialize = async () => {
      await errorHandler.safeAsync(
        async () => {
          await initializeServices();
          await loadInitialData();
          setIsInitializing(false);
          setError('');
          setLastError(null);
          setRetryAvailable(false);
        },
        undefined,
        ErrorStrategy.RETRY
      ).catch((error) => {
        handleComponentError(error, 'initialization');
      });
    };

    initialize();

    // CLEANUP: Runs when component unmounts
    // Class equivalent: componentWillUnmount() { ... }
    return () => {
      cleanupServices();
    };
  }, [isInitializing, initializeServices, loadInitialData, errorHandler, handleComponentError, cleanupServices]);

  /**
   * Render loading state
   */
  const renderLoading = (): JSX.Element => {
    return (
      <div className="plugin-template-loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  };

  /**
   * Render error state with enhanced error display
   */
  const renderError = (): JSX.Element => {
    // Create comprehensive error info
    const errorInfo: ErrorInfo = lastError ? {
      message: error || lastError.message,
      code: lastError instanceof PluginError ? lastError.code : 'UNKNOWN_ERROR',
      details: lastError instanceof PluginError ? lastError.details : undefined,
      timestamp: lastError instanceof PluginError ? lastError.timestamp : new Date().toISOString(),
      stack: lastError.stack
    } : {
      message: error || 'An unknown error occurred',
      timestamp: new Date().toISOString()
    };

    return (
      <div className="plugin-template-error">
        <ErrorDisplay
          error={errorInfo}
          onRetry={retryAvailable ? handleRetry : undefined}
          onDismiss={handleDismissError}
          showDetails={true}
          variant="error"
        />

        {/* Additional error context for developers */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{
            marginTop: '12px',
            padding: '8px',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            fontSize: '11px',
            color: '#6c757d'
          }}>
            <strong>🔧 Debug Info:</strong>
            <ul style={{ margin: '4px 0', paddingLeft: '16px' }}>
              <li>Retry Count: {retryCountRef.current}/{maxRetriesRef.current}</li>
              <li>Error Handler Stats: {JSON.stringify(errorHandler.getErrorStats())}</li>
              <li>Component State: {JSON.stringify({
                isLoading,
                isInitializing
              })}</li>
            </ul>
          </div>
        )}
      </div>
    );
  };

  /**
   * Render main plugin content
   */
  const renderContent = (): JSX.Element => {
    // Get page context information
    const pageContext = services.pageContext?.getCurrentPageContext();

    return (
      <div className="plugin-template-content">
        <div className="plugin-header">
          <h3>{title}</h3>
          <p>{description}</p>
        </div>

        {/* Plugin Information */}
        <div className="plugin-info">
          <h4>Plugin Information</h4>
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
              <strong>Configuration:</strong>
              <ul>
                <li>Refresh Interval: {config?.refreshInterval || 'Not set'}</li>
                <li>Show Advanced Options: {config?.showAdvancedOptions ? 'Yes' : 'No'}</li>
                <li>Custom Setting: {config?.customSetting || 'Not set'}</li>
              </ul>
            </div>
            <div className="info-item">
              <strong>Page Context:</strong>
              <ul>
                <li>Page ID: {pageContext?.pageId || 'Not available'}</li>
                <li>Page Name: {pageContext?.pageName || 'Not available'}</li>
                <li>Page Route: {pageContext?.pageRoute || 'Not available'}</li>
                <li>Is Studio Page: {pageContext?.isStudioPage ? 'Yes' : 'No'}</li>
              </ul>
            </div>
            <div className="info-item">
              <strong>Services Available:</strong>
              <ul>
                <li>API: {services.api ? '✅' : '❌'}</li>
                <li>Event: {services.event ? '✅' : '❌'}</li>
                <li>Theme: {services.theme ? '✅' : '❌'}</li>
                <li>Settings: {services.settings ? '✅' : '❌'}</li>
                <li>Page Context: {services.pageContext ? '✅' : '❌'}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Hook Pattern Example */}
        <div className="plugin-info" style={{ marginTop: '20px' }}>
          <h4>React Hooks Used in This Component</h4>
          <div className="info-grid">
            <div className="info-item">
              <strong>State Management:</strong>
              <ul>
                <li>useState - for component state (loading, error, theme, etc.)</li>
                <li>useRef - for mutable values (retryCount, listeners)</li>
              </ul>
            </div>
            <div className="info-item">
              <strong>Side Effects:</strong>
              <ul>
                <li>useEffect - for initialization and cleanup</li>
                <li>Dependencies properly managed to prevent infinite loops</li>
              </ul>
            </div>
            <div className="info-item">
              <strong>Performance:</strong>
              <ul>
                <li>useCallback - memoized event handlers</li>
                <li>Prevents unnecessary re-renders</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // MAIN RENDER
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('PluginTemplateFunctional: React Error Boundary caught error:', error, errorInfo);
        // Additional error reporting can be added here
      }}
      resetOnPropsChange={true}
      resetKeys={[pluginId || 'unknown', moduleId || 'unknown']}
    >
      <div className={`plugin-template ${currentTheme === 'dark' ? 'dark-theme' : ''}`}>
        {isInitializing ? (
          renderLoading()
        ) : error ? (
          renderError()
        ) : (
          errorHandler.safeSync(
            () => renderContent(),
            <ErrorDisplay
              error="Failed to render plugin content"
              onRetry={handleRetry}
              variant="error"
            />
          )
        )}
      </div>
    </ErrorBoundary>
  );
};

export default PluginTemplateFunctional;
