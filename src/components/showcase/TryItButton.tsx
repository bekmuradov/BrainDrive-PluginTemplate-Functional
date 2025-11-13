import React, { useState } from 'react';
import './TryItButton.css';

interface TryItButtonProps {
  onClick: () => void | Promise<void>;
  label?: string;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  disabled?: boolean;
  loading?: boolean;
}

/**
 * TryItButton Component
 *
 * Interactive button for triggering example actions.
 * Shows loading state and provides visual feedback.
 */
export const TryItButton: React.FC<TryItButtonProps> = ({
  onClick,
  label = 'Try It',
  icon = '▶️',
  variant = 'primary',
  disabled = false,
  loading: externalLoading = false
}) => {
  const [internalLoading, setInternalLoading] = useState(false);

  const isLoading = externalLoading || internalLoading;

  const handleClick = async () => {
    if (isLoading || disabled) return;

    setInternalLoading(true);
    try {
      const result = onClick();
      if (result instanceof Promise) {
        await result;
      }
    } catch (error) {
      console.error('TryItButton error:', error);
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <button
      className={`try-it-button try-it-button-${variant} ${isLoading ? 'loading' : ''}`}
      onClick={handleClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <>
          <span className="try-it-spinner">⏳</span>
          <span>Running...</span>
        </>
      ) : (
        <>
          <span className="try-it-icon">{icon}</span>
          <span>{label}</span>
        </>
      )}
    </button>
  );
};

export default TryItButton;
