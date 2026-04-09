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
        {type && type.includes('Veg') && <span className={classes.vegBadge}>Veg</span>}
        {type && type.includes('Non Veg') && <span className={classes.nonVegBadge}>Non-Veg</span>}
      </div>
    </div>
  );
};

export default FoodPlaceGallery;
