import { useState, useEffect, useRef } from 'react';
import { PageContextService } from '../types';
import { ErrorHandler } from '../utils/errorHandling';

/**
 * Page Context Interface
 */
export interface PageContext {
  pageId: string;
  pageName: string;
  pageRoute: string;
  isStudioPage: boolean;
}

/**
 * usePageContext Hook
 *
 * Custom hook for integrating with BrainDrive's page context service.
 * Automatically subscribes to page context changes and handles cleanup.
 *
 * @param pageContextService - The BrainDrive page context service from props.services
 * @param errorHandler - Optional error handler for safe operations
 * @returns Current page context and availability status
 *
 * @example
 * ```tsx
 * const PluginComponent: React.FC<PluginProps> = ({ services }) => {
 *   const { pageContext, isAvailable } = usePageContext(services.pageContext);
 *
 *   if (!isAvailable) {
 *     return <div>Page context not available</div>;
 *   }
 *
 *   return (
 *     <div>
 *       <h3>Current Page: {pageContext?.pageName}</h3>
 *       <p>Route: {pageContext?.pageRoute}</p>
 *       <p>Is Studio: {pageContext?.isStudioPage ? 'Yes' : 'No'}</p>
 *     </div>
 *   );
 * };
 * ```
 */
export function usePageContext(
  pageContextService?: PageContextService,
  errorHandler?: ErrorHandler
) {
  const [pageContext, setPageContext] = useState<PageContext | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!pageContextService) {
      console.warn('usePageContext: Page context service not available');
      return;
    }

    const initPageContext = () => {
      try {
        // Get initial page context
        const context = errorHandler
          ? errorHandler.safeSync(
              () => pageContextService.getCurrentPageContext(),
              null
            )
          : pageContextService.getCurrentPageContext();

        setPageContext(context);

        // Subscribe to page context changes
        unsubscribeRef.current = pageContextService.onPageContextChange(
          (newContext) => {
            if (errorHandler) {
              errorHandler.safeSync(() => {
                setPageContext(newContext);
                console.log('usePageContext: Page context changed:', newContext);
              });
            } else {
              setPageContext(newContext);
              console.log('usePageContext: Page context changed:', newContext);
            }
          }
        );

        console.log('usePageContext: Page context service initialized');
      } catch (error) {
        console.error('usePageContext: Failed to initialize:', error);
      }
    };

    initPageContext();

    // Cleanup function - runs on unmount
    return () => {
      if (unsubscribeRef.current) {
        try {
          unsubscribeRef.current();
          unsubscribeRef.current = null;
          console.log('usePageContext: Page context service cleaned up');
        } catch (error) {
          console.error('usePageContext: Failed to cleanup:', error);
        }
      }
    };
  }, [pageContextService, errorHandler]);

  return {
    pageContext,
    isAvailable: !!pageContextService,
    isStudioPage: pageContext?.isStudioPage || false,
    pageId: pageContext?.pageId || null,
    pageName: pageContext?.pageName || null,
    pageRoute: pageContext?.pageRoute || null
  };
}

export default usePageContext;
