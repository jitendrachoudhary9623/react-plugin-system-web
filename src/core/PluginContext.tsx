import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PluginManager, {
  PluginComponent,
  PluginService,
  SharedData,
  PluginEvent,
  PluginEventHandler,
  PluginConfigField
} from './PluginManager';
import { api, Plugin } from '../mocks/api';

interface PluginContextType {
  components: Map<string, PluginComponent>;
  services: Map<string, PluginService>;
  enabledPlugins: Plugin[];
  loading: boolean;
  error: Error | null;
  refreshPlugins: (sellerId: string) => Promise<void>;
  togglePlugin: (sellerId: string, pluginId: string) => Promise<void>;
  // New functionality
  sharedData: SharedData;
  setSharedData: <T>(key: string, value: T) => void;
  addEventListener: (type: string, handler: PluginEventHandler) => void;
  removeEventListener: (type: string, handler: PluginEventHandler) => void;
  dispatchEvent: (event: PluginEvent) => void;
  getConfigFields: (pluginId: string) => PluginConfigField[];
  updateConfigField: (pluginId: string, key: string, value: any) => void;
}

const PluginContext = createContext<PluginContextType | undefined>(undefined);

interface PluginProviderProps {
  sellerId: string;
  children: React.ReactNode;
  initialSharedData?: SharedData;
}

export const PluginProvider: React.FC<PluginProviderProps> = ({
  sellerId,
  children,
  initialSharedData = {}
}) => {
  const [enabledPlugins, setEnabledPlugins] = useState<Plugin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const pluginManager = PluginManager.getInstance();

  // Initialize shared data
  useEffect(() => {
    Object.entries(initialSharedData).forEach(([key, value]) => {
      pluginManager.setSharedData(key, value);
    });
  }, [initialSharedData]);

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

  // Shared data management
  const setSharedData = useCallback(<T,>(key: string, value: T) => {
    pluginManager.setSharedData(key, value);
  }, []);

  // Event management
  const addEventListener = useCallback((type: string, handler: PluginEventHandler) => {
    pluginManager.addEventListener(type, handler);
  }, []);

  const removeEventListener = useCallback((type: string, handler: PluginEventHandler) => {
    pluginManager.removeEventListener(type, handler);
  }, []);

  const dispatchEvent = useCallback((event: PluginEvent) => {
    pluginManager.dispatchEvent(event);
  }, []);

  // Config management
  const getConfigFields = useCallback((pluginId: string) => {
    return pluginManager.getConfigFields(pluginId);
  }, []);

  const updateConfigField = useCallback((pluginId: string, key: string, value: any) => {
    pluginManager.updateConfigField(pluginId, key, value);
  }, []);

  useEffect(() => {
    refreshPlugins(sellerId);
  }, [sellerId, refreshPlugins]);

  const value: PluginContextType = {
    components: pluginManager.getAllComponents(),
    services: pluginManager.getAllServices(),
    enabledPlugins,
    loading,
    error,
    refreshPlugins,
    togglePlugin,
    sharedData: pluginManager['sharedData'], // Access internal state
    setSharedData,
    addEventListener,
    removeEventListener,
    dispatchEvent,
    getConfigFields,
    updateConfigField,
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
export const usePluginEvent = (type: string, handler: PluginEventHandler) => {
  const { addEventListener, removeEventListener } = usePlugins();

  useEffect(() => {
    addEventListener(type, handler);
    return () => removeEventListener(type, handler);
  }, [type, handler, addEventListener, removeEventListener]);
};

export const useSharedData = <T,>(key: string): [T | undefined, (value: T) => void] => {
  const { sharedData, setSharedData } = usePlugins();
  const value = sharedData[key] as T | undefined;
  const setValue = useCallback((newValue: T) => {
    setSharedData(key, newValue);
  }, [key, setSharedData]);

  return [value, setValue];
};

export default PluginContext;
