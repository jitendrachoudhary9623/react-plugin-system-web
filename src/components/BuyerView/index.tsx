import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './layout/Header';
import Footer from './layout/Footer';
import './styles.css';

const BuyerView: React.FC = () => {
  return (
    <div className="buyer-view-layout">
      <Header />
      <main className="buyer-view-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default BuyerView;
