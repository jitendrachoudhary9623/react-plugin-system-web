import React, { Suspense } from 'react';
import { usePlugins } from '../../core/PluginContext';
import './styles.css';

interface BuyerViewProps {
  productId?: string;
}

const BuyerView: React.FC<BuyerViewProps> = ({ productId = '1' }) => {
  const { components, enabledPlugins } = usePlugins();

  const renderPlugin = (plugin: any) => {
    if (!plugin.enabled) return null;

    const Component = components.get(plugin.entryPoint);
    if (!Component) {
      console.warn(`Component ${plugin.entryPoint} not found`);
      return null;
    }

    return (
      <div key={plugin.id} className="plugin-wrapper">
        <ErrorBoundary>
          <Suspense fallback={<div className="plugin-loading">Loading plugin...</div>}>
            <Component productId={productId} />
          </Suspense>
        </ErrorBoundary>
      </div>
    );
  };

  if (!enabledPlugins.length) {
    return (
      <div className="buyer-view">
        <h1>Welcome to Our Store</h1>
        <div className="no-plugins">No plugins are currently enabled.</div>
      </div>
    );
  }

  return (
    <div className="buyer-view">
      <h1>Welcome to Our Store</h1>
      <div className="plugins-container">
        {enabledPlugins.map(plugin => renderPlugin(plugin))}
      </div>
    </div>
  );
};

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
          Something went wrong loading this plugin.
        </div>
      );
    }

    return this.props.children;
  }
}

export default BuyerView;
