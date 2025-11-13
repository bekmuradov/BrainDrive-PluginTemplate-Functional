import { useState, useEffect, useCallback } from 'react';
import { SettingsService } from '../types';
import { ErrorHandler, ValidationError } from '../utils/errorHandling';

/**
 * useSettings Hook
 *
 * Custom hook for integrating with BrainDrive's settings service.
 * Provides methods to get and set settings with error handling and validation.
 *
 * @param settingsService - The BrainDrive settings service from props.services
 * @param settingKey - The setting key to manage
 * @param defaultValue - Default value if setting doesn't exist
 * @param errorHandler - Optional error handler for safe operations
 * @returns Setting value, loading state, and setter function
 *
 * @example
 * ```tsx
 * const PluginComponent: React.FC<PluginProps> = ({ services }) => {
 *   const {
 *     value: refreshInterval,
 *     setValue: setRefreshInterval,
 *     isLoading,
 *     error
 *   } = useSettings(services.settings, 'plugin_refresh_interval', 60000);
 *
 *   return (
 *     <div>
 *       <label>Refresh Interval (ms):</label>
 *       <input
 *         type="number"
 *         value={refreshInterval}
 *         onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
 *         disabled={isLoading}
 *       />
 *       {error && <p className="error">{error}</p>}
 *     </div>
 *   );
 * };
 * ```
 */
export function useSettings<T = any>(
  settingsService?: SettingsService,
  settingKey?: string,
  defaultValue?: T,
  errorHandler?: ErrorHandler
) {
  const [value, setValue] = useState<T | undefined>(defaultValue);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial setting value
  useEffect(() => {
    if (!settingsService || !settingKey) {
      return;
    }

    const loadSetting = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const savedValue = await settingsService.getSetting?.(settingKey);
        if (savedValue !== undefined && savedValue !== null) {
          setValue(savedValue as T);
        }
        console.log(`useSettings: Loaded setting '${settingKey}':`, savedValue);
      } catch (err) {
        const errorMsg = `Failed to load setting '${settingKey}'`;
        console.error('useSettings:', errorMsg, err);
        setError(errorMsg);
      } finally {
        setIsLoading(false);
      }
    };

    loadSetting();
  }, [settingsService, settingKey]);

  // Memoized function to update setting
  const updateValue = useCallback(
    async (newValue: T) => {
      if (!settingsService || !settingKey) {
        console.warn('useSettings: Cannot update - service or key not available');
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        await settingsService.setSetting?.(settingKey, newValue);
        setValue(newValue);
        console.log(`useSettings: Updated setting '${settingKey}':`, newValue);
        return true;
      } catch (err) {
        const errorMsg = `Failed to save setting '${settingKey}'`;
        console.error('useSettings:', errorMsg, err);

        // Check if it's a "not found" error - provide helpful message
        if (err instanceof Error && err.message.includes('not found')) {
          const helpMsg = `${errorMsg} - Setting '${settingKey}' must be registered in plugin's settingDefinitions in lifecycle_manager.py`;
          setError(helpMsg);
          console.error('useSettings:', helpMsg);
        } else {
          setError(errorMsg);
        }
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [settingsService, settingKey]
  );

  // Get setting value (async)
  const getSetting = useCallback(
    async (key: string): Promise<any> => {
      if (!settingsService) {
        throw new Error('Settings service not available');
      }

      try {
        const value = await settingsService.getSetting?.(key);
        return value;
      } catch (err) {
        console.error(`useSettings: Failed to get setting '${key}':`, err);
        throw err;
      }
    },
    [settingsService]
  );

  // Set setting value (async)
  const setSetting = useCallback(
    async (key: string, value: any): Promise<boolean> => {
      if (!settingsService) {
        console.warn('useSettings: Settings service not available');
        return false;
      }

      try {
        await settingsService.setSetting?.(key, value);
        console.log(`useSettings: Set setting '${key}':`, value);
        return true;
      } catch (err) {
        console.error(`useSettings: Failed to set setting '${key}':`, err);
        return false;
      }
    },
    [settingsService]
  );

  return {
    value,
    setValue: updateValue,
    isLoading,
    error,
    isAvailable: !!settingsService,
    getSetting,
    setSetting
  };
}

/**
 * useSettingsWithValidation Hook
 *
 * Extended version of useSettings with built-in validation.
 *
 * @param settingsService - The BrainDrive settings service
 * @param settingKey - The setting key to manage
 * @param defaultValue - Default value if setting doesn't exist
 * @param validators - Array of validation functions
 * @param errorHandler - Optional error handler
 *
 * @example
 * ```tsx
 * const { value, setValue, isValid, validationError } = useSettingsWithValidation(
 *   services.settings,
 *   'port_number',
 *   3000,
 *   [
 *     (val) => val > 0 || 'Port must be positive',
 *     (val) => val < 65536 || 'Port must be less than 65536'
 *   ]
 * );
 * ```
 */
export function useSettingsWithValidation<T = any>(
  settingsService?: SettingsService,
  settingKey?: string,
  defaultValue?: T,
  validators?: Array<(value: T) => true | string>,
  errorHandler?: ErrorHandler
) {
  const settingsHook = useSettings<T>(
    settingsService,
    settingKey,
    defaultValue,
    errorHandler
  );

  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(true);

  // Validate value
  const validate = useCallback(
    (value: T): boolean => {
      if (!validators || validators.length === 0) {
        setIsValid(true);
        setValidationError(null);
        return true;
      }

      for (const validator of validators) {
        const result = validator(value);
        if (result !== true) {
          setIsValid(false);
          setValidationError(result);
          return false;
        }
      }

      setIsValid(true);
      setValidationError(null);
      return true;
    },
    [validators]
  );

  // Wrapped setValue with validation
  const setValueWithValidation = useCallback(
    async (newValue: T) => {
      if (!validate(newValue)) {
        return false;
      }
      return await settingsHook.setValue(newValue);
    },
    [validate, settingsHook.setValue]
  );

  return {
    ...settingsHook,
    setValue: setValueWithValidation,
    isValid,
    validationError
  };
}

export default useSettings;
