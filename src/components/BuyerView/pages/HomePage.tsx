import React from 'react';
import { Link } from 'react-router-dom';
import PluginSlot from '../../PluginSlot';
import './HomePage.css';

// Mock featured categories
const featuredCategories = [
  { id: '1', name: 'Electronics', image: '🖥️' },
  { id: '2', name: 'Fashion', image: '👕' },
  { id: '3', name: 'Home & Living', image: '🏠' },
  { id: '4', name: 'Books', image: '📚' },
];

// Mock featured products
const featuredProducts = [
  { id: '1', name: 'Premium Laptop', price: 999.99, image: '💻' },
  { id: '2', name: 'Wireless Earbuds', price: 149.99, image: '🎧' },
  { id: '3', name: 'Smart Watch', price: 299.99, image: '⌚' },
  { id: '4', name: 'Gaming Console', price: 499.99, image: '🎮' },
];

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      {/* Hero Section with Banner Plugin Slot */}
      <section className="hero-section">
        <PluginSlot location="home-banner" />
        <div className="hero-content">
          <h1>Welcome to MyStore</h1>
          <p>Discover amazing products at great prices</p>
          <Link to="/products" className="cta-button">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="featured-categories">
        <h2>Shop by Category</h2>
        <div className="categories-grid">
          {featuredCategories.map(category => (
            <Link 
              key={category.id} 
              to={`/products?category=${category.id}`}
              className="category-card"
            >
              <span className="category-icon">{category.image}</span>
              <h3>{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Plugin Slot for Featured Content */}
      <PluginSlot location="home-featured" />

      {/* Featured Products */}
      <section className="featured-products">
        <h2>Featured Products</h2>
        <div className="products-grid">
          {featuredProducts.map(product => (
            <Link 
              key={product.id}
              to={`/product/${product.id}`}
              className="product-card"
            >
              <span className="product-image">{product.image}</span>
              <h3>{product.name}</h3>
              <p className="product-price">${product.price}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Sidebar Plugin Slot */}
      <aside className="home-sidebar">
        <PluginSlot location="sidebar" />
      </aside>

      {/* Bottom Banner Plugin Slot */}
      <section className="bottom-banner">
        <PluginSlot location="home-banner" />
      </section>
    </div>
  );
};

export default HomePage;
