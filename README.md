# React Plugin System

A flexible and powerful plugin system for React applications that enables dynamic loading of UI components and integration services. This system allows sellers to customize their buyer-facing websites through a user-friendly dashboard.

## Features

- 🔌 Dynamic plugin loading and management
- ⚙️ Real-time configuration updates
- 🎨 UI and integration plugin support
- 🔄 Shared data and event system
- 📱 Responsive design support
- 🌓 Dark mode compatibility
- 🛡️ TypeScript support
- 🚀 Performance optimized

## Documentation

- [Plugin System Documentation](./docs/PLUGIN_SYSTEM.md) - Complete system documentation
- [Quick Start Guide](./docs/QUICK_START.md) - Create your first plugin in 5 minutes
- [Troubleshooting Guide](./docs/TROUBLESHOOTING.md) - Common issues and solutions

## Getting Started

1. Install dependencies:
```bash
npm install react-router-dom @types/react-router-dom
```

2. Set up the plugin provider:
```tsx
import { PluginProvider } from './core/PluginContext';

function App() {
  return (
    <PluginProvider sellerId="your-seller-id">
      <YourApp />
    </PluginProvider>
  );
}
```

3. Add plugin slots to your app:
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

## Available Plugins

### UI Plugins
- **MarqueePlugin**: Scrolling announcements and offers
- **UserGreeting**: Personalized user greetings
- **CartSummaryPlugin**: Shopping cart summary
- **DiscountBanner**: Promotional banners
- **ProductGallery**: Enhanced product image display
- **ProductBadges**: Dynamic product status badges
- **SocialShare**: Social media sharing buttons

### Integration Plugins
- **RecommendationEngine**: Product recommendations
- **LiveChat**: Customer support integration

## Plugin Locations

Plugins can be rendered in various locations:
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

## Architecture

The plugin system consists of several key components:

- **PluginManager**: Core singleton managing plugin registration and lifecycle
- **PluginContext**: React context providing plugin data and methods
- **PluginSlot**: Component for rendering plugins in specific locations
- **SellerDashboard**: UI for managing plugin configuration

## Development

### Creating a New Plugin

1. Create plugin directory:
```bash
mkdir src/plugins/YourPlugin
```

2. Create required files:
```
YourPlugin/
  ├── index.tsx
  └── styles.css
```

3. Implement plugin:
```tsx
export const register = (pluginManager: any) => {
  pluginManager.registerComponent('YourPlugin', YourComponent);
  pluginManager.registerConfigFields('your-plugin', configFields);
};
```

### Testing

1. Run development server:
```bash
npm start
```

2. Access seller dashboard at `/seller`
3. Configure and test your plugin
4. Check browser console for errors

## Best Practices

1. **Performance**
   - Use React.lazy for code splitting
   - Implement proper cleanup
   - Optimize re-renders

2. **Styling**
   - Use scoped CSS classes
   - Support dark mode
   - Make components responsive

3. **Error Handling**
   - Implement error boundaries
   - Provide fallback UI
   - Log errors appropriately

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Support

- Check documentation
- Review existing plugins
- Submit issues
- Contact development team

## License

MIT License - feel free to use this plugin system in your own projects.
