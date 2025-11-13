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
import { useTheme, usePageContext, useSettings } from './hooks';

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
  const [isInitializing, setIsInitializing] = useState(true);
  const [data, setData] = useState<any>(null); // TODO: Replace with your plugin's data structure
  const [lastError, setLastError] = useState<Error | null>(null);
  const [retryAvailable, setRetryAvailable] = useState(false);

  // REFS FOR MUTABLE VALUES
  // Class equivalent: this.retryCount = 0
  // useRef persists values across renders without causing re-renders
  const retryCountRef = useRef(0);
  const maxRetriesRef = useRef(3);
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

  // USE CUSTOM HOOKS
  // The useTheme hook handles all theme service integration automatically
  // This replaces the manual theme listener setup and ensures proper reactivity
  const { currentTheme } = useTheme(services.theme, errorHandler);

  // The usePageContext hook handles page context service integration automatically
  // This replaces manual subscription setup and provides automatic cleanup
  const { pageContext, isStudioPage, pageId, pageName, pageRoute } = usePageContext(services.pageContext, errorHandler);

  // The useSettings hook handles settings persistence automatically
  // Loads settings on mount and provides easy update mechanism
  const {
    value: pluginConfig,
    setValue: setPluginConfig,
    isLoading: configLoading,
    error: configError
  } = useSettings(services.settings, 'plugin_template_config', {}, errorHandler);

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
   *
   * NOTE: Core services are now handled by custom hooks:
   * - Theme service: useTheme hook (automatic reactivity and cleanup)
   * - Page context: usePageContext hook (automatic subscription and cleanup)
   * - Settings: useSettings hook (automatic loading and persistence)
   *
   * This function is now primarily for initializing any additional custom services
   * your plugin may need that don't have dedicated hooks yet.
   */
  const initializeServices = useCallback(async (): Promise<void> => {
    // Theme service is handled by useTheme hook - no manual setup needed!
    // Page context service is handled by usePageContext hook - no manual setup needed!
    // Settings service is handled by useSettings hook - no manual setup needed!

    // TODO: Initialize any additional custom services your plugin needs here
    // Example:
    // await errorHandler.safeAsync(async () => {
    //   if (services.api) {
    //     // Initialize custom API connections
    //   }
    // }, undefined, ErrorStrategy.FALLBACK);

    console.log('PluginTemplateFunctional: All services initialized');
  }, [errorHandler]); // Dependencies: values used in the function

  /**
   * Clean up services and listeners with error handling
   * Class equivalent: private cleanupServices(): void { ... }
   *
   * NOTE: Core service cleanup is now handled by custom hooks automatically:
   * - Theme service: useTheme hook cleanup
   * - Page context: usePageContext hook cleanup
   * - Settings: useSettings hook (no cleanup needed)
   *
   * This function is now primarily for cleaning up any additional custom services.
   */
  const cleanupServices = useCallback((): void => {
    // Theme service cleanup is handled by useTheme hook - no manual cleanup needed!
    // Page context cleanup is handled by usePageContext hook - no manual cleanup needed!
    // Settings service has no cleanup requirements

    // TODO: Clean up any additional custom services your plugin initialized
    // Example:
    // errorHandler.safeSync(() => {
    //   if (customServiceRef.current) {
    //     customServiceRef.current.cleanup();
    //   }
    // });

    // Reset error handler state
    errorHandler.resetErrorCounts();
    console.log('PluginTemplateFunctional: All services cleaned up successfully');
  }, [errorHandler]);

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
    // Page context is now available from usePageContext hook
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
