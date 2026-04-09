import React from 'react';
import classes from './StatCard.module.css';

const StatCard = ({ title, value, icon, trend, trendValue }) => {
  return (
    <div className={classes.card}>
      <div className={classes.header}>
        <div className={classes.iconContainer}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        {trend && (
          <div className={`${classes.trend} ${trend === 'up' ? classes.up : classes.down}`}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}%
          </div>
        )}
      </div>
      <div className={classes.content}>
        <h3 className={classes.value}>{value}</h3>
        <p className={classes.title}>{title}</p>
      </div>
    </div>
  );
};

export default StatCard;
