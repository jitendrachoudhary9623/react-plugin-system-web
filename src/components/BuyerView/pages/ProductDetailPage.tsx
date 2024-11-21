import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import PluginSlot from '../../PluginSlot';
import './ProductDetailPage.css';

// Mock product data
const mockProduct = {
  id: '1',
  name: 'Premium Laptop',
  price: 999.99,
  description: 'High-performance laptop perfect for work and entertainment.',
  image: '💻',
  specs: [
    'Intel Core i7 Processor',
    '16GB RAM',
    '512GB SSD',
    '15.6" 4K Display',
    'NVIDIA RTX Graphics'
  ],
  stock: 10
};

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    console.log(`Added ${quantity} items to cart`);
    // Implement cart functionality
  };

  return (
    <div className="product-detail-page">
      {/* Top Banner Plugin Slot */}
      <PluginSlot location="product-detail" />

      <div className="product-content">
        <div className="product-gallery">
          <div className="product-image">
            <span>{mockProduct.image}</span>
          </div>
          {/* Image Gallery Plugin Slot */}
          <PluginSlot location="product-gallery" />
        </div>

        <div className="product-info">
          <h1>{mockProduct.name}</h1>
          <div className="product-price">${mockProduct.price}</div>
          
          {/* Product Badges Plugin Slot */}
          <PluginSlot location="product-badges" />

          <p className="product-description">{mockProduct.description}</p>

          <div className="product-specs">
            <h2>Specifications</h2>
            <ul>
              {mockProduct.specs.map((spec, index) => (
                <li key={index}>{spec}</li>
              ))}
            </ul>
          </div>

          <div className="product-actions">
            <div className="quantity-selector">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span>{quantity}</span>
              <button 
                onClick={() => setQuantity(q => Math.min(mockProduct.stock, q + 1))}
                disabled={quantity >= mockProduct.stock}
              >
                +
              </button>
            </div>
            <button 
              className="add-to-cart-button"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>

          {/* Product Customization Plugin Slot */}
          <PluginSlot location="product-customization" />
        </div>
      </div>

      {/* Related Products Plugin Slot */}
      <div className="related-products">
        <h2>You May Also Like</h2>
        <PluginSlot 
          location="product-detail" 
          productId={id}
        />
      </div>

      {/* Bottom Banner Plugin Slot */}
      <PluginSlot location="product-detail" />
    </div>
  );
};

export default ProductDetailPage;
