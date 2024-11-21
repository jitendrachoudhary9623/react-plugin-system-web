import React, { useEffect } from 'react';
import { usePlugins, useSharedData, usePluginEvent } from '../../core/PluginContext';
import './styles.css';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller';
}

interface UserGreetingProps {
  showName?: boolean;
  greeting?: string;
  fontSize?: number;
  textColor?: string;
}

const UserGreeting: React.FC<UserGreetingProps> = ({
  showName = true,
  greeting = 'Welcome back',
  fontSize = 16,
  textColor = '#2c3e50'
}) => {
  const [user] = useSharedData<User>('user');
  const { dispatchEvent } = usePlugins();

  // Example of handling plugin events
  usePluginEvent('CHECKOUT_CLICKED', (event) => {
    if (user) {
      console.log(`User ${user.name} proceeded to checkout with total: ${event.payload.cartTotal}`);
    }
  });

  // Example of dispatching events
  useEffect(() => {
    if (user) {
      dispatchEvent({
        type: 'USER_GREETING_SHOWN',
        payload: { userId: user.id, timestamp: new Date().toISOString() }
      });
    }
  }, [user, dispatchEvent]);

  if (!user) {
    return (
      <div className="user-greeting guest" style={{ fontSize, color: textColor }}>
        Welcome, Guest!
      </div>
    );
  }

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const displayGreeting = greeting === 'auto' ? getTimeBasedGreeting() : greeting;

  return (
    <div 
      className="user-greeting"
      style={{ fontSize, color: textColor }}
    >
      <span className="greeting-text">
        {displayGreeting}
        {showName && (
          <span className="user-name">{user.name}</span>
        )}
      </span>
      
      <div className="user-actions">
        <button 
          className="user-menu-button"
          onClick={() => {
            dispatchEvent({
              type: 'USER_MENU_CLICKED',
              payload: { userId: user.id }
            });
          }}
        >
          <span className="user-initial">{user.name.charAt(0)}</span>
        </button>
      </div>
    </div>
  );
};

// Plugin registration with configuration fields
export const register = (pluginManager: any) => {
  pluginManager.registerComponent('UserGreeting', UserGreeting);
  
  // Register event handlers
  pluginManager.addEventListener('USER_MENU_CLICKED', (event: any) => {
    console.log('User menu clicked:', event.payload);
  });

  pluginManager.addEventListener('USER_GREETING_SHOWN', (event: any) => {
    console.log('Greeting shown to user:', event.payload);
  });
};

export default UserGreeting;
