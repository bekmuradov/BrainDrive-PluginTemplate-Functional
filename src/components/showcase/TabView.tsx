import React, { useState } from 'react';
import './TabView.css';

export interface Tab {
  id: string;
  label: string;
  icon?: string;
  content: React.ReactNode;
}

interface TabViewProps {
  tabs: Tab[];
  defaultTab?: string;
}

/**
 * TabView Component
 *
 * Provides a clean tabbed interface for showcasing different service bridges.
 * Each tab displays interactive examples with code snippets.
 */
export const TabView: React.FC<TabViewProps> = ({ tabs, defaultTab }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const currentTab = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="tab-view">
      {/* Tab Navigation */}
      <div className="tab-nav">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon && <span className="tab-icon">{tab.icon}</span>}
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {currentTab?.content}
      </div>
    </div>
  );
};

export default TabView;
