import React from 'react';
import { RWebShare } from 'react-web-share';
import { LikeOutlined, DislikeOutlined, ChatBubbleOutline, ShareOutline } from '../UI/Icons';
import classes from './FoodPlace.module.css';

const FoodPlaceActions = ({ 
  likes, 
  dislikes, 
  commentsCount, 
  isLiked, 
  isDisliked, 
  onLike, 
  onDislike, 
  onCommentsClick,
  onRateClick,
  shareData 
}) => {
  return (
    <div className={classes.actions}>
      <div className={classes.leftActions}>
        <button 
          className={`${classes.actionButton} ${isLiked ? classes.active : ''}`} 
          onClick={onLike}
        >
          <LikeOutlined filled={isLiked} />
          <span>{likes}</span>
        </button>
        
        <button 
          className={`${classes.actionButton} ${isDisliked ? classes.active : ''}`} 
          onClick={onDislike}
        >
          <DislikeOutlined filled={isDisliked} />
          <span>{dislikes}</span>
        </button>
        
        <button className={classes.actionButton} onClick={onCommentsClick}>
          <ChatBubbleOutline />
          <span>{commentsCount}</span>
        </button>

        <button className={classes.actionButton} onClick={onRateClick} title="Rate restaurant">
          <span className="material-symbols-outlined" style={{fontSize: '1.25rem'}}>stars</span>
        </button>
        
        <RWebShare data={shareData}>
          <button className={classes.actionButton}>
            <ShareOutline />
          </button>
        </RWebShare>
      </div>
    </div>
  );
};

export default FoodPlaceActions;
