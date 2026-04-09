import React from 'react';
import { Modal, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import classes from './AuthModal.module.css';

const AuthModal = ({ isOpen, onClose, title = "Sign in Required" }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    onClose();
    navigate('/login');
  };

  const handleSignup = () => {
    onClose();
    navigate('/signup');
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={400}
      className={classes.authModal}
    >
      <div className={classes.content}>
        <div className={classes.iconWrapper}>
          <span className="material-symbols-outlined">lock</span>
        </div>
        <h2 className={classes.title}>{title}</h2>
        <p className={classes.description}>
          You need to be signed in to perform this action. Join our community to unlock all features!
        </p>
        
        <div className={classes.actions}>
          <Button type="primary" size="large" block onClick={handleLogin} className={classes.primaryBtn}>
            Sign In
          </Button>
          <Button type="default" size="large" block onClick={handleSignup} className={classes.secondaryBtn}>
            Create Account
          </Button>
        </div>
        
        <button className={classes.maybeLater} onClick={onClose}>
          Maybe later
        </button>
      </div>
    </Modal>
  );
};

export default AuthModal;
