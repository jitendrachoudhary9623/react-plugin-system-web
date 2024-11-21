import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import PluginManager from './core/PluginManager';

// Import plugin registration functions
import { register as registerDiscountBanner } from './plugins/DiscountBanner';
import { register as registerRecommendationEngine } from './plugins/RecommendationEngine';
import { register as registerCartSummaryPlugin } from './plugins/CartSummaryPlugin';
import { register as registerUserGreeting } from './plugins/UserGreeting';
import { register as registerMarqueePlugin } from './plugins/MarqueePlugin';

// Initialize plugin manager
const pluginManager = PluginManager.getInstance();

// Register all plugins
registerDiscountBanner(pluginManager);
registerRecommendationEngine(pluginManager);
registerCartSummaryPlugin(pluginManager);
registerUserGreeting(pluginManager);
registerMarqueePlugin(pluginManager);

// Initialize shared data
pluginManager.setSharedData('user', {
  id: 'user-123',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'buyer'
});

pluginManager.setSharedData('cart', {
  items: [
    { id: '1', name: 'Premium Laptop', price: 999.99, quantity: 1 },
    { id: '2', name: 'Wireless Earbuds', price: 149.99, quantity: 2 },
    { id: '3', name: 'Smart Watch', price: 299.99, quantity: 1 }
  ],
  total: 1599.96
});

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
