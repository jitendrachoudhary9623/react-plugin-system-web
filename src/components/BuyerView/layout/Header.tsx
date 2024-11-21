import React from 'react';
import { Link, NavLink } from 'react-router-dom';
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
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? 'active' : ''}
            end
          >
            Home
          </NavLink>
          <NavLink 
            to="/products" 
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            Products
          </NavLink>
          <NavLink 
            to="/cart" 
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            Cart
          </NavLink>
          <NavLink 
            to="/seller" 
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            Seller Dashboard
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;
