import React from 'react';

export type PluginComponent = React.ComponentType<any>;
export type PluginService = Record<string, Function>;

class PluginManager {
  private static instance: PluginManager;
  private components: Map<string, PluginComponent>;
  private services: Map<string, PluginService>;

  private constructor() {
    this.components = new Map();
    this.services = new Map();
  }

  public static getInstance(): PluginManager {
    if (!PluginManager.instance) {
      PluginManager.instance = new PluginManager();
    }
    return PluginManager.instance;
  }

  public registerComponent(name: string, component: PluginComponent): void {
    if (this.components.has(name)) {
      console.warn(`Component ${name} is already registered. It will be overwritten.`);
    }
    this.components.set(name, component);
  }

  public registerService(name: string, service: PluginService): void {
    if (this.services.has(name)) {
      console.warn(`Service ${name} is already registered. It will be overwritten.`);
    }
    this.services.set(name, service);
  }

  public getComponent(name: string): PluginComponent | undefined {
    return this.components.get(name);
  }

  public getService(name: string): PluginService | undefined {
    return this.services.get(name);
  }

  public getAllComponents(): Map<string, PluginComponent> {
    return new Map(this.components);
  }

  public getAllServices(): Map<string, PluginService> {
    return new Map(this.services);
  }

  public clearRegistry(): void {
    this.components.clear();
    this.services.clear();
  }
}

export default PluginManager;
