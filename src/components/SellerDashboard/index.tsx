import React from 'react';
import { usePlugins } from '../../core/PluginContext';
import './styles.css';

interface SellerDashboardProps {
  sellerId: string;
}

const SellerDashboard: React.FC<SellerDashboardProps> = ({ sellerId }) => {
  const { enabledPlugins, loading, error, togglePlugin } = usePlugins();

  if (loading) {
    return <div className="dashboard-loading">Loading plugins...</div>;
  }

  if (error) {
    return <div className="dashboard-error">Error loading plugins: {error.message}</div>;
  }

  return (
    <div className="seller-dashboard">
      <h2>Plugin Management</h2>
      <div className="plugins-grid">
        {enabledPlugins.map((plugin) => (
          <div key={plugin.id} className="plugin-card">
            <div className="plugin-header">
              <h3>{plugin.name}</h3>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={plugin.enabled}
                  onChange={() => togglePlugin(sellerId, plugin.id)}
                />
                <span className="slider"></span>
              </label>
            </div>
            <p className="plugin-description">{plugin.description}</p>
            <div className="plugin-meta">
              <span className="plugin-type">Type: {plugin.type}</span>
              <span className={`plugin-status ${plugin.enabled ? 'enabled' : 'disabled'}`}>
                {plugin.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerDashboard;
