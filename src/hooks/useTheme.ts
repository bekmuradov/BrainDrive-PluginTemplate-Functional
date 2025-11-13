import { useState, useEffect, useRef, useCallback } from 'react';
import { ThemeService } from '../types';
import { ErrorHandler, ErrorStrategy } from '../utils/errorHandling';

/**
 * useTheme Hook
 *
 * Custom hook for integrating with BrainDrive's theme service.
 * Automatically subscribes to theme changes and handles cleanup.
 *
 * @param themeService - The BrainDrive theme service from props.services
 * @param errorHandler - Optional error handler for safe operations
 * @returns Current theme and theme control functions
 *
 * @example
 * ```tsx
 * const PluginComponent: React.FC<PluginProps> = ({ services }) => {
 *   const { currentTheme, setTheme, toggleTheme } = useTheme(services.theme);
 *
 *   return (
 *     <div className={`plugin ${currentTheme === 'dark' ? 'dark-theme' : ''}`}>
 *       <button onClick={toggleTheme}>Toggle Theme</button>
 *     </div>
 *   );
 * };
 * ```
 */
export function useTheme(themeService?: ThemeService, errorHandler?: ErrorHandler) {
  const [currentTheme, setCurrentTheme] = useState<string>('light');
  const listenerRef = useRef<((theme: string) => void) | null>(null);

  // Initialize theme and set up listener
  useEffect(() => {
    if (!themeService) {
      console.warn('useTheme: Theme service not available');
      return;
    }

    const initTheme = () => {
      try {
        // Get initial theme
        const theme = errorHandler
          ? errorHandler.safeSync(() => themeService.getCurrentTheme(), 'light')
          : themeService.getCurrentTheme();

        setCurrentTheme(theme);

        // Create theme change listener
        listenerRef.current = (newTheme: string) => {
          if (errorHandler) {
            errorHandler.safeSync(() => setCurrentTheme(newTheme));
          } else {
            setCurrentTheme(newTheme);
          }
        };

        // Register listener
        themeService.addThemeChangeListener(listenerRef.current);
        console.log('useTheme: Theme service initialized');
      } catch (error) {
        console.error('useTheme: Failed to initialize theme service:', error);
      }
    };

    initTheme();

    // Cleanup function - runs on unmount
    return () => {
      if (themeService && listenerRef.current) {
        try {
          themeService.removeThemeChangeListener(listenerRef.current);
          listenerRef.current = null;
          console.log('useTheme: Theme service cleaned up');
        } catch (error) {
          console.error('useTheme: Failed to cleanup theme service:', error);
        }
      }
    };
  }, [themeService, errorHandler]); // Re-run if service or error handler changes

  // Memoized function to set theme
  const setTheme = useCallback(
    (theme: string) => {
      if (!themeService) {
        console.warn('useTheme: Cannot set theme - service not available');
        return;
      }

      try {
        themeService.setTheme(theme);
      } catch (error) {
        console.error('useTheme: Failed to set theme:', error);
      }
    },
    [themeService]
  );

  // Memoized function to toggle theme
  const toggleTheme = useCallback(() => {
    if (!themeService) {
      console.warn('useTheme: Cannot toggle theme - service not available');
      return;
    }

    try {
      themeService.toggleTheme();
    } catch (error) {
      console.error('useTheme: Failed to toggle theme:', error);
    }
  }, [themeService]);

  return {
    currentTheme,
    setTheme,
    toggleTheme,
    isAvailable: !!themeService
  };
}

export default useTheme;
