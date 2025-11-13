import React from 'react';
import { Services } from '../../../types';
import { usePageContext } from '../../../hooks';
import CodeExample from '../CodeExample';
import ResultDisplay from '../ResultDisplay';
import { ErrorHandler } from '../../../utils/errorHandling';
import './PageContextServiceTab.css';

interface PageContextServiceTabProps {
  services: Services;
  errorHandler: ErrorHandler;
}

export const PageContextServiceTab: React.FC<PageContextServiceTabProps> = ({ services, errorHandler }) => {
  const { pageContext, isStudioPage, pageId, pageName, pageRoute, isAvailable } = usePageContext(services.pageContext, errorHandler);

  if (!isAvailable) {
    return (
      <div className="page-context-service-tab">
        <div className="service-unavailable">
          <h3>⚠️ Page Context Service Unavailable</h3>
          <p>The page context service is not available in this environment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-context-service-tab">
      <div className="showcase-intro">
        <h2>📍 Page Context Service - Know Where You Are</h2>
        <p>
          The Page Context Service provides information about the current page and navigation state.
          Use it to create page-aware features and conditional UI elements.
        </p>
      </div>

      {/* Example 1: Current Page Info */}
      <div className="showcase-example">
        <h3>Example 1: Current Page Information</h3>
        <p>Access detailed information about the current page in real-time.</p>

        <div className="demo-section">
          <div className="page-info-grid">
            <div className="info-card">
              <span className="info-icon">🆔</span>
              <div className="info-content">
                <span className="info-label">Page ID</span>
                <span className="info-value">{pageId || 'Not available'}</span>
              </div>
            </div>

            <div className="info-card">
              <span className="info-icon">📄</span>
              <div className="info-content">
                <span className="info-label">Page Name</span>
                <span className="info-value">{pageName || 'Not available'}</span>
              </div>
            </div>

            <div className="info-card">
              <span className="info-icon">🛣️</span>
              <div className="info-content">
                <span className="info-label">Route</span>
                <span className="info-value">{pageRoute || 'Not available'}</span>
              </div>
            </div>

            <div className={`info-card ${isStudioPage ? 'studio-mode' : ''}`}>
              <span className="info-icon">{isStudioPage ? '🎨' : '📖'}</span>
              <div className="info-content">
                <span className="info-label">Mode</span>
                <span className="info-value">{isStudioPage ? 'Studio Page' : 'Regular Page'}</span>
              </div>
            </div>
          </div>

          <ResultDisplay
            title="Full Page Context"
            data={pageContext}
            variant="info"
          />

          <p className="demo-hint">
            💡 <strong>Try it:</strong> Navigate to different pages in BrainDrive and watch these values update automatically!
          </p>
        </div>

        <CodeExample
          title="Get current page context"
          code={`
import { usePageContext } from './hooks';

const MyPlugin: React.FC<PluginProps> = ({ services }) => {
  const {
    pageContext,
    isStudioPage,
    pageId,
    pageName,
    pageRoute
  } = usePageContext(services.pageContext);

  return (
    <div>
      <h3>Current Page: {pageName}</h3>
      <p>Page ID: {pageId}</p>
      <p>Route: {pageRoute}</p>
      <p>Is Studio: {isStudioPage ? 'Yes' : 'No'}</p>
    </div>
  );
};
          `}
        />
      </div>

      {/* Example 2: Conditional Rendering */}
      <div className="showcase-example">
        <h3>Example 2: Conditional Rendering Based on Page</h3>
        <p>Show different content based on where the user is in the application.</p>

        <div className="demo-section">
          {isStudioPage ? (
            <div className="conditional-demo studio-only">
              <h4>🎨 Studio-Only Feature</h4>
              <p>This content only appears when you're in the Studio (editing mode).</p>
              <ul>
                <li>Advanced editing controls</li>
                <li>Developer tools</li>
                <li>Preview options</li>
              </ul>
            </div>
          ) : (
            <div className="conditional-demo regular-page">
              <h4>📖 Regular Page Feature</h4>
              <p>This content appears on regular pages (viewing mode).</p>
              <ul>
                <li>Reading experience optimized</li>
                <li>Simplified interface</li>
                <li>Focus on content</li>
              </ul>
            </div>
          )}
        </div>

        <CodeExample
          title="Conditional rendering"
          code={`
const { isStudioPage } = usePageContext(services.pageContext);

return (
  <div>
    {isStudioPage ? (
      <StudioOnlyFeatures />
    ) : (
      <RegularPageFeatures />
    )}
  </div>
);

// Or use it for feature flags
{isStudioPage && (
  <div className="advanced-controls">
    <button>Advanced Options</button>
  </div>
)}
          `}
        />
      </div>

      {/* Example 3: React to Navigation */}
      <div className="showcase-example">
        <h3>Example 3: React to Page Changes</h3>
        <p>Perform actions when the user navigates to different pages.</p>

        <CodeExample
          title="Listening for page changes"
          code={`
import { useEffect } from 'react';
import { usePageContext } from './hooks';

const MyPlugin: React.FC<PluginProps> = ({ services }) => {
  const { pageContext, pageId } = usePageContext(services.pageContext);

  useEffect(() => {
    if (!pageContext) return;

    console.log('Page changed:', pageContext.pageName);

    // Load page-specific data
    loadDataForPage(pageContext.pageId);

    // Update plugin state based on new page
    if (pageContext.isStudioPage) {
      enableAdvancedFeatures();
    } else {
      disableAdvancedFeatures();
    }
  }, [pageId]); // Re-run when page ID changes

  return <div>Plugin content</div>;
};
          `}
        />
      </div>

      {/* Example 4: Page-Specific URLs */}
      <div className="showcase-example">
        <h3>Example 4: Build Page-Specific URLs</h3>
        <p>Construct URLs dynamically based on the current page context.</p>

        <CodeExample
          title="Dynamic URL construction"
          code={`
const { pageId, pageRoute } = usePageContext(services.pageContext);

// Build edit URL
const editUrl = \`/pages/\${pageId}/edit\`;

// Build API URLs
const pageDataUrl = \`/api/pages/\${pageId}\`;
const pageCommentsUrl = \`/api/pages/\${pageId}/comments\`;

// Navigate programmatically
const goToPage = (newPageId: string) => {
  window.location.href = \`/pages/\${newPageId}\`;
};

// Check if on specific page
const isOnNotesPage = pageRoute.includes('/notes');
const isOnSettingsPage = pageRoute.includes('/settings');
          `}
        />
      </div>

      {/* Manual Implementation */}
      <div className="showcase-example">
        <h3>Advanced: Manual Page Context (Without Hook)</h3>
        <p>For advanced use cases, access the service directly.</p>

        <CodeExample
          title="Manual page context access"
          code={`
import { useState, useEffect } from 'react';

const MyPlugin: React.FC<PluginProps> = ({ services }) => {
  const [pageContext, setPageContext] = useState(null);

  useEffect(() => {
    if (!services.pageContext) return;

    // Get initial context
    const context = services.pageContext.getCurrentPageContext();
    setPageContext(context);

    // Subscribe to changes
    const unsubscribe = services.pageContext.onPageContextChange((newContext) => {
      setPageContext(newContext);
      console.log('Navigated to:', newContext.pageName);
    });

    // Cleanup
    return () => {
      unsubscribe();
    };
  }, [services.pageContext]);

  return <div>Current page: {pageContext?.pageName}</div>;
};
          `}
        />
      </div>

      {/* Best Practices */}
      <div className="showcase-tips">
        <h3>💡 Best Practices</h3>
        <ul>
          <li><strong>Use the hook:</strong> <code>usePageContext</code> handles subscriptions automatically</li>
          <li><strong>Check isAvailable:</strong> Service might not be available in all contexts</li>
          <li><strong>Use pageId for reactions:</strong> Trigger effects when pageId changes</li>
          <li><strong>Studio detection:</strong> Use <code>isStudioPage</code> for conditional features</li>
          <li><strong>Don't hardcode routes:</strong> Use pageRoute for navigation logic</li>
          <li><strong>Performance:</strong> Avoid heavy operations on every page change</li>
        </ul>
      </div>
    </div>
  );
};

export default PageContextServiceTab;
