/**
 * BrainDrive Plugin Hooks
 *
 * Custom React hooks for integrating with BrainDrive services.
 * These hooks encapsulate service logic, handle subscriptions,
 * and provide clean APIs for functional components.
 */

// Service integration hooks
export { useTheme } from './useTheme';
export { usePageContext } from './usePageContext';
export { useSettings, useSettingsWithValidation } from './useSettings';
export { useAPI, useLazyAPI } from './useAPI';
export { useErrorHandler } from './useErrorHandler';

// Re-export types
export type { PageContext } from './usePageContext';
export type { APIRequestState } from './useAPI';
export type { ErrorState } from './useErrorHandler';
