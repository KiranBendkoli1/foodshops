import React from 'react';
import classes from './FoodPlace.module.css';

const FoodPlaceGallery = ({ mainImage, title, type, rating = "4.8", onClick }) => {
  return (
    <div className={classes.imageContainer} onClick={onClick}>
      <img src={mainImage} alt={title} className={classes.image} />
      <div className={classes.ratingBadge}>
        <span className="material-symbols-outlined">star</span>
        <span className={classes.ratingText}>{rating}</span>
      </div>
      <div className={classes.typeBadges}>
        {(() => {
          let types = [];
          if (Array.isArray(type)) types = type;
          else if (typeof type === 'string') {
            try {
              const parsed = JSON.parse(type);
              types = Array.isArray(parsed) ? parsed : [parsed];
            } catch {
              types = [type];
            }
          }
          
          return types.map(t => {
            if (typeof t !== 'string') return null;
            const nt = t.toLowerCase().replace('-', ' ');
            if (nt.includes('non veg')) {
              return <span key="non-veg" className={classes.nonVegBadge}>Non-Veg</span>;
            }
            if (nt.includes('veg')) {
              return <span key="veg" className={classes.vegBadge}>Veg</span>;
            }
            return null;
          });
        })()}
      </div>
    </div>
  );
};

export default FoodPlaceGallery;
