import { useState, useEffect, useCallback, useRef } from 'react';
import { PluginStateService } from '../types';
import { ErrorHandler, ErrorStrategy, ErrorSeverity } from '../utils/errorHandling';

interface UsePluginStateReturn<T = any> {
  state: T | null;
  isLoading: boolean;
  error: string | null;
  saveState: (newState: T) => Promise<void>;
  clearState: () => Promise<void>;
  isAvailable: boolean;
}

/**
 * Custom hook for managing plugin state with BrainDrive's PluginState service
 *
 * Provides persistent key-value storage scoped to your plugin with automatic
 * state management, loading states, and error handling.
 *
 * @param service - The PluginState service from BrainDrive
 * @param errorHandler - Optional error handler for custom error processing
 * @param autoLoad - Whether to automatically load state on mount (default: true)
 *
 * @example
 * ```tsx
 * const { state, saveState, clearState, isLoading } = usePluginState(
 *   services.pluginState,
 *   errorHandler
 * );
 *
 * // Save state
 * await saveState({ counter: 42, lastVisit: Date.now() });
 *
 * // Clear state
 * await clearState();
 * ```
 */
export function usePluginState<T = any>(
  service: PluginStateService | undefined,
  errorHandler?: ErrorHandler,
  autoLoad: boolean = true
): UsePluginStateReturn<T> {
  const [state, setState] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  const isAvailable = !!service;

  // Load state on mount if autoLoad is enabled
  useEffect(() => {
    if (!service || !autoLoad) return;

    const loadState = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const loadedState = await service.getState();

        if (isMountedRef.current) {
          setState(loadedState);
        }
      } catch (err: any) {
        const errorMessage = err?.message || 'Failed to load plugin state';
        if (isMountedRef.current) {
          setError(errorMessage);
        }
        if (errorHandler) {
          errorHandler.handleError(err, ErrorStrategy.RETRY, ErrorSeverity.MEDIUM);
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    loadState();
  }, [service, autoLoad, errorHandler]);

  // Subscribe to state change events
  useEffect(() => {
    if (!service) return;

    const cleanupFns: Array<() => void> = [];

    // Subscribe to save events
    if (service.onSave) {
      const unsubscribeSave = service.onSave((savedState) => {
        if (isMountedRef.current) {
          setState(savedState);
        }
      });
      cleanupFns.push(unsubscribeSave);
    }

    // Subscribe to restore events
    if (service.onRestore) {
      const unsubscribeRestore = service.onRestore((restoredState) => {
        if (isMountedRef.current) {
          setState(restoredState);
        }
      });
      cleanupFns.push(unsubscribeRestore);
    }

    // Subscribe to clear events
    if (service.onClear) {
      const unsubscribeClear = service.onClear(() => {
        if (isMountedRef.current) {
          setState(null);
        }
      });
      cleanupFns.push(unsubscribeClear);
    }

    return () => {
      cleanupFns.forEach(fn => fn());
    };
  }, [service]);

  // Save state function
  const saveState = useCallback(async (newState: T) => {
    if (!service) {
      const errorMessage = 'PluginState service is not available';
      setError(errorMessage);
      if (errorHandler) {
        errorHandler.handleError(new Error(errorMessage), ErrorStrategy.FALLBACK, ErrorSeverity.HIGH);
      }
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await service.saveState(newState);

      if (isMountedRef.current) {
        setState(newState);
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to save plugin state';
      if (isMountedRef.current) {
        setError(errorMessage);
      }
      if (errorHandler) {
        errorHandler.handleError(err, ErrorStrategy.RETRY, ErrorSeverity.HIGH);
      }
      throw err; // Re-throw so caller can handle
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [service, errorHandler]);

  // Clear state function
  const clearState = useCallback(async () => {
    if (!service) {
      const errorMessage = 'PluginState service is not available';
      setError(errorMessage);
      if (errorHandler) {
        errorHandler.handleError(new Error(errorMessage), ErrorStrategy.FALLBACK, ErrorSeverity.MEDIUM);
      }
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await service.clearState();

      if (isMountedRef.current) {
        setState(null);
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to clear plugin state';
      if (isMountedRef.current) {
        setError(errorMessage);
      }
      if (errorHandler) {
        errorHandler.handleError(err, ErrorStrategy.RETRY, ErrorSeverity.MEDIUM);
      }
      throw err; // Re-throw so caller can handle
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [service, errorHandler]);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    state,
    isLoading,
    error,
    saveState,
    clearState,
    isAvailable
  };
}
