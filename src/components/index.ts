/**
 * BrainDrive Plugin Components
 *
 * Reusable React components for BrainDrive plugins.
 * These components handle common UI patterns like error display,
 * loading states, and settings configuration.
 */

// NOTE: ErrorBoundary remains a class component as React Error Boundaries
// must be class components (there's no hooks equivalent yet)
export { default as ErrorBoundary, withErrorBoundary, useErrorHandler as useErrorHandlerHook } from './ErrorBoundary';

export { default as ErrorDisplay } from './ErrorDisplay';
export type { ErrorInfo } from './ErrorDisplay';

export { default as LoadingSpinner } from './LoadingSpinner';

export { default as SettingsExample } from './SettingsExample';
