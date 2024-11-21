import React from 'react';
import { Link } from 'react-router-dom';
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
  offers = defaultOffers
}) => {
  const renderOffer = (offer: Offer) => {
    if (offer.isExternal) {
      return (
        <a 
          key={offer.id}
          href={offer.link}
          target="_blank"
          rel="noopener noreferrer"
          className="marquee-link"
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
      >
        {offer.text}
      </Link>
    );
  };

  return (
    <div 
      className="marquee-container"
      style={{ backgroundColor, color: textColor }}
    >
      <div 
        className="marquee-content"
        style={{ 
          animationDuration: `${offers.length * speed}s`
        }}
      >
        {offers.map(offer => renderOffer(offer))}
      </div>
      <div 
        className="marquee-content"
        style={{ 
          animationDuration: `${offers.length * speed}s`
        }}
      >
        {offers.map(offer => renderOffer(offer))}
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
      }
    },
    {
      type: 'color',
      label: 'Background Color',
      key: 'backgroundColor',
      value: '#3498db'
    },
    {
      type: 'color',
      label: 'Text Color',
      key: 'textColor',
      value: '#ffffff'
    }
  ]);
};

export default MarqueePlugin;
