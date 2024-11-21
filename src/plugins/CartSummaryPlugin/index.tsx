import React, { useCallback } from 'react';
import { usePlugins, useSharedData } from '../../core/PluginContext';
import './styles.css';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartData {
  items: CartItem[];
  total: number;
}

interface CartSummaryPluginProps {
  showTax?: boolean;
  showShipping?: boolean;
  theme?: 'light' | 'dark' | 'colorful';
  accentColor?: string;
  itemLimit?: number;
}

const CartSummaryPlugin: React.FC<CartSummaryPluginProps> = ({
  showTax = true,
  showShipping = true,
  theme = 'light',
  accentColor = '#3498db',
  itemLimit = 5
}) => {
  const [cart] = useSharedData<CartData>('cart');
  const { dispatchEvent } = usePlugins();

  const handleCheckoutClick = useCallback(() => {
    const finalTotal = cart ? (
      cart.total + 
      (showTax ? cart.total * 0.1 : 0) + 
      (showShipping ? 9.99 : 0)
    ) : 0;

    dispatchEvent({
      type: 'CHECKOUT_CLICKED',
      payload: { cartTotal: finalTotal }
    });
  }, [cart, showTax, showShipping, dispatchEvent]);

  if (!cart || cart.items.length === 0) {
    return (
      <div className={`cart-summary-plugin theme-${theme}`}>
        <div className="empty-cart">
          Your cart is empty
        </div>
      </div>
    );
  }

  const tax = cart.total * 0.1; // 10% tax
  const shipping = 9.99;
  const finalTotal = cart.total + (showTax ? tax : 0) + (showShipping ? shipping : 0);

  const displayItems = cart.items.slice(0, itemLimit);
  const hiddenItems = cart.items.length - itemLimit;

  const getThemeStyles = () => ({
    '--accent-color': accentColor
  } as React.CSSProperties);

  return (
    <div 
      className={`cart-summary-plugin theme-${theme}`}
      style={getThemeStyles()}
    >
      <h3>Cart Summary</h3>
      
      <div className="cart-items">
        {displayItems.map(item => (
          <div key={item.id} className="cart-item">
            <div className="item-info">
              <span className="item-name">{item.name}</span>
              <span className="item-quantity">×{item.quantity}</span>
            </div>
            <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        {hiddenItems > 0 && (
          <div className="hidden-items">
            And {hiddenItems} more item{hiddenItems > 1 ? 's' : ''}...
          </div>
        )}
      </div>

      <div className="cart-totals">
        <div className="subtotal">
          <span>Subtotal</span>
          <span>${cart.total.toFixed(2)}</span>
        </div>

        {showTax && (
          <div className="tax">
            <span>Tax (10%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
        )}

        {showShipping && (
          <div className="shipping">
            <span>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
        )}

        <div className="total">
          <span>Total</span>
          <span>${finalTotal.toFixed(2)}</span>
        </div>
      </div>

      <button 
        className="checkout-button"
        onClick={handleCheckoutClick}
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

// Plugin registration
export const register = (pluginManager: any) => {
  pluginManager.registerComponent('CartSummaryPlugin', CartSummaryPlugin);
};

export default CartSummaryPlugin;
