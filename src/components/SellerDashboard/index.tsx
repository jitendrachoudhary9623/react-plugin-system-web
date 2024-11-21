import React, { useState } from 'react';
import { usePlugins } from '../../core/PluginContext';
import { Plugin, PluginLocation } from '../../mocks/api';
import './styles.css';

interface SellerDashboardProps {
  sellerId: string;
}

const ConfirmationDialog: React.FC<{
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ onConfirm, onCancel }) => (
  <div className="confirmation-overlay">
    <div className="confirmation-dialog">
      <h3>Reset Plugin Settings</h3>
      <p>
        Are you sure you want to reset all plugin settings to their default state? 
        This action cannot be undone.
      </p>
      <div className="confirmation-actions">
        <button className="cancel-button" onClick={onCancel}>
          Cancel
        </button>
        <button className="confirm-button" onClick={onConfirm}>
          Reset
        </button>
      </div>
    </div>
  </div>
);

const SellerDashboard: React.FC<SellerDashboardProps> = ({ sellerId }) => {
  const { enabledPlugins, loading, error, togglePlugin, refreshPlugins } = usePlugins();
  const [isResetting, setIsResetting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleTogglePlugin = async (pluginId: string) => {
    try {
      await togglePlugin(sellerId, pluginId);
    } catch (err) {
      console.error('Failed to toggle plugin:', err);
    }
  };

  const handleResetConfirm = async () => {
    setShowConfirmation(false);
    setIsResetting(true);
    localStorage.removeItem('store_plugins');
    await refreshPlugins(sellerId);
    setIsResetting(false);
  };

  const handleResetCancel = () => {
    setShowConfirmation(false);
  };

  if (loading || isResetting) {
    return (
      <div className="seller-dashboard loading">
        <div className="loading-spinner"></div>
        <p>{isResetting ? 'Resetting plugins...' : 'Loading plugins...'}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="seller-dashboard error">
        <p>Error loading plugins: {error.message}</p>
      </div>
    );
  }

  // Group plugins by type
  const uiPlugins = enabledPlugins.filter(plugin => plugin.type === 'ui');
  const integrationPlugins = enabledPlugins.filter(plugin => plugin.type === 'integration');

  const renderPluginCard = (plugin: Plugin) => (
    <div key={plugin.id} className="plugin-card">
      <div className="plugin-header">
        <h3>{plugin.name}</h3>
        <label className="switch">
          <input
            type="checkbox"
            checked={plugin.enabled}
            onChange={() => handleTogglePlugin(plugin.id)}
          />
          <span className="slider"></span>
        </label>
      </div>
      <p className="plugin-description">{plugin.description}</p>
      <div className="plugin-meta">
        <div className="plugin-locations">
          {plugin.locations.map((location: PluginLocation) => (
            <span key={location} className="location-tag">
              {location}
            </span>
          ))}
        </div>
        <span className={`plugin-status ${plugin.enabled ? 'enabled' : 'disabled'}`}>
          {plugin.enabled ? 'Enabled' : 'Disabled'}
        </span>
      </div>
      {plugin.config && (
        <div className="plugin-config">
          <h4>Configuration</h4>
          <pre>{JSON.stringify(plugin.config, null, 2)}</pre>
        </div>
      )}
    </div>
  );

  return (
    <div className="seller-dashboard">
      {showConfirmation && (
        <ConfirmationDialog
          onConfirm={handleResetConfirm}
          onCancel={handleResetCancel}
        />
      )}

      <div className="dashboard-header">
        <h1>Plugin Management</h1>
        <p>Enable or disable plugins to customize your store</p>
        <button 
          className="reset-button"
          onClick={() => setShowConfirmation(true)}
          title="Reset all plugin settings to their default state"
        >
          Reset to Defaults
        </button>
      </div>

      <div className="plugins-section">
        <h2>UI Plugins</h2>
        <div className="plugins-grid">
          {uiPlugins.map(renderPluginCard)}
        </div>
      </div>

      <div className="plugins-section">
        <h2>Integration Plugins</h2>
        <div className="plugins-grid">
          {integrationPlugins.map(renderPluginCard)}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
