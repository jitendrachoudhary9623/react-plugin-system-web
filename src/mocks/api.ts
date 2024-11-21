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
  category?: string;
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
      category: 'Marketing',
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
      category: 'User Experience',
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
      category: 'Shopping',
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
    },
    {
      id: 'discount-banner',
      name: 'Discount Banner',
      description: 'Displays promotional discounts to buyers',
      type: 'ui',
      enabled: true,
      entryPoint: 'DiscountBanner',
      locations: ['home-banner', 'product-list'],
      category: 'Marketing',
      config: {
        message: 'Special Offer!',
        discount: 20,
        backgroundColor: '#e74c3c',
        textColor: '#ffffff',
        showTimer: true
      },
      configFields: [
        {
          type: 'text',
          label: 'Message',
          key: 'message',
          value: 'Special Offer!',
          validation: {
            required: true
          }
        },
        {
          type: 'number',
          label: 'Discount Percentage',
          key: 'discount',
          value: 20,
          validation: {
            min: 0,
            max: 100
          }
        },
        {
          type: 'color',
          label: 'Background Color',
          key: 'backgroundColor',
          value: '#e74c3c'
        },
        {
          type: 'color',
          label: 'Text Color',
          key: 'textColor',
          value: '#ffffff'
        },
        {
          type: 'boolean',
          label: 'Show Countdown Timer',
          key: 'showTimer',
          value: true
        }
      ]
    },
    {
      id: 'recommendation-engine',
      name: 'Recommendation Engine',
      description: 'Provides product recommendations',
      type: 'integration',
      enabled: true,
      entryPoint: 'RecommendationsComponent',
      locations: ['product-detail', 'cart-summary'],
      category: 'Product Discovery',
      config: {
        maxItems: 3,
        algorithm: 'collaborative',
        showPrices: true,
        showRatings: true
      },
      configFields: [
        {
          type: 'number',
          label: 'Maximum Items',
          key: 'maxItems',
          value: 3,
          validation: {
            min: 1,
            max: 10
          }
        },
        {
          type: 'select',
          label: 'Algorithm',
          key: 'algorithm',
          value: 'collaborative',
          options: [
            { label: 'Collaborative Filtering', value: 'collaborative' },
            { label: 'Content Based', value: 'content' },
            { label: 'Hybrid', value: 'hybrid' }
          ]
        },
        {
          type: 'boolean',
          label: 'Show Prices',
          key: 'showPrices',
          value: true
        },
        {
          type: 'boolean',
          label: 'Show Ratings',
          key: 'showRatings',
          value: true
        }
      ]
    },
    {
      id: 'test-plugin',
      name: 'Test Plugin',
      description: 'A plugin for testing and development',
      type: 'ui',
      enabled: true,
      entryPoint: 'TestPlugin',
      locations: ['sidebar'],
      category: 'Development',
      config: {
        testMode: true,
        debugLevel: 'info',
        mockData: true,
        refreshInterval: 5
      },
      configFields: [
        {
          type: 'boolean',
          label: 'Test Mode',
          key: 'testMode',
          value: true
        },
        {
          type: 'select',
          label: 'Debug Level',
          key: 'debugLevel',
          value: 'info',
          options: [
            { label: 'Error', value: 'error' },
            { label: 'Warning', value: 'warning' },
            { label: 'Info', value: 'info' },
            { label: 'Debug', value: 'debug' }
          ]
        },
        {
          type: 'boolean',
          label: 'Use Mock Data',
          key: 'mockData',
          value: true
        },
        {
          type: 'number',
          label: 'Refresh Interval (seconds)',
          key: 'refreshInterval',
          value: 5,
          validation: {
            min: 1,
            max: 60
          }
        }
      ]
    },
    {
      id: 'product-gallery',
      name: 'Product Gallery',
      description: 'Enhanced product image gallery with zoom and lightbox',
      type: 'ui',
      enabled: true,
      entryPoint: 'ProductGallery',
      locations: ['product-gallery'],
      category: 'Product Display',
      config: {
        zoomEnabled: true,
        lightboxEnabled: true,
        thumbnailPosition: 'bottom',
        aspectRatio: '1:1'
      },
      configFields: [
        {
          type: 'boolean',
          label: 'Enable Zoom',
          key: 'zoomEnabled',
          value: true
        },
        {
          type: 'boolean',
          label: 'Enable Lightbox',
          key: 'lightboxEnabled',
          value: true
        },
        {
          type: 'select',
          label: 'Thumbnail Position',
          key: 'thumbnailPosition',
          value: 'bottom',
          options: [
            { label: 'Bottom', value: 'bottom' },
            { label: 'Left', value: 'left' },
            { label: 'Right', value: 'right' }
          ]
        },
        {
          type: 'select',
          label: 'Aspect Ratio',
          key: 'aspectRatio',
          value: '1:1',
          options: [
            { label: 'Square (1:1)', value: '1:1' },
            { label: 'Portrait (3:4)', value: '3:4' },
            { label: 'Landscape (4:3)', value: '4:3' }
          ]
        }
      ]
    },
    {
      id: 'product-badges',
      name: 'Product Badges',
      description: 'Dynamic badges for product status and promotions',
      type: 'ui',
      enabled: true,
      entryPoint: 'ProductBadges',
      locations: ['product-badges'],
      category: 'Product Display',
      config: {
        showSale: true,
        showNew: true,
        showStock: true,
        style: 'modern'
      },
      configFields: [
        {
          type: 'boolean',
          label: 'Show Sale Badge',
          key: 'showSale',
          value: true
        },
        {
          type: 'boolean',
          label: 'Show New Badge',
          key: 'showNew',
          value: true
        },
        {
          type: 'boolean',
          label: 'Show Stock Status',
          key: 'showStock',
          value: true
        },
        {
          type: 'select',
          label: 'Badge Style',
          key: 'style',
          value: 'modern',
          options: [
            { label: 'Modern', value: 'modern' },
            { label: 'Classic', value: 'classic' },
            { label: 'Minimal', value: 'minimal' }
          ]
        }
      ]
    },
    {
      id: 'social-share',
      name: 'Social Share',
      description: 'Social media sharing buttons',
      type: 'ui',
      enabled: true,
      entryPoint: 'SocialShare',
      locations: ['product-detail', 'footer'],
      category: 'Social',
      config: {
        networks: ['facebook', 'twitter', 'pinterest'],
        showCount: true,
        theme: 'light'
      },
      configFields: [
        {
          type: 'select',
          label: 'Networks',
          key: 'networks',
          value: ['facebook', 'twitter', 'pinterest'],
          options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'Twitter', value: 'twitter' },
            { label: 'Pinterest', value: 'pinterest' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'WhatsApp', value: 'whatsapp' }
          ]
        },
        {
          type: 'boolean',
          label: 'Show Share Count',
          key: 'showCount',
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
        }
      ]
    },
    {
      id: 'live-chat',
      name: 'Live Chat',
      description: 'Customer support live chat widget',
      type: 'integration',
      enabled: true,
      entryPoint: 'LiveChat',
      locations: ['sidebar'],
      category: 'Customer Support',
      config: {
        position: 'bottom-right',
        theme: 'light',
        autoOpen: false,
        greetingMessage: 'Hi! How can we help you today?'
      },
      configFields: [
        {
          type: 'select',
          label: 'Widget Position',
          key: 'position',
          value: 'bottom-right',
          options: [
            { label: 'Bottom Right', value: 'bottom-right' },
            { label: 'Bottom Left', value: 'bottom-left' },
            { label: 'Top Right', value: 'top-right' },
            { label: 'Top Left', value: 'top-left' }
          ]
        },
        {
          type: 'select',
          label: 'Theme',
          key: 'theme',
          value: 'light',
          options: [
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' }
          ]
        },
        {
          type: 'boolean',
          label: 'Auto Open',
          key: 'autoOpen',
          value: false
        },
        {
          type: 'text',
          label: 'Greeting Message',
          key: 'greetingMessage',
          value: 'Hi! How can we help you today?',
          validation: {
            required: true
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
