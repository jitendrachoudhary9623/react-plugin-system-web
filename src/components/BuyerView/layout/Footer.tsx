import React from 'react';
import { Link } from 'react-router-dom';
import PluginSlot from '../../PluginSlot';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="store-footer">
      <div className="footer-content">
        <div className="footer-sections">
          <div className="footer-section">
            <h3>Shop</h3>
            <nav className="footer-nav">
              <Link to="/products">All Products</Link>
              <Link to="/products?category=electronics">Electronics</Link>
              <Link to="/products?category=fashion">Fashion</Link>
              <Link to="/products?category=home">Home & Living</Link>
            </nav>
          </div>

          <div className="footer-section">
            <h3>Customer Service</h3>
            <nav className="footer-nav">
              <Link to="/contact">Contact Us</Link>
              <Link to="/shipping">Shipping Info</Link>
              <Link to="/returns">Returns</Link>
              <Link to="/faq">FAQ</Link>
            </nav>
          </div>

          <div className="footer-section">
            <h3>About Us</h3>
            <nav className="footer-nav">
              <Link to="/about">Our Story</Link>
              <Link to="/careers">Careers</Link>
              <Link to="/blog">Blog</Link>
              <Link to="/press">Press</Link>
            </nav>
          </div>

          <div className="footer-section">
            <h3>Connect</h3>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
            </div>
          </div>
        </div>

        <div className="footer-plugins">
          <PluginSlot location="footer" />
        </div>

        <div className="footer-bottom">
          <div className="footer-legal">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/sitemap">Sitemap</Link>
          </div>
          <p className="copyright">
            © {new Date().getFullYear()} MyStore. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
