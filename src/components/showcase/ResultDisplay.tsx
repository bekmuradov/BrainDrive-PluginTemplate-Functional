import React from 'react';
import './ResultDisplay.css';

interface ResultDisplayProps {
  title?: string;
  data?: any;
  error?: string | null;
  loading?: boolean;
  empty?: string;
  variant?: 'default' | 'success' | 'error' | 'info';
}

/**
 * ResultDisplay Component
 *
 * Shows the results of service bridge actions with appropriate styling.
 * Handles loading states, errors, and empty states.
 */
export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  title,
  data,
  error,
  loading = false,
  empty = 'No data to display',
  variant = 'default'
}) => {
  const renderContent = () => {
    if (loading) {
      return (
        <div className="result-loading">
          <span className="result-spinner">⏳</span>
          <span>Loading...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="result-error">
          <span className="result-error-icon">❌</span>
          <div className="result-error-content">
            <strong>Error:</strong>
            <p>{error}</p>
          </div>
        </div>
      );
    }

    if (data === null || data === undefined) {
      return (
        <div className="result-empty">
          <span className="result-empty-icon">📭</span>
          <span>{empty}</span>
        </div>
      );
    }

    // Display data based on type
    if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') {
      return <div className="result-simple">{String(data)}</div>;
    }

    // Display objects/arrays as formatted JSON
    return (
      <pre className="result-json">
        {JSON.stringify(data, null, 2)}
      </pre>
    );
  };

  return (
    <div className={`result-display result-display-${variant}`}>
      {title && <div className="result-display-title">{title}</div>}
      <div className="result-display-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default ResultDisplay;
