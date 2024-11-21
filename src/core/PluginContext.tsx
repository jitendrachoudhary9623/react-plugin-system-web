import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PluginManager, { PluginComponent, PluginService, PluginEvent } from './PluginManager';
import { api, Plugin } from '../mocks/api';

// Import all plugins
import { register as registerDiscountBanner } from '../plugins/DiscountBanner';
import { register as registerRecommendationEngine } from '../plugins/RecommendationEngine';
import { register as registerCartSummaryPlugin } from '../plugins/CartSummaryPlugin';
import { register as registerUserGreeting } from '../plugins/UserGreeting';

interface PluginContextType {
  components: Map<string, PluginComponent>;
  services: Map<string, PluginService>;
  enabledPlugins: Plugin[];
  loading: boolean;
  error: Error | null;
  refreshPlugins: (sellerId: string) => Promise<void>;
  togglePlugin: (sellerId: string, pluginId: string) => Promise<void>;
  getConfigFields: (pluginId: string) => any[];
  updateConfigField: (pluginId: string, key: string, value: any) => void;
  dispatchEvent: (event: PluginEvent) => void;
}

const PluginContext = createContext<PluginContextType | undefined>(undefined);

interface PluginProviderProps {
  sellerId: string;
  children: React.ReactNode;
}

export const PluginProvider: React.FC<PluginProviderProps> = ({
  sellerId,
  children,
}) => {
  const [enabledPlugins, setEnabledPlugins] = useState<Plugin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const pluginManager = PluginManager.getInstance();

  // Initialize plugins
  useEffect(() => {
    // Register all plugins
    registerDiscountBanner(pluginManager);
    registerRecommendationEngine(pluginManager);
    registerCartSummaryPlugin(pluginManager);
    registerUserGreeting(pluginManager);

    // Initialize shared data
    pluginManager.setSharedData('user', {
      id: 'user-123',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'buyer'
    });

    pluginManager.setSharedData('cart', {
      items: [
        { id: '1', name: 'Premium Laptop', price: 999.99, quantity: 1 },
        { id: '2', name: 'Wireless Earbuds', price: 149.99, quantity: 2 },
        { id: '3', name: 'Smart Watch', price: 299.99, quantity: 1 }
      ],
      total: 1599.96
    });
  }, []);

  const refreshPlugins = useCallback(async (sellerId: string) => {
    try {
      setLoading(true);
      setError(null);
      const plugins = await api.getEnabledPlugins(sellerId);
      setEnabledPlugins(plugins);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to refresh plugins');
      setError(error);
      console.error('Error refreshing plugins:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const togglePlugin = useCallback(async (sellerId: string, pluginId: string) => {
    try {
      setError(null);
      await api.togglePlugin(sellerId, pluginId);
      await refreshPlugins(sellerId);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to toggle plugin');
      setError(error);
      console.error('Error toggling plugin:', error);
    }
  }, [refreshPlugins]);

  const getConfigFields = useCallback((pluginId: string) => {
    const plugin = enabledPlugins.find(p => p.id === pluginId);
    return plugin?.configFields || [];
  }, [enabledPlugins]);

  const updateConfigField = useCallback((pluginId: string, key: string, value: any) => {
    const plugin = enabledPlugins.find(p => p.id === pluginId);
    if (plugin && plugin.config) {
      plugin.config[key] = value;
      setEnabledPlugins([...enabledPlugins]);
    }
  }, [enabledPlugins]);

  const dispatchEvent = useCallback((event: PluginEvent) => {
    pluginManager.dispatchEvent(event);
  }, []);

  useEffect(() => {
    refreshPlugins(sellerId);
  }, [sellerId, refreshPlugins]);

  const value = {
    components: pluginManager.getAllComponents(),
    services: pluginManager.getAllServices(),
    enabledPlugins,
    loading,
    error,
    refreshPlugins,
    togglePlugin,
    getConfigFields,
    updateConfigField,
    dispatchEvent,
  };

  return <PluginContext.Provider value={value}>{children}</PluginContext.Provider>;
};

export const usePlugins = (): PluginContextType => {
  const context = useContext(PluginContext);
  if (context === undefined) {
    throw new Error('usePlugins must be used within a PluginProvider');
  }
  return context;
};

// Custom hooks for plugin functionality
export const usePluginEvent = (type: string, handler: (event: any) => void) => {
  const pluginManager = PluginManager.getInstance();

  useEffect(() => {
    pluginManager.addEventListener(type, handler);
    return () => pluginManager.removeEventListener(type, handler);
  }, [type, handler]);
};

export const useSharedData = <T,>(key: string): [T | undefined, (value: T) => void] => {
  const pluginManager = PluginManager.getInstance();
  const [value, setValue] = useState<T | undefined>(pluginManager.getSharedData(key));

  const updateValue = useCallback((newValue: T) => {
    pluginManager.setSharedData(key, newValue);
    setValue(newValue);
  }, [key]);

  useEffect(() => {
    setValue(pluginManager.getSharedData(key));
  }, [key]);

  return [value, updateValue];
};

export default PluginContext;
