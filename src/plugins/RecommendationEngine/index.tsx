import React, { useEffect, useState } from 'react';
import { api } from '../../mocks/api';
import './styles.css';

interface Product {
  id: string;
  name: string;
  price: number;
}

interface RecommendationServiceType {
  getRecommendations: (productId: string) => Promise<Product[]>;
}

// The service that will be registered with the plugin manager
const RecommendationService: RecommendationServiceType = {
  getRecommendations: async (productId: string) => {
    return api.getRecommendations(productId);
  },
};

// UI Component to display recommendations
interface RecommendationsProps {
  productId: string;
}

const RecommendationsComponent: React.FC<RecommendationsProps> = ({ productId }) => {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const data = await RecommendationService.getRecommendations(productId);
        setRecommendations(data);
        setError(null);
      } catch (err) {
        setError('Failed to load recommendations');
        console.error('Error fetching recommendations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [productId]);

  if (loading) {
    return <div className="recommendations-loading">Loading recommendations...</div>;
  }

  if (error) {
    return <div className="recommendations-error">{error}</div>;
  }

  return (
    <div className="recommendations-container">
      <h3>Recommended Products</h3>
      <div className="recommendations-grid">
        {recommendations.map((product) => (
          <div key={product.id} className="recommendation-card">
            <h4>{product.name}</h4>
            <p className="price">${product.price.toFixed(2)}</p>
            <button className="view-button">View Product</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Plugin registration
export const register = (pluginManager: any) => {
  pluginManager.registerService('RecommendationService', RecommendationService);
  pluginManager.registerComponent('RecommendationsComponent', RecommendationsComponent);
};

export default RecommendationsComponent;
