import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePlugins, usePluginEvent } from '../../core/PluginContext';
import './styles.css';

interface Offer {
  id: string;
  text: string;
  link: string;
  isExternal?: boolean;
}

interface MarqueePluginProps {
  speed?: number;
  backgroundColor?: string;
  textColor?: string;
  offers?: Offer[];
  pluginId?: string;
  customOffer?: string;
}

const defaultOffers: Offer[] = [
  {
    id: '1',
    text: '🔥 Hot Deal! 50% off on Electronics - Shop Now!',
    link: '/products?category=electronics'
  },
  {
    id: '2',
    text: '🎉 Free Shipping on orders above $50',
    link: '/shipping'
  },
  {
    id: '3',
    text: '🎁 Special Holiday Offers - Limited Time Only',
    link: '/offers'
  },
  {
    id: '4',
    text: '🌟 New Collection Launched - Check it out!',
    link: '/new-arrivals'
  }
];

const MarqueePlugin: React.FC<MarqueePluginProps> = ({
  speed = 30,
  backgroundColor = '#3498db',
  textColor = '#ffffff',
  offers = defaultOffers,
  pluginId,
  customOffer = ''
}) => {
  const [config, setConfig] = useState({
    speed,
    backgroundColor,
    textColor,
    offers: [...offers],
    customOffer
  });

  const { getConfigFields } = usePlugins();

  // Listen for configuration changes
  usePluginEvent('configurationChanged', (event) => {
    if (event.pluginId === pluginId) {
      setConfig(prev => {
        const newConfig = { ...prev, [event.key]: event.value };
        
        // Handle custom offer updates
        if (event.key === 'customOffer' && event.value) {
          const customOfferObj: Offer = {
            id: 'custom',
            text: `🎯 ${event.value}`,
            link: '/custom-offer'
          };
          
          // Remove old custom offer if exists
          const filteredOffers = prev.offers.filter(o => o.id !== 'custom');
          newConfig.offers = [customOfferObj, ...filteredOffers];
        }
        
        return newConfig;
      });
    }
  });

  // Initialize configuration from plugin settings
  useEffect(() => {
    if (pluginId) {
      const fields = getConfigFields(pluginId);
      const newConfig: any = {};
      fields.forEach(field => {
        newConfig[field.key] = field.value;
        
        // Handle initial custom offer
        if (field.key === 'customOffer' && field.value) {
          const customOfferObj: Offer = {
            id: 'custom',
            text: `🎯 ${field.value}`,
            link: '/custom-offer'
          };
          newConfig.offers = [customOfferObj, ...offers];
        }
      });
      setConfig(prev => ({
        ...prev,
        ...newConfig
      }));
    }
  }, [pluginId, getConfigFields]);

  const renderOffer = (offer: Offer) => {
    if (offer.isExternal) {
      return (
        <a 
          key={offer.id}
          href={offer.link}
          target="_blank"
          rel="noopener noreferrer"
          className="marquee-link"
          style={{ color: config.textColor }}
        >
          {offer.text}
        </a>
      );
    }

    return (
      <Link 
        key={offer.id}
        to={offer.link}
        className="marquee-link"
        style={{ color: config.textColor }}
      >
        {offer.text}
      </Link>
    );
  };

  return (
    <div 
      className="marquee-container"
      style={{ 
        backgroundColor: config.backgroundColor,
        '--background-color': config.backgroundColor
      } as React.CSSProperties}
    >
      <div 
        className="marquee-content"
        style={{ 
          animationDuration: `${config.offers.length * config.speed}s`
        }}
      >
        {config.offers.map(offer => renderOffer(offer))}
      </div>
      <div 
        className="marquee-content"
        style={{ 
          animationDuration: `${config.offers.length * config.speed}s`
        }}
      >
        {config.offers.map(offer => renderOffer(offer))}
      </div>
    </div>
  );
};

// Plugin registration
export const register = (pluginManager: any) => {
  pluginManager.registerComponent('MarqueePlugin', MarqueePlugin);
  
  // Register configuration fields
  pluginManager.registerConfigFields('marquee-plugin', [
    {
      type: 'number',
      label: 'Animation Speed',
      key: 'speed',
      value: 30,
      validation: {
        min: 10,
        max: 60
      },
      description: 'Speed of the marquee animation (lower is faster)'
    },
    {
      type: 'color',
      label: 'Background Color',
      key: 'backgroundColor',
      value: '#3498db',
      description: 'Background color of the marquee banner'
    },
    {
      type: 'color',
      label: 'Text Color',
      key: 'textColor',
      value: '#ffffff',
      description: 'Color of the text in the marquee'
    },
    {
      type: 'text',
      label: 'Custom Offer Text',
      key: 'customOffer',
      value: '',
      description: 'Add a custom offer message',
      affectsSharedData: true
    }
  ]);
};

export default MarqueePlugin;
