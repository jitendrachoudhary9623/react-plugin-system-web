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
  isSellerView?: boolean;
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
  isSellerView = false
}) => {
  const [config, setConfig] = useState({
    speed,
    backgroundColor,
    textColor,
    offers: [...offers]
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [newOffer, setNewOffer] = useState<Offer>({
    id: '',
    text: '',
    link: '',
    isExternal: false
  });

  const { getConfigFields, updateConfigField } = usePlugins();

  // Listen for configuration changes
  usePluginEvent('configurationChanged', (event) => {
    if (event.pluginId === pluginId) {
      setConfig(prev => ({
        ...prev,
        [event.key]: event.value
      }));
    }
  });

  // Initialize configuration from plugin settings
  useEffect(() => {
    if (pluginId) {
      const fields = getConfigFields(pluginId);
      const newConfig: any = {};
      fields.forEach(field => {
        newConfig[field.key] = field.value;
      });
      setConfig(prev => ({
        ...prev,
        ...newConfig
      }));
    }
  }, [pluginId, getConfigFields]);

  const handleAddOffer = () => {
    if (newOffer.text && newOffer.link) {
      const updatedOffers = [...config.offers, { ...newOffer, id: Date.now().toString() }];
      setConfig(prev => ({ ...prev, offers: updatedOffers }));
      updateConfigField(pluginId!, 'offers', updatedOffers);
      setNewOffer({ id: '', text: '', link: '', isExternal: false });
    }
  };

  const handleEditOffer = (offer: Offer) => {
    setEditingOffer(offer);
    setIsEditing(true);
  };

  const handleUpdateOffer = () => {
    if (editingOffer && editingOffer.text && editingOffer.link) {
      const updatedOffers = config.offers.map(o => 
        o.id === editingOffer.id ? editingOffer : o
      );
      setConfig(prev => ({ ...prev, offers: updatedOffers }));
      updateConfigField(pluginId!, 'offers', updatedOffers);
      setEditingOffer(null);
      setIsEditing(false);
    }
  };

  const handleDeleteOffer = (offerId: string) => {
    const updatedOffers = config.offers.filter(o => o.id !== offerId);
    setConfig(prev => ({ ...prev, offers: updatedOffers }));
    updateConfigField(pluginId!, 'offers', updatedOffers);
  };

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

  const renderEditForm = () => (
    <div className="marquee-edit-form">
      <h3>{editingOffer ? 'Edit Offer' : 'Add New Offer'}</h3>
      <div className="form-group">
        <input
          type="text"
          placeholder="Offer Text"
          value={editingOffer ? editingOffer.text : newOffer.text}
          onChange={(e) => editingOffer 
            ? setEditingOffer({ ...editingOffer, text: e.target.value })
            : setNewOffer({ ...newOffer, text: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Link URL"
          value={editingOffer ? editingOffer.link : newOffer.link}
          onChange={(e) => editingOffer
            ? setEditingOffer({ ...editingOffer, link: e.target.value })
            : setNewOffer({ ...newOffer, link: e.target.value })
          }
        />
        <label>
          <input
            type="checkbox"
            checked={editingOffer ? editingOffer.isExternal : newOffer.isExternal}
            onChange={(e) => editingOffer
              ? setEditingOffer({ ...editingOffer, isExternal: e.target.checked })
              : setNewOffer({ ...newOffer, isExternal: e.target.checked })
            }
          />
          External Link
        </label>
        <div className="form-actions">
          {editingOffer ? (
            <>
              <button onClick={handleUpdateOffer}>Update</button>
              <button onClick={() => {
                setEditingOffer(null);
                setIsEditing(false);
              }}>Cancel</button>
            </>
          ) : (
            <button onClick={handleAddOffer}>Add</button>
          )}
        </div>
      </div>
    </div>
  );

  const renderOffersList = () => (
    <div className="marquee-offers-list">
      <h3>Current Offers</h3>
      {config.offers.map(offer => (
        <div key={offer.id} className="offer-item">
          <div className="offer-content">
            <span className="offer-text">{offer.text}</span>
            <span className="offer-link">{offer.link}</span>
          </div>
          <div className="offer-actions">
            <button onClick={() => handleEditOffer(offer)}>Edit</button>
            <button onClick={() => handleDeleteOffer(offer.id)}>Delete</button>
          </div>
        </div>
      ))}
      <button className="add-offer-button" onClick={() => setIsEditing(true)}>
        Add New Offer
      </button>
    </div>
  );

  return (
    <div className="marquee-plugin">
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
      {isSellerView && (isEditing ? renderEditForm() : renderOffersList())}
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
    }
  ]);
};

export default MarqueePlugin;
