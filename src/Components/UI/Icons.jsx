import React from 'react';

const Icon = ({ name, filled = false, className = '', ...props }) => (
  <span 
    className={`material-symbols-outlined ${className}`} 
    style={{ fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0" }}
    {...props}
  >
    {name}
  </span>
);

export const LikeOutlined = (props) => <Icon name="thumb_up" {...props} />;
export const LikeFilled = (props) => <Icon name="thumb_up" filled {...props} />;

export const DislikeOutlined = (props) => <Icon name="thumb_down" {...props} />;
export const DislikeFilled = (props) => <Icon name="thumb_down" filled {...props} />;

export const ChatBubbleOutline = (props) => <Icon name="chat_bubble" {...props} />;
export const ShareOutline = (props) => <Icon name="share" {...props} />;
export const LocationOnOutline = (props) => <Icon name="location_on" {...props} />;
export const ShoppingCartOutline = (props) => <Icon name="shopping_cart" {...props} />;
