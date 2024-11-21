import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { PluginProvider } from './core/PluginContext';
import SellerDashboard from './components/SellerDashboard';
import BuyerView from './components/BuyerView';
import './App.css';

// Mock seller ID - in a real app, this would come from authentication
const MOCK_SELLER_ID = 'seller-123';

function App() {
  return (
    <Router>
      <PluginProvider sellerId={MOCK_SELLER_ID}>
        <div className="app">
          <nav className="app-nav">
            <div className="nav-brand">Plugin Management System</div>
            <div className="nav-links">
              <Link to="/seller">Seller Dashboard</Link>
              <Link to="/buyer">Buyer View</Link>
            </div>
          </nav>

          <Routes>
            <Route 
              path="/seller" 
              element={<SellerDashboard sellerId={MOCK_SELLER_ID} />} 
            />
            <Route 
              path="/buyer" 
              element={<BuyerView />} 
            />
            <Route 
              path="/" 
              element={<SellerDashboard sellerId={MOCK_SELLER_ID} />} 
            />
          </Routes>
        </div>
      </PluginProvider>
    </Router>
  );
}

export default App;
