import React from 'react';
import classes from './StarRating.module.css';

const StarRating = ({ rating, onChange, interactive = false, size = '1.25rem' }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className={classes.stars} style={{ fontSize: size }}>
      {stars.map((star) => (
        <span
          key={star}
          className={`${classes.star} ${star <= (rating || 0) ? classes.filled : ''} ${interactive ? classes.interactive : ''}`}
          onClick={() => interactive && onChange && onChange(star)}
        >
          {star <= (rating || 0) ? '★' : '☆'}
        </span>
      ))}
    </div>
  );
};

export default StarRating;
