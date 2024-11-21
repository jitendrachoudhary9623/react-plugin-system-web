import { PluginConfigField } from '../core/PluginManager';

// Plugin location types
export type PluginLocation = 
  | 'header'
  | 'footer'
  | 'home-banner'
  | 'home-featured'
  | 'product-list'
  | 'product-detail'
  | 'cart-summary'
  | 'checkout'
  | 'sidebar'
  | 'product-gallery'
  | 'product-badges'
  | 'product-customization'
  | 'top-banner';

// Mock API responses
export interface Plugin {
  id: string;
  name: string;
  description: string;
  type: 'ui' | 'integration';
  enabled: boolean;
  entryPoint: string;
  locations: PluginLocation[];
  config?: Record<string, any>;
  configFields?: PluginConfigField[];
}

// Get stored plugins or initialize with defaults
const getStoredPlugins = (): Plugin[] => {
  const stored = localStorage.getItem('store_plugins');
  if (stored) {
    return JSON.parse(stored);
  }

  // Initial plugins configuration
  const initialPlugins: Plugin[] = [
    {
      id: 'marquee-plugin',
      name: 'Marquee Offers',
      description: 'Displays scrolling offers and announcements',
      type: 'ui',
      enabled: true,
      entryPoint: 'MarqueePlugin',
      locations: ['top-banner'],
      config: {
        speed: 30,
        backgroundColor: '#3498db',
        textColor: '#ffffff',
        offers: [
          {
            id: '1',
            text: '🔥 Hot Deal! 50% off on Electronics - Shop Now!',
            link: '/products?category=electronics'
          },
          {
            id: '2',
            text: '🎉 Free Shipping on orders above $50',
            link: '/shipping'
          },
          {
            id: '3',
            text: '🎁 Special Holiday Offers - Limited Time Only',
            link: '/offers'
          },
          {
            id: '4',
            text: '🌟 New Collection Launched - Check it out!',
            link: '/new-arrivals'
          }
        ]
      },
      configFields: [
        {
          type: 'number',
          label: 'Animation Speed',
          key: 'speed',
          value: 30,
          validation: {
            min: 10,
            max: 60
          }
        },
        {
          type: 'color',
          label: 'Background Color',
          key: 'backgroundColor',
          value: '#3498db'
        },
        {
          type: 'color',
          label: 'Text Color',
          key: 'textColor',
          value: '#ffffff'
        }
      ]
    },
    {
      id: 'user-greeting',
      name: 'User Greeting',
      description: 'Displays personalized greeting using shared user data',
      type: 'ui',
      enabled: true,
      entryPoint: 'UserGreeting',
      locations: ['header'],
      config: {
        showName: true,
        greeting: 'Welcome back',
        fontSize: 16,
        textColor: '#2c3e50'
      },
      configFields: [
        {
          type: 'boolean',
          label: 'Show User Name',
          key: 'showName',
          value: true
        },
        {
          type: 'text',
          label: 'Greeting Text',
          key: 'greeting',
          value: 'Welcome back',
          validation: {
            required: true
          }
        },
        {
          type: 'number',
          label: 'Font Size (px)',
          key: 'fontSize',
          value: 16,
          validation: {
            min: 12,
            max: 24
          }
        },
        {
          type: 'color',
          label: 'Text Color',
          key: 'textColor',
          value: '#2c3e50'
        }
      ]
    },
    {
      id: 'cart-summary-plugin',
      name: 'Cart Summary Plugin',
      description: 'Shows cart summary with configurable display options',
      type: 'ui',
      enabled: true,
      entryPoint: 'CartSummaryPlugin',
      locations: ['cart-summary'],
      config: {
        showTax: true,
        showShipping: true,
        theme: 'light',
        accentColor: '#3498db',
        itemLimit: 5
      },
      configFields: [
        {
          type: 'boolean',
          label: 'Show Tax',
          key: 'showTax',
          value: true
        },
        {
          type: 'boolean',
          label: 'Show Shipping',
          key: 'showShipping',
          value: true
        },
        {
          type: 'select',
          label: 'Theme',
          key: 'theme',
          value: 'light',
          options: [
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
            { label: 'Colorful', value: 'colorful' }
          ]
        },
        {
          type: 'color',
          label: 'Accent Color',
          key: 'accentColor',
          value: '#3498db'
        },
        {
          type: 'number',
          label: 'Item Display Limit',
          key: 'itemLimit',
          value: 5,
          validation: {
            required: true,
            min: 1,
            max: 10
          }
        }
      ]
    }
  ];

  localStorage.setItem('store_plugins', JSON.stringify(initialPlugins));
  return initialPlugins;
};

// Mock API endpoints
export const api = {
  // Get enabled plugins for a seller
  getEnabledPlugins: async (sellerId: string): Promise<Plugin[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const plugins = getStoredPlugins();
        resolve(plugins);
      }, 500);
    });
  },

  // Get plugins for a specific location
  getPluginsForLocation: async (sellerId: string, location: PluginLocation): Promise<Plugin[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const plugins = getStoredPlugins();
        const filtered = plugins.filter(
          plugin => plugin.enabled && plugin.locations.includes(location)
        );
        resolve(filtered);
      }, 500);
    });
  },

  // Toggle plugin status
  togglePlugin: async (sellerId: string, pluginId: string): Promise<Plugin> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const plugins = getStoredPlugins();
        const plugin = plugins.find(p => p.id === pluginId);
        
        if (plugin) {
          plugin.enabled = !plugin.enabled;
          localStorage.setItem('store_plugins', JSON.stringify(plugins));
          resolve({ ...plugin });
        } else {
          reject(new Error('Plugin not found'));
        }
      }, 500);
    });
  },

  // Update plugin configuration
  updatePluginConfig: async (sellerId: string, pluginId: string, config: Record<string, any>): Promise<Plugin> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const plugins = getStoredPlugins();
        const plugin = plugins.find(p => p.id === pluginId);
        
        if (plugin) {
          plugin.config = { ...plugin.config, ...config };
          localStorage.setItem('store_plugins', JSON.stringify(plugins));
          resolve({ ...plugin });
        } else {
          reject(new Error('Plugin not found'));
        }
      }, 500);
    });
  },

  // Get recommendations (mock service for RecommendationEngine plugin)
  getRecommendations: async (productId: string): Promise<any[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: '1', name: 'Related Product 1', price: 99.99 },
          { id: '2', name: 'Related Product 2', price: 149.99 },
          { id: '3', name: 'Related Product 3', price: 79.99 }
        ]);
      }, 500);
    });
  }
};
