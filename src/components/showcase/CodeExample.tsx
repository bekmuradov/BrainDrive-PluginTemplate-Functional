import React, { useState } from 'react';
import './CodeExample.css';

interface CodeExampleProps {
  code: string;
  language?: string;
  title?: string;
  showCopy?: boolean;
}

/**
 * CodeExample Component
 *
 * Displays syntax-highlighted code snippets with copy functionality.
 * Makes it easy for developers to copy and paste working examples.
 */
export const CodeExample: React.FC<CodeExampleProps> = ({
  code,
  language = 'typescript',
  title,
  showCopy = true
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="code-example">
      {title && (
        <div className="code-example-header">
          <span className="code-example-title">{title}</span>
          {showCopy && (
            <button
              className="code-example-copy"
              onClick={handleCopy}
              title="Copy to clipboard"
            >
              {copied ? '✓ Copied!' : '📋 Copy'}
            </button>
          )}
        </div>
      )}
      <pre className={`code-example-pre language-${language}`}>
        <code>{code.trim()}</code>
      </pre>
      {!title && showCopy && (
        <button
          className="code-example-copy code-example-copy-inline"
          onClick={handleCopy}
          title="Copy to clipboard"
        >
          {copied ? '✓' : '📋'}
        </button>
      )}
    </div>
  );
};

export default CodeExample;
