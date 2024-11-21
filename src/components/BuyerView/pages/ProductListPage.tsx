import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PluginSlot from '../../PluginSlot';
import './ProductListPage.css';

// Mock products data
const mockProducts = [
  { id: '1', name: 'Premium Laptop', price: 999.99, image: '💻', category: 'Electronics' },
  { id: '2', name: 'Wireless Earbuds', price: 149.99, image: '🎧', category: 'Electronics' },
  { id: '3', name: 'Smart Watch', price: 299.99, image: '⌚', category: 'Electronics' },
  { id: '4', name: 'Gaming Console', price: 499.99, image: '🎮', category: 'Electronics' },
  { id: '5', name: 'Designer T-Shirt', price: 29.99, image: '👕', category: 'Fashion' },
  { id: '6', name: 'Running Shoes', price: 89.99, image: '👟', category: 'Fashion' },
  { id: '7', name: 'Coffee Maker', price: 79.99, image: '☕', category: 'Home' },
  { id: '8', name: 'Desk Lamp', price: 39.99, image: '💡', category: 'Home' },
];

const ProductListPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('featured');
  
  const category = searchParams.get('category');
  
  // Filter products by category if specified
  const filteredProducts = category
    ? mockProducts.filter(p => p.category.toLowerCase() === category.toLowerCase())
    : mockProducts;

  // Sort products based on selection
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div className="product-list-page">
      {/* Top Banner Plugin Slot */}
      <PluginSlot location="product-list" />

      <div className="product-list-header">
        <h1>{category ? `${category} Products` : 'All Products'}</h1>
        
        <div className="product-list-controls">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      <div className="product-list-layout">
        {/* Filters Sidebar */}
        <aside className="product-filters">
          <h2>Filters</h2>
          <PluginSlot location="sidebar" />
        </aside>

        {/* Product Grid */}
        <div className="product-grid">
          {sortedProducts.map(product => (
            <Link 
              key={product.id}
              to={`/product/${product.id}`}
              className="product-card"
            >
              <div className="product-card-image">
                <span>{product.image}</span>
                {/* Product Badge Plugin Slot */}
                <PluginSlot location="product-badges" />
              </div>
              <div className="product-card-content">
                <h3>{product.name}</h3>
                <p className="product-card-price">${product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Banner Plugin Slot */}
      <PluginSlot location="product-list" />
    </div>
  );
};

export default ProductListPage;
