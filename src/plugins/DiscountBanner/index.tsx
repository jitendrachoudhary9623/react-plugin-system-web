import React from 'react';
import './styles.css';

interface DiscountBannerProps {
  message?: string;
  discount?: number;
}

const DiscountBanner: React.FC<DiscountBannerProps> = ({
  message = 'Special Offer!',
  discount = 20,
}) => {
  return (
    <div className="discount-banner">
      <span className="discount-message">{message}</span>
      <span className="discount-amount">{discount}% OFF</span>
    </div>
  );
};

// Plugin registration
export const register = (pluginManager: any) => {
  pluginManager.registerComponent('DiscountBanner', DiscountBanner);
};

export default DiscountBanner;
