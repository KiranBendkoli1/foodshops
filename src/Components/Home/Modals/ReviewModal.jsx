import React, { useState } from 'react';
import { Modal, Input, Button } from 'antd';
import StarRating from '../../UI/StarRating';
import { useDispatch } from 'react-redux';
import { addComment } from '../../../store/placesSlice';
import classes from './Modals.module.css';

const ReviewModal = ({ isOpen, onClose, title, id, index, reviews, userEmail }) => {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();

  const handleSubmit = () => {
    if (!comment.trim() || rating === 0) return;
    const reviewText = `[Rating: ${rating}/5] ${comment}`;
    
    dispatch(addComment({ 
      id, 
      user: userEmail, 
      index, 
      values: { comment: reviewText } 
    }));
    
    setComment('');
    setRating(0);
    onClose();
  };

  return (
    <Modal
      title={null}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={1000}
      className={classes.customModal}
    >
      <div className={classes.reviewGrid}>
        <section className={classes.formSection}>
          <h2 className={classes.title}>Rate Your Experience</h2>
          <p className={classes.subtitle}>How was your meal from <span style={{color: 'var(--primary)'}}>{title}</span>?</p>
          
          <div className={classes.ratingArea}>
            <label className={classes.label}>Overall Rating</label>
            <StarRating rating={rating} onChange={setRating} interactive size="2.5rem" />
          </div>

          <div className={classes.feedbackArea}>
            <label className={classes.label}>Your Feedback</label>
            <Input.TextArea 
              rows={4} 
              placeholder="What did you love about the food or service?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className={classes.textArea}
            />
          </div>

          <Button 
            type="primary" 
            block 
            size="large" 
            disabled={!comment.trim() || rating === 0}
            onClick={handleSubmit}
            className={classes.submitBtn}
          >
            Post Review
          </Button>
        </section>

        <aside className={classes.sidebarSection}>
          <h3 className={classes.sidebarTitle}>Recent Feedback</h3>
          <div className={classes.sidebarList}>
            {reviews && reviews.length > 0 ? (
              reviews.slice(-3).reverse().map((r, i) => {
                const [email, text] = r.split(' | ');
                const ratingMatch = text?.match(/\[Rating: (\d)\/5\]/);
                const cleanText = text?.replace(/\[Rating: \d\/5\]\s*/, '');
                const stars = ratingMatch ? parseInt(ratingMatch[1]) : 0;

                return (
                  <div key={i} className={classes.reviewCard}>
                    <div className={classes.reviewHeader}>
                      <div className={classes.reviewerAvatar}>{email?.[0].toUpperCase()}</div>
                      <div>
                        <span className={classes.reviewerEmail}>{email.split('@')[0]}</span>
                        {stars > 0 && <StarRating rating={stars} size="0.7rem" />}
                      </div>
                    </div>
                    <p className={classes.reviewText}>"{cleanText}"</p>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                <p>No reviews yet. Be the first!</p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </Modal>
  );
};

export default ReviewModal;
