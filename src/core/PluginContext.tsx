import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PluginManager, { PluginComponent, PluginService } from '../core/PluginManager';
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

export default PluginContext;
