import React, { createContext, useContext, useState, useEffect } from 'react';
import PluginManager, { PluginComponent, PluginService } from './PluginManager';
import { api, Plugin } from '../mocks/api';

interface PluginContextType {
  components: Map<string, PluginComponent>;
  services: Map<string, PluginService>;
  enabledPlugins: Plugin[];
  loading: boolean;
  error: Error | null;
  refreshPlugins: (sellerId: string) => Promise<void>;
  togglePlugin: (sellerId: string, pluginId: string) => Promise<void>;
}

const PluginContext = createContext<PluginContextType | undefined>(undefined);

export const PluginProvider: React.FC<{ sellerId: string; children: React.ReactNode }> = ({
  sellerId,
  children,
}) => {
  const [enabledPlugins, setEnabledPlugins] = useState<Plugin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const pluginManager = PluginManager.getInstance();

  const refreshPlugins = async (sellerId: string) => {
    try {
      setLoading(true);
      setError(null);
      const plugins = await api.getEnabledPlugins(sellerId);
      setEnabledPlugins(plugins);
    } catch (err) {
      setError(err as Error);
      console.error('Error refreshing plugins:', err);
    } finally {
      setLoading(false);
    }
  };

  const togglePlugin = async (sellerId: string, pluginId: string) => {
    try {
      await api.togglePlugin(sellerId, pluginId);
      await refreshPlugins(sellerId);
    } catch (err) {
      setError(err as Error);
      console.error('Error toggling plugin:', err);
    }
  };

  useEffect(() => {
    refreshPlugins(sellerId);
  }, [sellerId]);

  const value = {
    components: pluginManager.getAllComponents(),
    services: pluginManager.getAllServices(),
    enabledPlugins,
    loading,
    error,
    refreshPlugins,
    togglePlugin,
  };

  return <PluginContext.Provider value={value}>{children}</PluginContext.Provider>;
};

export const usePlugins = () => {
  const context = useContext(PluginContext);
  if (context === undefined) {
    throw new Error('usePlugins must be used within a PluginProvider');
  }
  return context;
};

export default PluginContext;
