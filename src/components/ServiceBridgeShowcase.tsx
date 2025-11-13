import React from 'react';
import { Services } from '../types';
import { ErrorHandler } from '../utils/errorHandling';
import {
  TabView,
  OverviewTab,
  ThemeServiceTab,
  APIServiceTab,
  SettingsServiceTab,
  EventServiceTab,
  PageContextServiceTab
} from './showcase';

interface ServiceBridgeShowcaseProps {
  services: Services;
  errorHandler: ErrorHandler;
}

/**
 * ServiceBridgeShowcase Component
 *
 * Main showcase component that demonstrates all service bridges with interactive examples.
 * This component serves as a comprehensive learning resource for plugin developers.
 */
export const ServiceBridgeShowcase: React.FC<ServiceBridgeShowcaseProps> = ({
  services,
  errorHandler
}) => {
  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: '📖',
      content: <OverviewTab services={services} />
    },
    {
      id: 'theme',
      label: 'Theme',
      icon: '🎨',
      content: <ThemeServiceTab services={services} errorHandler={errorHandler} />
    },
    {
      id: 'api',
      label: 'API',
      icon: '🌐',
      content: <APIServiceTab services={services} errorHandler={errorHandler} />
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      content: <SettingsServiceTab services={services} errorHandler={errorHandler} />
    },
    {
      id: 'events',
      label: 'Events',
      icon: '📡',
      content: <EventServiceTab services={services} />
    },
    {
      id: 'context',
      label: 'Page Context',
      icon: '📍',
      content: <PageContextServiceTab services={services} errorHandler={errorHandler} />
    }
  ];

  return (
    <div className="service-bridge-showcase">
      <TabView tabs={tabs} defaultTab="overview" />
    </div>
  );
};

export default ServiceBridgeShowcase;
