import React from 'react';
import { Link } from 'react-router-dom';
import PluginSlot from '../../PluginSlot';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="store-footer">
      <PluginSlot location="footer" />
      
      <div className="footer-content">
        <div className="footer-sections">
          <div className="footer-section">
            <h3>Shop</h3>
            <nav className="footer-nav">
              <Link to="/products">All Products</Link>
              <Link to="/categories">Categories</Link>
              <Link to="/deals">Deals</Link>
            </nav>
          </div>

          <div className="footer-section">
            <h3>Customer Service</h3>
            <nav className="footer-nav">
              <Link to="/contact">Contact Us</Link>
              <Link to="/shipping">Shipping Info</Link>
              <Link to="/returns">Returns</Link>
            </nav>
          </div>

          <div className="footer-section">
            <h3>About Us</h3>
            <nav className="footer-nav">
              <Link to="/about">Our Story</Link>
              <Link to="/careers">Careers</Link>
              <Link to="/privacy">Privacy Policy</Link>
            </nav>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            © {new Date().getFullYear()} MyStore. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
