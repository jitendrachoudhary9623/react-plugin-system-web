import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PluginProvider } from './core/PluginContext';
import SellerDashboard from './components/SellerDashboard';
import BuyerView from './components/BuyerView';
import HomePage from './components/BuyerView/pages/HomePage';
import ProductListPage from './components/BuyerView/pages/ProductListPage';
import ProductDetailPage from './components/BuyerView/pages/ProductDetailPage';
import CartPage from './components/BuyerView/pages/CartPage';
import CheckoutPage from './components/BuyerView/pages/CheckoutPage';
import './App.css';

// Mock seller ID - in a real app, this would come from authentication
const MOCK_SELLER_ID = 'seller-123';

function App() {
  return (
    <Router>
      <PluginProvider sellerId={MOCK_SELLER_ID}>
        <div className="app">
          <Routes>
            {/* Seller Routes */}
            <Route path="/seller/*" element={<SellerDashboard sellerId={MOCK_SELLER_ID} />} />

            {/* Buyer Routes */}
            <Route path="/" element={<BuyerView />}>
              <Route index element={<HomePage />} />
              <Route path="products" element={<ProductListPage />} />
              <Route path="product/:id" element={<ProductDetailPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
            </Route>

            {/* Redirect unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </PluginProvider>
    </Router>
  );
}

export default App;
