import { useState, useCallback, useRef } from 'react';
import {
  ErrorHandler,
  PluginError,
  ErrorStrategy,
  ErrorUtils
} from '../utils/errorHandling';

/**
 * Error State Interface
 */
export interface ErrorState {
  error: string | null;
  lastError: Error | null;
  retryAvailable: boolean;
  retryCount: number;
}

/**
 * useErrorHandler Hook
 *
 * Custom hook for comprehensive error handling in functional components.
 * Provides error state management, retry logic, and integration with ErrorHandler utility.
 *
 * @param maxRetries - Maximum number of retry attempts (default: 3)
 * @param config - Error handler configuration
 * @returns Error state and handling functions
 *
 * @example
 * ```tsx
 * const PluginComponent: React.FC = () => {
 *   const {
 *     error,
 *     retryAvailable,
 *     handleError,
 *     handleRetry,
 *     clearError,
 *     safeAsync
 *   } = useErrorHandler(3);
 *
 *   const fetchData = async () => {
 *     await safeAsync(async () => {
 *       const response = await fetch('/api/data');
 *       const data = await response.json();
 *       return data;
 *     }, ErrorStrategy.RETRY);
 *   };
 *
 *   if (error) {
 *     return (
 *       <div>
 *         <p>Error: {error}</p>
 *         {retryAvailable && <button onClick={handleRetry}>Retry</button>}
 *       </div>
 *     );
 *   }
 * };
 * ```
 */
export function useErrorHandler(
  maxRetries: number = 3,
  config?: {
    retryDelay?: number;
    enableLogging?: boolean;
    enableReporting?: boolean;
    userNotification?: boolean;
    context?: {
      component?: string;
      pluginId?: string;
      moduleId?: string;
      [key: string]: any;
    };
  }
) {
  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    lastError: null,
    retryAvailable: false,
    retryCount: 0
  });

  const retryCountRef = useRef(0);
  const maxRetriesRef = useRef(maxRetries);
  const retryCallbackRef = useRef<(() => Promise<void>) | null>(null);

  // Initialize error handler
  const errorHandlerRef = useRef<ErrorHandler>(
    new ErrorHandler(
      {
        maxRetries,
        retryDelay: config?.retryDelay || 1000,
        enableLogging: config?.enableLogging !== false,
        enableReporting: config?.enableReporting !== false,
        userNotification: config?.userNotification !== false,
        fallbackValues: {}
      },
      config?.context || {}
    )
  );

  /**
   * Handle an error
   */
  const handleError = useCallback(
    (error: unknown, context?: string, allowRetry: boolean = true) => {
      const normalizedError = ErrorUtils.normalizeError(error);
      const pluginError =
        normalizedError instanceof PluginError
          ? normalizedError
          : new PluginError(
              context
                ? `Error in ${context}: ${normalizedError.message}`
                : normalizedError.message,
              'COMPONENT_ERROR',
              { context, originalError: normalizedError },
              true
            );

      console.error('useErrorHandler: Error occurred:', pluginError);

      setErrorState({
        error: ErrorUtils.getUserMessage(pluginError),
        lastError: pluginError,
        retryAvailable: allowRetry && retryCountRef.current < maxRetriesRef.current,
        retryCount: retryCountRef.current
      });
    },
    []
  );

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setErrorState({
      error: null,
      lastError: null,
      retryAvailable: false,
      retryCount: retryCountRef.current
    });
  }, []);

  /**
   * Reset error handler (clears retry count)
   */
  const resetErrorHandler = useCallback(() => {
    retryCountRef.current = 0;
    retryCallbackRef.current = null;
    errorHandlerRef.current.resetErrorCounts();
    clearError();
  }, [clearError]);

  /**
   * Handle retry
   */
  const handleRetry = useCallback(async () => {
    if (retryCountRef.current >= maxRetriesRef.current) {
      console.warn('useErrorHandler: Max retries exceeded');
      setErrorState((prev) => ({ ...prev, retryAvailable: false }));
      return false;
    }

    retryCountRef.current++;
    console.log(
      `useErrorHandler: Retry attempt ${retryCountRef.current}/${maxRetriesRef.current}`
    );

    clearError();

    // Execute retry callback if available
    if (retryCallbackRef.current) {
      try {
        await retryCallbackRef.current();
        return true;
      } catch (error) {
        handleError(error, 'retry');
        return false;
      }
    }

    return true;
  }, [clearError, handleError]);

  /**
   * Safe async wrapper with automatic error handling
   */
  const safeAsync = useCallback(
    async <T,>(
      fn: () => Promise<T>,
      strategy: ErrorStrategy = ErrorStrategy.RETRY,
      retryCallback?: () => Promise<void>
    ): Promise<T | null> => {
      // Store retry callback for manual retries
      if (retryCallback) {
        retryCallbackRef.current = retryCallback;
      }

      try {
        const result = await errorHandlerRef.current.safeAsync(
          fn,
          undefined,
          strategy
        );
        return result;
      } catch (error) {
        handleError(error, 'safeAsync', strategy === ErrorStrategy.RETRY);
        return null;
      }
    },
    [handleError]
  );

  /**
   * Safe sync wrapper with automatic error handling
   */
  const safeSync = useCallback(
    <T,>(fn: () => T, fallback?: T): T | undefined => {
      try {
        return errorHandlerRef.current.safeSync(fn, fallback);
      } catch (error) {
        handleError(error, 'safeSync', false);
        return fallback;
      }
    },
    [handleError]
  );

  /**
   * Validate data with error handling
   */
  const validate = useCallback(
    <T,>(
      data: T,
      validators: Array<(data: T) => true | string>,
      context?: string
    ): T | null => {
      try {
        return errorHandlerRef.current.validate(data, validators, context);
      } catch (error) {
        handleError(error, 'validation', false);
        return null;
      }
    },
    [handleError]
  );

  /**
   * Get error statistics
   */
  const getErrorStats = useCallback(() => {
    return errorHandlerRef.current.getErrorStats();
  }, []);

  return {
    // Error state
    error: errorState.error,
    lastError: errorState.lastError,
    retryAvailable: errorState.retryAvailable,
    retryCount: errorState.retryCount,

    // Error handling methods
    handleError,
    clearError,
    resetErrorHandler,
    handleRetry,

    // Safe wrappers
    safeAsync,
    safeSync,
    validate,

    // Statistics
    getErrorStats,

    // Direct access to error handler (for advanced use)
    errorHandler: errorHandlerRef.current
  };
}

export default useErrorHandler;
