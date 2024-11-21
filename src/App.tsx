import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PluginProvider } from './core/PluginContext';
import BuyerView from './components/BuyerView';
import SellerDashboard from './components/SellerDashboard';
import './App.css';

// Mock seller ID for demo purposes
const DEMO_SELLER_ID = 'seller-123';

const App: React.FC = () => {
  return (
    <Router>
      <PluginProvider sellerId={DEMO_SELLER_ID}>
        <div className="app">
          <Routes>
            {/* Seller Dashboard Route */}
            <Route path="/seller" element={<SellerDashboard sellerId={DEMO_SELLER_ID} />} />
            
            {/* Buyer View Routes */}
            <Route path="/*" element={<BuyerView />} />
            
            {/* Redirect root to home */}
            <Route path="/" element={<Navigate to="/home" replace />} />
          </Routes>
        </div>
      </PluginProvider>
    </Router>
  );
};

export default App;
