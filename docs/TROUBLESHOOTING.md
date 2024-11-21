# Troubleshooting Guide

## Common Issues and Solutions

### Plugin Not Rendering

#### Symptoms
- Plugin doesn't appear in the expected location
- No errors in console
- Plugin shows in seller dashboard but not in buyer view

#### Solutions

1. **Check Plugin Registration**
```typescript
// Verify plugin registration in index.tsx
export const register = (pluginManager: any) => {
  pluginManager.registerComponent('YourPlugin', YourPlugin); // Is name correct?
};
```

2. **Verify Location**
```typescript
// Check location in api.ts
{
  locations: ['your-location'], // Is location correct?
}

// Check PluginSlot usage
<PluginSlot location="your-location" /> // Does it match?
```

3. **Check Enabled Status**
```typescript
// Verify in api.ts
{
  enabled: true, // Is plugin enabled?
}
```

### Configuration Not Updating

#### Symptoms
- Changes in seller dashboard don't reflect in plugin
- Configuration updates don't persist
- Console shows configuration-related errors

#### Solutions

1. **Check Configuration Fields**
```typescript
// Verify config field registration
pluginManager.registerConfigFields('your-plugin-id', [
  {
    type: 'text',
    label: 'Title',
    key: 'title', // Does this match your component props?
    value: 'Default'
  }
]);
```

2. **Verify Props Usage**
```typescript
const YourPlugin: React.FC<YourPluginProps> = ({
  title, // Are you destructuring the right props?
  ...props
}) => {
  console.log('Props:', props); // Debug props
  return <div>{title}</div>;
};
```

3. **Check Local Storage**
```javascript
// In browser console
console.log(JSON.parse(localStorage.getItem('store_plugins')));
```

### Shared Data Issues

#### Symptoms
- Shared data is undefined
- Updates to shared data don't propagate
- Multiple plugins not syncing

#### Solutions

1. **Check Data Initialization**
```typescript
// In PluginContext
useEffect(() => {
  pluginManager.setSharedData('key', initialValue);
}, []);
```

2. **Verify Hook Usage**
```typescript
// In your plugin
const [data, setData] = useSharedData('key');
if (!data) {
  console.warn('Shared data not found:', 'key');
  return null;
}
```

3. **Debug Data Updates**
```typescript
useEffect(() => {
  console.log('Shared data changed:', data);
}, [data]);
```

### Event System Problems

#### Symptoms
- Events not being received
- Event handlers not firing
- Events firing multiple times

#### Solutions

1. **Check Event Registration**
```typescript
usePluginEvent('eventName', (event) => {
  console.log('Event received:', event); // Add debugging
});
```

2. **Verify Event Dispatch**
```typescript
const { dispatchEvent } = usePlugins();

const handleClick = () => {
  console.log('Dispatching event');
  dispatchEvent({
    type: 'eventName',
    data: { /* your data */ }
  });
};
```

3. **Clean Up Event Listeners**
```typescript
usePluginEvent('eventName', (event) => {
  // Your handler
  return () => {
    // Cleanup code
    console.log('Event listener cleaned up');
  };
});
```

### Styling Conflicts

#### Symptoms
- Plugin styles bleeding into other components
- Inconsistent appearance across plugins
- Dark mode not working

#### Solutions

1. **Scope CSS Classes**
```css
/* Use plugin-specific prefixes */
.your-plugin-name {
  /* styles */
}

.your-plugin-name__element {
  /* styles */
}
```

2. **Use CSS Modules**
```typescript
import styles from './styles.module.css';

return <div className={styles.container}></div>;
```

3. **Support Dark Mode**
```css
@media (prefers-color-scheme: dark) {
  .your-plugin {
    background: var(--dark-bg, #1a1a1a);
    color: var(--dark-text, #ffffff);
  }
}
```

### Performance Issues

#### Symptoms
- Slow plugin loading
- UI freezes
- High memory usage

#### Solutions

1. **Implement Code Splitting**
```typescript
const YourPlugin = React.lazy(() => import('./YourPlugin'));

return (
  <Suspense fallback={<Loading />}>
    <YourPlugin />
  </Suspense>
);
```

2. **Optimize Re-renders**
```typescript
const YourPlugin = React.memo(({ data }) => {
  // Your component
});
```

3. **Use Proper Dependencies**
```typescript
useEffect(() => {
  // Effect code
}, [/* only necessary dependencies */]);
```

### TypeScript Errors

#### Symptoms
- Type errors in plugin development
- Missing type definitions
- Incorrect prop types

#### Solutions

1. **Define Plugin Props**
```typescript
interface YourPluginProps {
  pluginId?: string;
  isSellerView?: boolean;
  config?: {
    title?: string;
    enabled?: boolean;
  };
}
```

2. **Use Type Guards**
```typescript
if ('someProperty' in data) {
  // TypeScript now knows data has someProperty
}
```

3. **Add Type Assertions When Necessary**
```typescript
const config = props.config as Required<typeof props.config>;
```

## Debugging Tools

### Browser DevTools
1. React DevTools for component inspection
2. Network tab for API calls
3. Console for error messages
4. Application tab for localStorage

### VSCode Extensions
1. ESLint for code quality
2. Prettier for formatting
3. React snippets for development
4. Debug tools for runtime inspection

### Custom Debug Helpers
```typescript
const DEBUG = process.env.NODE_ENV === 'development';

function debugLog(...args: any[]) {
  if (DEBUG) {
    console.log('[Plugin Debug]:', ...args);
  }
}
```

## Common Error Messages

### "Plugin not found"
- Check plugin ID in registration
- Verify plugin is included in build
- Check import paths

### "Invalid configuration"
- Validate config field types
- Check required fields
- Verify config structure

### "Event listener error"
- Check event type names
- Verify event handler signature
- Debug event payload

## Best Practices for Prevention

1. **Development**
   - Use TypeScript strictly
   - Write unit tests
   - Document code thoroughly

2. **Testing**
   - Test in multiple browsers
   - Check both light and dark modes
   - Verify mobile responsiveness

3. **Maintenance**
   - Keep dependencies updated
   - Monitor error logs
   - Regular performance audits

## Getting Help

1. Check existing plugin examples
2. Review documentation
3. Use the issue tracker
4. Contact support team
