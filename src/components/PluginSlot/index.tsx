import React from 'react';
import { usePlugins } from '../../core/PluginContext';
import { PluginLocation } from '../../mocks/api';
import './styles.css';

interface PluginSlotProps {
  location: PluginLocation;
  [key: string]: any; // Allow any additional props
}

const PluginSlot: React.FC<PluginSlotProps> = ({ location, ...additionalProps }) => {
  const { components, enabledPlugins } = usePlugins();

  // Filter plugins for this location
  const locationPlugins = enabledPlugins.filter(
    plugin => plugin.enabled && plugin.locations.includes(location)
  );

  if (locationPlugins.length === 0) {
    return null; // Don't render empty plugin slots
  }

  return (
    <div className="plugin-slot" data-location={location}>
      {locationPlugins.map(plugin => {
        const PluginComponent = components.get(plugin.entryPoint);
        if (!PluginComponent) {
          console.warn(`Plugin component ${plugin.entryPoint} not found`);
          return null;
        }

        // Merge plugin config with additional props
        const pluginProps = {
          ...plugin.config,
          ...additionalProps,
          pluginId: plugin.id, // Pass plugin ID to component
          pluginName: plugin.name // Pass plugin name to component
        };

        return (
          <React.Suspense
            key={plugin.id}
            fallback={
              <div className="plugin-loading">
                <span className="loading-text">Loading {plugin.name}...</span>
              </div>
            }
          >
            <ErrorBoundary pluginName={plugin.name}>
              <div className="plugin-wrapper" data-plugin-id={plugin.id}>
                <PluginComponent {...pluginProps} />
              </div>
            </ErrorBoundary>
          </React.Suspense>
        );
      })}
    </div>
  );
};

// Error Boundary for Plugin isolation
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; pluginName: string },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; pluginName: string }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`Error in plugin ${this.props.pluginName}:`, error);
    console.error('Component stack:', errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="plugin-error">
          <span className="error-icon">⚠️</span>
          <div className="error-content">
            <div className="error-title">Failed to load {this.props.pluginName}</div>
            {this.state.error && (
              <div className="error-message">{this.state.error.message}</div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default PluginSlot;
