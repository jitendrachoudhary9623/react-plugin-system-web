import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import PluginManager from './core/PluginManager';
import { register as registerDiscountBanner } from './plugins/DiscountBanner';
import { register as registerRecommendationEngine } from './plugins/RecommendationEngine';

// Initialize and register plugins
const pluginManager = PluginManager.getInstance();
registerDiscountBanner(pluginManager);
registerRecommendationEngine(pluginManager);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
