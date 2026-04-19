import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateLikes, updateDislikes } from '../../store/placesSlice';
import useModal from '../../hooks/useModal';

import FoodPlaceGallery from './FoodPlaceGallery';
import FoodPlaceActions from './FoodPlaceActions';
import AuthModal from '../Auth/AuthModal';
import OffersModal from './Modals/OffersModal';
import ReviewModal from './Modals/ReviewModal';
import CommentsModal from './Modals/CommentsModal';
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
  const [isReviewModalOpen, openReviewModal, closeReviewModal] = useModal();

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

  const avgRating = useMemo(() => {
    if (!comments || comments.length === 0) return 0;
    const ratings = comments.map(c => {
      const match = c.match(/\[Rating: (\d)\/5\]/);
      return match ? parseInt(match[1]) : null;
    }).filter(r => r !== null);
    
    if (ratings.length === 0) return 0;
    return (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
  }, [comments]);

  return (
    <div className={classes.card}>
      <FoodPlaceGallery 
        mainImage={mainImage}
        title={title}
        type={type}
        rating={avgRating > 0 ? avgRating : "New"}
        onClick={() => navigate(`/details/${id}`)}
      />

      <div className={classes.info}>
        <div className={classes.header}>
          <h3 className={classes.title}>{title}</h3>
          <button className={classes.cartButton} onClick={openOffersModal}>
          <span className="material-symbols-outlined">local_offer</span>
        </button>
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
          onRateClick={openReviewModal}
          shareData={shareData}
        />
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={closeAuthModal} 
        title="Interactions require sign in"
      />

      <OffersModal 
        isOpen={isOffersModalOpen}
        onClose={closeOffersModal}
        title={title}
        discounts={discounts}
      />

      <CommentsModal 
        isOpen={isCommentsModalOpen}
        onClose={closeCommentsModal}
        title={title}
        id={id}
        index={index}
        comments={comments}
        userEmail={user}
      />

      <ReviewModal 
        isOpen={isReviewModalOpen}
        onClose={closeReviewModal}
        title={title}
        id={id}
        index={index}
        reviews={comments}
        userEmail={user}
      />
    </div>
  );
};

export default FoodPlace;
