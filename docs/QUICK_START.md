# Quick Start Guide

## Creating Your First Plugin in 5 Minutes

This guide will walk you through creating a simple plugin for the system.

### 1. Create Plugin Files

Create a new directory in `src/plugins/HelloWorldPlugin` with these files:

```
src/plugins/HelloWorldPlugin/
  ├── index.tsx
  └── styles.css
```

### 2. Basic Plugin Implementation

```tsx
// src/plugins/HelloWorldPlugin/index.tsx
import React from 'react';
import './styles.css';

interface HelloWorldPluginProps {
  pluginId?: string;
  message?: string;
  textColor?: string;
}

const HelloWorldPlugin: React.FC<HelloWorldPluginProps> = ({
  message = 'Hello, World!',
  textColor = '#2c3e50'
}) => {
  return (
    <div className="hello-world-plugin" style={{ color: textColor }}>
      {message}
    </div>
  );
};

export const register = (pluginManager: any) => {
  // Register the component
  pluginManager.registerComponent('HelloWorldPlugin', HelloWorldPlugin);
  
  // Register configuration fields
  pluginManager.registerConfigFields('hello-world-plugin', [
    {
      type: 'text',
      label: 'Message',
      key: 'message',
      value: 'Hello, World!',
      validation: {
        required: true
      }
    },
    {
      type: 'color',
      label: 'Text Color',
      key: 'textColor',
      value: '#2c3e50'
    }
  ]);
};

export default HelloWorldPlugin;
```

### 3. Add Basic Styles

```css
/* src/plugins/HelloWorldPlugin/styles.css */
.hello-world-plugin {
  padding: 1rem;
  font-size: 1.2rem;
  text-align: center;
  background: #f8f9fa;
  border-radius: 8px;
  margin: 1rem 0;
}
```

### 4. Register in Mock API

Add your plugin to the `initialPlugins` array in `src/mocks/api.ts`:

```typescript
{
  id: 'hello-world-plugin',
  name: 'Hello World Plugin',
  description: 'A simple example plugin',
  type: 'ui',
  enabled: true,
  entryPoint: 'HelloWorldPlugin',
  locations: ['home-banner'],
  category: 'Examples',
  config: {
    message: 'Hello, World!',
    textColor: '#2c3e50'
  }
}
```

### 5. Use the Plugin

The plugin will now appear in the seller dashboard and can be rendered using:

```tsx
<PluginSlot location="home-banner" />
```

## Next Steps

1. Add shared data usage:
```tsx
const [userData] = useSharedData('user');
```

2. Add event handling:
```tsx
usePluginEvent('customEvent', (event) => {
  console.log('Event received:', event);
});
```

3. Add more configuration options:
```tsx
pluginManager.registerConfigFields('hello-world-plugin', [
  // ... existing fields ...
  {
    type: 'select',
    label: 'Size',
    key: 'size',
    value: 'medium',
    options: [
      { label: 'Small', value: 'small' },
      { label: 'Medium', value: 'medium' },
      { label: 'Large', value: 'large' }
    ]
  }
]);
```

## Common Patterns

### 1. Accessing Plugin Configuration
```tsx
const HelloWorldPlugin: React.FC<HelloWorldPluginProps> = (props) => {
  const { getConfigFields } = usePlugins();
  const config = getConfigFields(props.pluginId!);
  // Use config...
};
```

### 2. Handling Plugin State
```tsx
const HelloWorldPlugin: React.FC<HelloWorldPluginProps> = () => {
  const [isVisible, setIsVisible] = useState(true);
  
  return (
    <div className="hello-world-plugin">
      {isVisible && <div>Content</div>}
      <button onClick={() => setIsVisible(!isVisible)}>
        Toggle
      </button>
    </div>
  );
};
```

### 3. Using Shared Data
```tsx
const HelloWorldPlugin: React.FC<HelloWorldPluginProps> = () => {
  const [userData] = useSharedData('user');
  
  return (
    <div className="hello-world-plugin">
      Hello, {userData?.name}!
    </div>
  );
};
```

### 4. Plugin Communication
```tsx
const HelloWorldPlugin: React.FC<HelloWorldPluginProps> = () => {
  const { dispatchEvent } = usePlugins();
  
  const handleClick = () => {
    dispatchEvent({
      type: 'helloWorld.clicked',
      timestamp: Date.now()
    });
  };
  
  return (
    <div className="hello-world-plugin" onClick={handleClick}>
      Click me!
    </div>
  );
};
```

## Tips & Tricks

1. **Testing Your Plugin**
   - Use the seller dashboard to configure and test
   - Check browser console for errors
   - Test in both light and dark modes

2. **Styling Best Practices**
   - Use scoped class names
   - Support dark mode with CSS variables
   - Make components responsive

3. **Performance**
   - Use React.memo for pure components
   - Avoid unnecessary re-renders
   - Clean up event listeners

4. **Debugging**
   - Use the browser dev tools
   - Check plugin configuration in localStorage
   - Monitor network requests

## Need Help?

1. Check the full [Plugin System Documentation](./PLUGIN_SYSTEM.md)
2. Look at existing plugins for examples
3. Use TypeScript for better type checking
4. Test thoroughly in different locations
