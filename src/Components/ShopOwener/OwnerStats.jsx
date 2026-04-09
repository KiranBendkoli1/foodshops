import React from 'react';
import StatCard from '../UI/StatCard';
import classes from './OwnersHomepage.module.css';

const OwnerStats = ({ likes, dislikes, commentsCount, onCommentsClick }) => {
  return (
    <div className={classes.statsSection}>
      <StatCard 
        title="Total Likes" 
        value={likes || 0} 
        icon="thumb_up" 
        trend="up" 
        trendValue={5} 
      />
      <StatCard 
        title="Total Dislikes" 
        value={dislikes || 0} 
        icon="thumb_down" 
        trend="down" 
        trendValue={2} 
      />
      <StatCard 
        title="Reviews" 
        value={commentsCount || 0} 
        icon="chat_bubble" 
        onClick={onCommentsClick}
      />
    </div>
  );
};

export default OwnerStats;
