import React, { useState } from 'react';
import { Modal, Input, Avatar } from 'antd';
import { useDispatch } from 'react-redux';
import { addComment } from '../../../store/placesSlice';
import StarRating from '../../UI/StarRating';
import classes from './Modals.module.css';

const CommentsModal = ({ isOpen, onClose, title, id, index, comments, userEmail }) => {
  const [newComment, setNewComment] = useState('');
  const dispatch = useDispatch();

  const handlePost = () => {
    if (!newComment.trim()) return;
    dispatch(addComment({ 
      id, 
      user: userEmail, 
      index, 
      values: { comment: newComment } 
    }));
    setNewComment('');
  };

  return (
    <Modal
      title={null}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={700}
      className={classes.customModal}
    >
      <div className={classes.modalContent}>
        <div style={{ padding: '1.5rem 2.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <h2 className={classes.title} style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Reviews & Comments</h2>
          <p className={classes.subtitle} style={{ marginBottom: 0 }}>{title}</p>
        </div>

        <div className={classes.commentList}>
          {comments && comments.length > 0 ? (
            comments.map((c, i) => {
              const [email, text] = c.split(' | ');
              const ratingMatch = text?.match(/\[Rating: (\d)\/5\]/);
              const cleanText = text?.replace(/\[Rating: \d\/5\]\s*/, '');
              const stars = ratingMatch ? parseInt(ratingMatch[1]) : 0;

              return (
                <div key={i} className={classes.commentItem}>
                  <Avatar className={classes.reviewerAvatar} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`}>
                    {email?.[0].toUpperCase()}
                  </Avatar>
                  <div className={classes.commentContent}>
                    <div className={classes.commentHeader}>
                      <span className={classes.commentUser}>{email.split('@')[0]}</span>
                      <span className={classes.commentTime}>Recently</span>
                    </div>
                    {stars > 0 && <div style={{marginBottom: '0.25rem'}}><StarRating rating={stars} size="0.75rem" /></div>}
                    <p className={classes.commentBody}>{cleanText}</p>
                    <div className={classes.commentFooter}>
                      <button className={classes.actionBtn}>
                        <span className="material-symbols-outlined" style={{fontSize: '1rem'}}>thumb_up</span>
                        <span>Like</span>
                      </button>
                      <button className={classes.actionBtn}>
                        <span className="material-symbols-outlined" style={{fontSize: '1rem'}}>reply</span>
                        <span>Reply</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              <p>No comments yet. Share your thoughts!</p>
            </div>
          )}
        </div>

        <div className={classes.postCommentArea}>
          <div className={classes.commentInputWrapper}>
            <Input.TextArea 
              rows={2}
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className={classes.commentInput}
              autoSize={{ minRows: 2, maxRows: 4 }}
            />
            <button className={classes.sendBtn} onClick={handlePost}>
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CommentsModal;
