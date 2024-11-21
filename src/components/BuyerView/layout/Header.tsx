import React from 'react';
import { Link } from 'react-router-dom';
import PluginSlot from '../../PluginSlot';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="store-header">
      <PluginSlot location="header" />
      
      <div className="header-content">
        <div className="header-brand">
          <Link to="/" className="brand-logo">
            MyStore
          </Link>
        </div>

        <nav className="header-nav">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/cart">Cart</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
