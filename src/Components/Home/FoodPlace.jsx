import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Modal } from 'antd';
import { updateLikes, updateDislikes } from '../../store/placesSlice';
import useModal from '../../hooks/useModal';

import FoodPlaceGallery from './FoodPlaceGallery';
import FoodPlaceActions from './FoodPlaceActions';
import AuthModal from '../Auth/AuthModal';
import { LocationOnOutline } from '../UI/Icons';

import classes from './FoodPlace.module.css';

const FoodPlace = ({ foodplace, index }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = localStorage.getItem('email');

  const {
    id, title, speciality, location, image, images,
    type, liked, disliked, likes, dislikes,
    comments, discounts
  } = foodplace;

  const [isAuthModalOpen, openAuthModal, closeAuthModal] = useModal();
  const [isOffersModalOpen, openOffersModal, closeOffersModal] = useModal();
  const [isCommentsModalOpen, openCommentsModal, closeCommentsModal] = useModal();

  const handleLike = useCallback(() => {
    if (!user) return openAuthModal();
    dispatch(updateLikes({ id, index, likes, dislikes, user }));
  }, [user, id, index, likes, dislikes, dispatch, openAuthModal]);

  const handleDislike = useCallback(() => {
    if (!user) return openAuthModal();
    dispatch(updateDislikes({ id, index, likes, dislikes, user }));
  }, [user, id, index, likes, dislikes, dispatch, openAuthModal]);

  const mainImage = image || (images && images[0]) || 'https://via.placeholder.com/400x300';
  
  const shareData = useMemo(() => ({
    text: `Check out ${title}`,
    url: `${window.location.origin}/details/${id}`,
    title: title,
  }), [title, id]);

  const isLiked = liked?.includes(user);
  const isDisliked = disliked?.includes(user);

  return (
    <div className={classes.card}>
      <FoodPlaceGallery 
        mainImage={mainImage}
        title={title}
        type={type}
        onClick={() => navigate(`/details/${id}`)}
      />

      <div className={classes.info}>
        <div className={classes.header}>
          <h3 className={classes.title}>{title}</h3>
          <span className={classes.priceLevel}>$$$</span>
        </div>
        <p className={classes.description}>{speciality}</p>

        <div className={classes.meta}>
          <div className={classes.metaItem}>
            <LocationOnOutline />
            <span>{location}</span>
          </div>
        </div>

        <FoodPlaceActions 
          likes={likes}
          dislikes={dislikes}
          commentsCount={comments?.length || 0}
          isLiked={isLiked}
          isDisliked={isDisliked}
          onLike={handleLike}
          onDislike={handleDislike}
          onCommentsClick={openCommentsModal}
          shareData={shareData}
        />
        
        <button className={classes.cartButton} onClick={openOffersModal}>
          <span className="material-symbols-outlined">local_offer</span>
        </button>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={closeAuthModal} 
        title="Interactions require sign in"
      />

      <Modal
        title={`Offers at ${title}`}
        open={isOffersModalOpen}
        footer={null}
        onCancel={closeOffersModal}
      >
        <div className={classes.offersList}>
          {discounts && discounts.length > 0 ? (
            discounts.map((d, i) => (
              <div key={i} className={classes.offerItem}>
                <strong>{d.split('|')[0]}</strong>: {d.split('|')[1]} Off
              </div>
            ))
          ) : (
            <p>No active offers at this time.</p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default FoodPlace;
