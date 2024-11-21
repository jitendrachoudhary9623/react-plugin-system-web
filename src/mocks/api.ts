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
  | 'product-customization';

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
}

const mockPlugins: Plugin[] = [
  {
    id: 'test-plugin',
    name: 'Test Plugin',
    description: 'A simple test plugin to verify the plugin system',
    type: 'ui',
    enabled: true,
    entryPoint: 'TestPlugin',
    locations: ['header', 'footer', 'home-banner'],
    config: {
      message: 'Plugin system is working! 🎉',
      backgroundColor: '#e3f2fd'
    }
  },
  {
    id: 'discount-banner',
    name: 'Discount Banner',
    description: 'Displays promotional discounts to buyers',
    type: 'ui',
    enabled: true,
    entryPoint: 'DiscountBanner',
    locations: ['home-banner', 'product-list'],
    config: {
      message: 'Special Offer!',
      discount: 20
    }
  },
  {
    id: 'recommendation-engine',
    name: 'Recommendation Engine',
    description: 'Provides product recommendations',
    type: 'integration',
    enabled: true,
    entryPoint: 'RecommendationsComponent',
    locations: ['product-detail', 'cart-summary'],
    config: {
      maxItems: 3
    }
  },
  {
    id: 'seasonal-theme',
    name: 'Seasonal Theme',
    description: 'Applies seasonal styling to the store',
    type: 'ui',
    enabled: false,
    entryPoint: 'SeasonalTheme',
    locations: ['header', 'footer'],
    config: {
      theme: 'winter',
      colors: {
        primary: '#2c3e50',
        secondary: '#3498db'
      }
    }
  },
  {
    id: 'product-gallery',
    name: 'Enhanced Product Gallery',
    description: 'Advanced product image gallery with zoom and 360 view',
    type: 'ui',
    enabled: true,
    entryPoint: 'ProductGallery',
    locations: ['product-gallery'],
    config: {
      enableZoom: true,
      enable360View: true
    }
  },
  {
    id: 'product-badges',
    name: 'Product Badges',
    description: 'Display special badges like "New", "Sale", "Best Seller"',
    type: 'ui',
    enabled: true,
    entryPoint: 'ProductBadges',
    locations: ['product-badges', 'product-list'],
    config: {
      badges: ['new', 'sale', 'best-seller']
    }
  },
  {
    id: 'product-customizer',
    name: 'Product Customizer',
    description: 'Allow customers to customize products',
    type: 'ui',
    enabled: true,
    entryPoint: 'ProductCustomizer',
    locations: ['product-customization'],
    config: {
      options: ['color', 'size', 'text']
    }
  }
];

// Mock API endpoints
export const api = {
  // Get enabled plugins for a seller
  getEnabledPlugins: async (sellerId: string): Promise<Plugin[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockPlugins);
      }, 500);
    });
  },

  // Get plugins for a specific location
  getPluginsForLocation: async (sellerId: string, location: PluginLocation): Promise<Plugin[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const plugins = mockPlugins.filter(
          plugin => plugin.enabled && plugin.locations.includes(location)
        );
        resolve(plugins);
      }, 500);
    });
  },

  // Toggle plugin status
  togglePlugin: async (sellerId: string, pluginId: string): Promise<Plugin> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const plugin = mockPlugins.find(p => p.id === pluginId);
        if (plugin) {
          plugin.enabled = !plugin.enabled;
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
