import React, { useCallback } from 'react';
import { Modal, message } from 'antd';
import classes from './Modals.module.css';

const OffersModal = ({ isOpen, onClose, title, discounts, images }) => {
  const copyToClipboard = useCallback((code) => {
    navigator.clipboard.writeText(code);
    message.success('Code copied to clipboard!');
  }, []);

  const placeImage = images?.[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80';

  return (
    <Modal
      title={null}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={600}
      className={classes.customModal}
    >
      <div className={classes.modalContent}>
        <div className={classes.offerHero}>
          <img src={placeImage} alt={title} />
          <div className={classes.offerHeroContent}>
            <h2 className={classes.offerPlaceTitle}>{title}</h2>
            <p className={classes.offerPlaceSubtitle}>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
              Exclusive Member Deals
            </p>
          </div>
        </div>

        <div className={classes.offerListArea}>
          {discounts && discounts.length > 0 ? (
            discounts.map((discount, index) => {
              const [code, value, expiry] = discount.split(' | ');
              const isExpired = expiry ? new Date(expiry) < new Date() : false;
              
              return (
                <div 
                  key={index} 
                  className={`${classes.resOfferCard} ${isExpired ? classes.expired : ''}`} 
                  onClick={() => !isExpired && copyToClipboard(code)}
                >
                  <div className={classes.resOfferIcon}>
                    <span className="material-symbols-outlined">{isExpired ? 'block' : 'local_offer'}</span>
                  </div>
                  <div className={classes.resOfferDetails}>
                    <h3 className={classes.resOfferTitle}>{code}</h3>
                    <p className={classes.resOfferSub}>
                      {isExpired ? 'This offer has expired' : 'Click to copy this special offer code'}
                    </p>
                  </div>
                  <div className={classes.resOfferBadge}>{isExpired ? 'EXPIRED' : (value || 'Special')}</div>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '3rem', marginBottom: '1rem' }}>sentiment_dissappointed</span>
              <p>No active offers for this restaurant right now.</p>
            </div>
          )}
          
          <button className={classes.submitBtn} style={{ marginTop: '1rem' }} onClick={onClose}>
            Claim These Offers
          </button>
          <p style={{ textAlign: 'center', fontSize: '0.7rem', color: '#64748b', marginTop: '1rem' }}>
            Terms & Conditions apply. Valid while stocks last.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default OffersModal;
