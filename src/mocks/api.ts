// Mock API responses
export interface Plugin {
  id: string;
  name: string;
  description: string;
  type: 'ui' | 'integration';
  enabled: boolean;
  entryPoint: string;
}

const mockPlugins: Plugin[] = [
  {
    id: 'discount-banner',
    name: 'Discount Banner',
    description: 'Displays promotional discounts to buyers',
    type: 'ui',
    enabled: true,
    entryPoint: 'DiscountBanner'
  },
  {
    id: 'recommendation-engine',
    name: 'Recommendation Engine',
    description: 'Provides product recommendations',
    type: 'integration',
    enabled: false,
    entryPoint: 'RecommendationsComponent'
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
