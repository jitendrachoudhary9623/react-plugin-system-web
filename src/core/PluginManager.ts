import React from 'react';

export type PluginComponent = React.ComponentType<any>;
export type PluginService = Record<string, Function>;

export interface SharedData {
  user?: {
    id: string;
    name: string;
    email: string;
    role: 'buyer' | 'seller';
  };
  cart?: {
    items: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
    }>;
    total: number;
  };
  [key: string]: any; // Allow for additional data types
}

export interface PluginEvent {
  type: string;
  payload?: any;
}

export type PluginEventHandler = (event: PluginEvent) => void;

export interface PluginConfigField {
  type: 'text' | 'number' | 'boolean' | 'color' | 'select';
  label: string;
  key: string;
  value: any;
  options?: Array<{ label: string; value: any }>;
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
  };
}

class PluginManager {
  private static instance: PluginManager;
  private components: Map<string, PluginComponent>;
  private services: Map<string, PluginService>;
  private sharedData: SharedData;
  private eventHandlers: Map<string, Set<PluginEventHandler>>;
  private configFields: Map<string, PluginConfigField[]>;

  private constructor() {
    this.components = new Map();
    this.services = new Map();
    this.sharedData = {};
    this.eventHandlers = new Map();
    this.configFields = new Map();
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

  public registerConfigFields(pluginId: string, fields: PluginConfigField[]): void {
    this.configFields.set(pluginId, fields);
  }

  public getConfigFields(pluginId: string): PluginConfigField[] {
    return this.configFields.get(pluginId) || [];
  }

  public updateConfigField(pluginId: string, key: string, value: any): void {
    const fields = this.configFields.get(pluginId);
    if (fields) {
      const field = fields.find(f => f.key === key);
      if (field) {
        field.value = value;
      }
    }
  }

  public addEventListener(type: string, handler: PluginEventHandler): void {
    if (!this.eventHandlers.has(type)) {
      this.eventHandlers.set(type, new Set());
    }
    this.eventHandlers.get(type)?.add(handler);
  }

  public removeEventListener(type: string, handler: PluginEventHandler): void {
    this.eventHandlers.get(type)?.delete(handler);
  }

  public dispatchEvent(event: PluginEvent): void {
    this.eventHandlers.get(event.type)?.forEach(handler => {
      try {
        handler(event);
      } catch (error) {
        console.error(`Error in plugin event handler for ${event.type}:`, error);
      }
    });
  }

  public setSharedData(key: string, value: any): void {
    this.sharedData[key] = value;
  }

  public getSharedData<T>(key: string): T | undefined {
    return this.sharedData[key] as T;
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
    this.sharedData = {};
    this.eventHandlers.clear();
    this.configFields.clear();
  }
}

export default PluginManager;
