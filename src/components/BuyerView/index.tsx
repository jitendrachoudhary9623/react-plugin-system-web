import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './layout/Header';
import Footer from './layout/Footer';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PluginSlot from '../PluginSlot';
import './styles.css';

const BuyerView: React.FC = () => {
  return (
    <div className="buyer-view">
      <div className="top-banner">
        <PluginSlot location="top-banner" />
      </div>
      <Header />
      <main className="buyer-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default BuyerView;
