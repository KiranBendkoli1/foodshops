import React from 'react';
import { Button } from 'antd';
import ImageCarousel from "../UI/ImageCarousel";
import classes from './OwnersHomepage.module.css';

const OwnerShopCard = ({ shop, contact, onManageOffers }) => {
  return (
    <div className={classes.detailsCard}>
      <div className={classes.cardHeader}>
        <h2 className={classes.shopTitle}>{shop.title}</h2>
        <span className={classes.shopType}>{shop.type}</span>
      </div>
      
      <div className={classes.detailsBody}>
        <div className={classes.imageGallery}>
          <ImageCarousel images={shop.images || []} />
        </div>
        
        <div className={classes.infoList}>
          <div className={classes.infoItem}>
            <span className="material-symbols-outlined">restaurant</span>
            <strong>Speciality:</strong> {shop.speciality}
          </div>
          <div className={classes.infoItem}>
            <span className="material-symbols-outlined">description</span>
            <strong>Description:</strong> {shop.description}
          </div>
          <div className={classes.infoItem}>
            <span className="material-symbols-outlined">location_on</span>
            <strong>Address:</strong> {shop.location}
          </div>
          <div className={classes.infoItem}>
             <span className="material-symbols-outlined">call</span>
             <strong>Contact:</strong> {contact}
          </div>
        </div>

        <div className={classes.actions}>
          <Button type="primary" onClick={onManageOffers} block ghost>
            Manage Offers
          </Button>
          <Button type="default" block>
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OwnerShopCard;
