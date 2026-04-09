import React, { useContext } from 'react';
import { ThemeContext } from '../../context/theme-context';
import Navbar from './Navbar';
import classes from './CustomLayout.module.css';

const CustomLayout = ({ children }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={classes.layout} data-theme={theme}>
      <header className={classes.header}>
        <div className={`${classes.container} ${classes.headerContainer}`}>
          <a href="/" className={classes.logo}>Food Finder</a>
          <nav className={classes.navLinks}>
            <a href="/" className={classes.active}>Browse</a>
            <a href="#">Offers</a>
            <a href="#">My Orders</a>
            <a href="#">Dashboard</a>
          </nav>
          <div className={classes.actions}>
            <Navbar />
          </div>
        </div>
      </header>

      <main className={classes.main}>
        <div className={classes.container}>
          {children}
        </div>
      </main>

      <footer className={classes.footer}>
        <div className={`${classes.container} ${classes.footerContent}`}>
          <div className={classes.footerLogo}>
            <div className={classes.logoText}>Food Finder</div>
            <p className={classes.footerSubtext}>
              The Digital Concierge experience. Redefining how you discover, taste, and experience the world of culinary delights.
            </p>
          </div>
          <div className={classes.footerLinks}>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Partner with Us</a>
            <a href="#">Careers</a>
          </div>
          <div className={classes.footerLinks}>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Legal</h4>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Help Center</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CustomLayout;
