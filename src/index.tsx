import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import PluginManager from './core/PluginManager';

// Import plugin registration functions
import { register as registerDiscountBanner } from './plugins/DiscountBanner';
import { register as registerRecommendationEngine } from './plugins/RecommendationEngine';
import { register as registerTestPlugin } from './plugins/TestPlugin';

// Initialize plugin manager
const pluginManager = PluginManager.getInstance();

// Register all plugins
registerDiscountBanner(pluginManager);
registerRecommendationEngine(pluginManager);
registerTestPlugin(pluginManager);

// Create root element
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Render app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
