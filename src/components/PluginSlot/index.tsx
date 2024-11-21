import React, { Suspense, useEffect, useState } from 'react';
import { usePlugins } from '../../core/PluginContext';
import { Plugin, PluginLocation } from '../../mocks/api';
import './styles.css';

interface PluginSlotProps {
  location: PluginLocation;
  productId?: string; // Optional: For product-specific plugins
  className?: string;
}

const PluginSlot: React.FC<PluginSlotProps> = ({ 
  location, 
  productId,
  className = ''
}) => {
  const { components, enabledPlugins } = usePlugins();
  const [locationPlugins, setLocationPlugins] = useState<Plugin[]>([]);

  useEffect(() => {
    // Filter plugins for this location
    const plugins = enabledPlugins.filter(
      plugin => plugin.enabled && plugin.locations.includes(location)
    );
    setLocationPlugins(plugins);
  }, [enabledPlugins, location]);

  const renderPlugin = (plugin: Plugin) => {
    const Component = components.get(plugin.entryPoint);
    if (!Component) {
      console.warn(`Component ${plugin.entryPoint} not found`);
      return null;
    }

    return (
      <div key={plugin.id} className="plugin-slot-item">
        <ErrorBoundary>
          <Suspense fallback={<PluginLoadingState />}>
            <Component 
              {...plugin.config} 
              productId={productId}
            />
          </Suspense>
        </ErrorBoundary>
      </div>
    );
  };

  if (locationPlugins.length === 0) {
    return null;
  }

  return (
    <div className={`plugin-slot plugin-slot-${location} ${className}`.trim()}>
      {locationPlugins.map(renderPlugin)}
    </div>
  );
};

// Loading State Component
const PluginLoadingState: React.FC = () => (
  <div className="plugin-loading">
    <div className="plugin-loading-spinner"></div>
    <span>Loading plugin...</span>
  </div>
);

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Plugin Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="plugin-error">
          <span>⚠️ Plugin failed to load</span>
        </div>
      );
    }

    return this.props.children;
  }
}

export default PluginSlot;
