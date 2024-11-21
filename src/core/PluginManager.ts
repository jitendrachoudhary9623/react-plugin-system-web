export type PluginComponent = React.ComponentType<any>;
export type PluginService = (...args: any[]) => any;

export interface PluginConfigFieldValidation {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: string;
}

export interface PluginConfigFieldOption {
  label: string;
  value: string;
}

export interface PluginConfigField {
  type: 'text' | 'number' | 'boolean' | 'color' | 'select';
  label: string;
  key: string;
  value: any;
  validation?: PluginConfigFieldValidation;
  options?: PluginConfigFieldOption[];
  affectsSharedData?: boolean;
  description?: string;
}

export interface PluginEvent {
  type: string;
  pluginId?: string;
  key?: string;
  value?: any;
  timestamp?: number;
  [key: string]: any;
}

export interface SharedData {
  [key: string]: any;
}

export interface PluginEventData {
  type: string;
  data?: any;
}

type EventListener = (event: PluginEvent) => void;

class PluginManager {
  private static instance: PluginManager;
  private components: Map<string, PluginComponent>;
  private services: Map<string, PluginService>;
  private sharedData: Map<string, any>;
  private eventListeners: Map<string, Set<EventListener>>;
  private configFields: Map<string, PluginConfigField[]>;

  private constructor() {
    this.components = new Map();
    this.services = new Map();
    this.sharedData = new Map();
    this.eventListeners = new Map();
    this.configFields = new Map();
  }

  public static getInstance(): PluginManager {
    if (!PluginManager.instance) {
      PluginManager.instance = new PluginManager();
    }
    return PluginManager.instance;
  }

  public registerComponent(name: string, component: PluginComponent): void {
    this.components.set(name, component);
  }

  public registerService(name: string, service: PluginService): void {
    this.services.set(name, service);
  }

  public registerConfigFields(pluginId: string, fields: PluginConfigField[]): void {
    this.configFields.set(pluginId, fields);
  }

  public getComponent(name: string): PluginComponent | undefined {
    return this.components.get(name);
  }

  public getService(name: string): PluginService | undefined {
    return this.services.get(name);
  }

  public getConfigFields(pluginId: string): PluginConfigField[] {
    return this.configFields.get(pluginId) || [];
  }

  public getAllComponents(): Map<string, PluginComponent> {
    return new Map(this.components);
  }

  public getAllServices(): Map<string, PluginService> {
    return new Map(this.services);
  }

  public setSharedData(key: string, value: any): void {
    this.sharedData.set(key, value);
    this.dispatchEvent({
      type: 'sharedDataChanged',
      key,
      value,
      timestamp: Date.now()
    });
  }

  public getSharedData(key: string): any {
    return this.sharedData.get(key);
  }

  public addEventListener(type: string, listener: EventListener): void {
    if (!this.eventListeners.has(type)) {
      this.eventListeners.set(type, new Set());
    }
    this.eventListeners.get(type)?.add(listener);
  }

  public removeEventListener(type: string, listener: EventListener): void {
    this.eventListeners.get(type)?.delete(listener);
  }

  public dispatchEvent(event: PluginEvent): void {
    const listeners = this.eventListeners.get(event.type);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(event);
        } catch (error) {
          console.error(`Error in plugin event listener:`, error);
        }
      });
    }
  }

  public reset(): void {
    this.components.clear();
    this.services.clear();
    this.sharedData.clear();
    this.eventListeners.clear();
    this.configFields.clear();
  }
}

export default PluginManager;
