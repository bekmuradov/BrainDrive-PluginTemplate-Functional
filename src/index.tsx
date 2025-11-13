/**
 * BrainDrive Plugin Template (Functional Component) - Entry Point
 *
 * This file exports the main plugin component for Module Federation.
 * The export name must match the module name in lifecycle_manager.py
 */

import PluginTemplateFunctional from './PluginTemplateFunctional';

// Export the main component as default
// This will be loaded by BrainDrive's remote plugin service
export default PluginTemplateFunctional;

// Named export for convenience
export { PluginTemplateFunctional };

// Re-export types for external use if needed
export type { PluginTemplateProps, PluginData } from './types';
