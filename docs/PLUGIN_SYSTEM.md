# Plugin System Documentation

## Table of Contents
1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Creating a New Plugin](#creating-a-new-plugin)
4. [Plugin Configuration](#plugin-configuration)
5. [Shared Data & Events](#shared-data--events)
6. [Plugin Locations](#plugin-locations)
7. [Best Practices](#best-practices)
8. [API Reference](#api-reference)
9. [Troubleshooting](#troubleshooting)

## Overview

The plugin system allows developers to create modular, reusable components that can be dynamically loaded and configured by sellers. Plugins can be either UI components or integration services, and they can be enabled/disabled and configured through the seller dashboard.

### Key Features
- Dynamic plugin loading
- Configuration management
- Shared data between plugins
- Event system for plugin communication
- Location-based rendering
- Error boundary protection
- TypeScript support

## Getting Started

### Installation

1. Install the required dependencies:
```bash
npm install react-router-dom @types/react-router-dom
```

2. Set up the plugin system in your React application:
```tsx
// App.tsx
import { PluginProvider } from './core/PluginContext';

function App() {
  return (
    <PluginProvider sellerId="your-seller-id">
      <YourApp />
    </PluginProvider>
  );
}
```

### Basic Usage

To render plugins in your application:
```tsx
import { PluginSlot } from './components/PluginSlot';

function YourComponent() {
  return (
    <div>
      <PluginSlot location="header" />
    </div>
  );
}
```

## Creating a New Plugin

### 1. Create Plugin Files
Create a new directory in `src/plugins/YourPlugin` with the following files:
```
src/plugins/YourPlugin/
  ├── index.tsx
  └── styles.css
```

### 2. Implement Plugin Component
```tsx
// src/plugins/YourPlugin/index.tsx
import React from 'react';
import { usePlugins, useSharedData, usePluginEvent } from '../../core/PluginContext';
import './styles.css';

interface YourPluginProps {
  pluginId?: string;
  isSellerView?: boolean;
  // Add your configuration props here
}

const YourPlugin: React.FC<YourPluginProps> = ({
  pluginId,
  isSellerView,
  ...config
}) => {
  // Access shared data
  const [userData] = useSharedData('user');

  // Listen to events
  usePluginEvent('someEvent', (event) => {
    console.log('Event received:', event);
  });

  return (
    <div className="your-plugin">
      {/* Your plugin content */}
    </div>
  );
};

// Register plugin
export const register = (pluginManager: any) => {
  pluginManager.registerComponent('YourPlugin', YourPlugin);
  
  // Register configuration fields
  pluginManager.registerConfigFields('your-plugin', [
    {
      type: 'text',
      label: 'Title',
      key: 'title',
      value: 'Default Title',
      validation: {
        required: true
      }
    }
    // Add more configuration fields
  ]);
};

export default YourPlugin;
```

### 3. Add Plugin to Mock API
```typescript
// src/mocks/api.ts
{
  id: 'your-plugin',
  name: 'Your Plugin',
  description: 'Description of your plugin',
  type: 'ui', // or 'integration'
  enabled: true,
  entryPoint: 'YourPlugin',
  locations: ['your-location'],
  category: 'Your Category',
  config: {
    // Default configuration
  },
  configFields: [
    // Configuration fields
  ]
}
```

## Plugin Configuration

### Configuration Field Types
- `text`: Text input
- `number`: Numeric input with optional validation
- `boolean`: Checkbox
- `color`: Color picker
- `select`: Dropdown with options

### Example Configuration
```typescript
configFields: [
  {
    type: 'text',
    label: 'Title',
    key: 'title',
    value: 'Default Value',
    validation: {
      required: true
    }
  },
  {
    type: 'select',
    label: 'Theme',
    key: 'theme',
    value: 'light',
    options: [
      { label: 'Light', value: 'light' },
      { label: 'Dark', value: 'dark' }
    ]
  }
]
```

## Shared Data & Events

### Using Shared Data
```typescript
// Access shared data
const [userData, setUserData] = useSharedData('user');

// Update shared data
setUserData({ ...userData, name: 'New Name' });
```

### Using Events
```typescript
// Listen to events
usePluginEvent('eventName', (event) => {
  console.log('Event received:', event);
});

// Dispatch events
const { dispatchEvent } = usePlugins();
dispatchEvent({
  type: 'eventName',
  data: { /* event data */ }
});
```

## Plugin Locations

Available locations for plugins:
- `header`
- `footer`
- `home-banner`
- `home-featured`
- `product-list`
- `product-detail`
- `cart-summary`
- `checkout`
- `sidebar`
- `product-gallery`
- `product-badges`
- `product-customization`
- `top-banner`

## Best Practices

1. **Error Handling**
   - Always wrap async operations in try/catch blocks
   - Use error boundaries for UI components
   - Provide meaningful error messages

2. **Performance**
   - Use React.lazy for dynamic imports
   - Implement proper cleanup in useEffect hooks
   - Optimize re-renders using useMemo and useCallback

3. **Configuration**
   - Provide sensible default values
   - Include validation rules where necessary
   - Use descriptive labels and help text

4. **Styling**
   - Use scoped CSS classes to avoid conflicts
   - Support both light and dark themes
   - Make components responsive

## API Reference

### PluginManager Methods
```typescript
registerComponent(name: string, component: PluginComponent): void
registerService(name: string, service: PluginService): void
registerConfigFields(pluginId: string, fields: PluginConfigField[]): void
getComponent(name: string): PluginComponent | undefined
getService(name: string): PluginService | undefined
setSharedData(key: string, value: any): void
getSharedData(key: string): any
addEventListener(type: string, listener: EventListener): void
removeEventListener(type: string, listener: EventListener): void
dispatchEvent(event: PluginEvent): void
```

### Hooks
```typescript
usePlugins(): PluginContextType
usePluginEvent(type: string, handler: (event: any) => void): void
useSharedData<T>(key: string): [T | undefined, (value: T) => void]
```

## Troubleshooting

### Common Issues

1. **Plugin not rendering**
   - Check if the plugin is enabled
   - Verify the location is correct
   - Check for console errors

2. **Configuration not updating**
   - Ensure configFields are properly registered
   - Check if the plugin ID matches
   - Verify the configuration update API call

3. **Events not working**
   - Confirm event type matches
   - Check if event listeners are properly registered
   - Verify event data structure

### Debug Tips
- Use browser developer tools to inspect components
- Check the Redux DevTools for state changes
- Enable debug mode in test plugins
- Monitor network requests for API calls

### Support

For additional support:
1. Check the existing plugins for examples
2. Review the TypeScript definitions
3. Contact the development team
4. Submit issues through the project's issue tracker
