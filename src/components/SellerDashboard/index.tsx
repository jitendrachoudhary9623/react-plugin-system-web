import React, { useState } from 'react';
import { usePlugins } from '../../core/PluginContext';
import { Plugin, PluginLocation } from '../../mocks/api';
import { PluginConfigField } from '../../core/PluginManager';
import './styles.css';

interface LocationGroup {
  name: string;
  locations: PluginLocation[];
  description: string;
}

const locationGroups: LocationGroup[] = [
  {
    name: 'Layout',
    locations: ['header', 'footer', 'sidebar'],
    description: 'Plugins that appear in the main layout areas'
  },
  {
    name: 'Home Page',
    locations: ['home-banner', 'home-featured'],
    description: 'Plugins for the home page sections'
  },
  {
    name: 'Product Pages',
    locations: ['product-list', 'product-detail', 'product-gallery', 'product-badges', 'product-customization'],
    description: 'Plugins for product listing and detail pages'
  },
  {
    name: 'Shopping',
    locations: ['cart-summary', 'checkout'],
    description: 'Plugins for cart and checkout process'
  }
];

interface ConfigEditorProps {
  pluginId: string;
  fields: PluginConfigField[];
  onUpdate: (key: string, value: any) => void;
}

const ConfigEditor: React.FC<ConfigEditorProps> = ({ pluginId, fields, onUpdate }) => {
  const handleChange = (field: PluginConfigField, value: any) => {
    onUpdate(field.key, value);
  };

  const renderField = (field: PluginConfigField) => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={field.value}
            onChange={(e) => handleChange(field, e.target.value)}
          />
        );
      case 'number':
        return (
          <input
            type="number"
            value={field.value}
            min={field.validation?.min}
            max={field.validation?.max}
            onChange={(e) => handleChange(field, Number(e.target.value))}
          />
        );
      case 'boolean':
        return (
          <input
            type="checkbox"
            checked={field.value}
            onChange={(e) => handleChange(field, e.target.checked)}
          />
        );
      case 'color':
        return (
          <input
            type="color"
            value={field.value}
            onChange={(e) => handleChange(field, e.target.value)}
          />
        );
      case 'select':
        return (
          <select
            value={field.value}
            onChange={(e) => handleChange(field, e.target.value)}
          >
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      default:
        return null;
    }
  };

  return (
    <div className="config-editor">
      {fields.map((field) => (
        <div key={field.key} className="config-field">
          <label>
            {field.label}
            {field.validation?.required && <span className="required">*</span>}
          </label>
          {renderField(field)}
          {field.description && (
            <span className="field-description">{field.description}</span>
          )}
        </div>
      ))}
    </div>
  );
};

const PluginCard: React.FC<{
  plugin: Plugin;
  onToggle: () => void;
  onConfigUpdate: (key: string, value: any) => void;
}> = ({ plugin, onToggle, onConfigUpdate }) => {
  const { getConfigFields, components } = usePlugins();
  const configFields = getConfigFields(plugin.id);
  const PluginComponent = components.get(plugin.entryPoint);

  return (
    <div className="plugin-card">
      <div className="plugin-header">
        <h3>{plugin.name}</h3>
        <label className="switch">
          <input
            type="checkbox"
            checked={plugin.enabled}
            onChange={onToggle}
          />
          <span className="slider"></span>
        </label>
      </div>
      <p className="plugin-description">{plugin.description}</p>
      
      <div className="plugin-locations">
        <h4>Available Locations:</h4>
        <div className="location-tags">
          {plugin.locations.map((location) => (
            <span key={location} className="location-tag">
              {location}
            </span>
          ))}
        </div>
      </div>

      <div className="plugin-content">
        <div className="plugin-config-section">
          <h4>Configuration</h4>
          <ConfigEditor
            pluginId={plugin.id}
            fields={configFields}
            onUpdate={onConfigUpdate}
          />
        </div>

        {PluginComponent && (
          <div className="plugin-preview-section">
            <h4>Preview</h4>
            <div className="preview-container">
              <PluginComponent 
                {...plugin.config} 
                pluginId={plugin.id}
                isSellerView={true}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SellerDashboard: React.FC<{ sellerId: string }> = ({ sellerId }) => {
  const { enabledPlugins, loading, error, togglePlugin, updateConfigField } = usePlugins();
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="seller-dashboard loading">
        <div className="loading-spinner"></div>
        <p>Loading plugins...</p>
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

  return (
    <div className="seller-dashboard">
      <div className="dashboard-header">
        <h1>Plugin Management</h1>
        <p>Enable, disable, and configure plugins for your store</p>
      </div>

      <div className="location-groups">
        <div className="group-tabs">
          <button
            className={`group-tab ${selectedGroup === null ? 'active' : ''}`}
            onClick={() => setSelectedGroup(null)}
          >
            All Plugins
          </button>
          {locationGroups.map(group => (
            <button
              key={group.name}
              className={`group-tab ${selectedGroup === group.name ? 'active' : ''}`}
              onClick={() => setSelectedGroup(group.name)}
            >
              {group.name}
            </button>
          ))}
        </div>

        {selectedGroup && (
          <div className="group-content">
            <div className="group-description">
              {locationGroups.find(g => g.name === selectedGroup)?.description}
            </div>
            <div className="plugins-grid">
              {enabledPlugins
                .filter(plugin => 
                  plugin.locations.some(loc => 
                    locationGroups
                      .find(g => g.name === selectedGroup)
                      ?.locations.includes(loc)
                  )
                )
                .map(plugin => (
                  <PluginCard
                    key={plugin.id}
                    plugin={plugin}
                    onToggle={() => togglePlugin(sellerId, plugin.id)}
                    onConfigUpdate={(key, value) => updateConfigField(plugin.id, key, value)}
                  />
                ))}
            </div>
          </div>
        )}

        {!selectedGroup && (
          <div className="all-plugins">
            <div className="plugins-grid">
              {enabledPlugins.map(plugin => (
                <PluginCard
                  key={plugin.id}
                  plugin={plugin}
                  onToggle={() => togglePlugin(sellerId, plugin.id)}
                  onConfigUpdate={(key, value) => updateConfigField(plugin.id, key, value)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
