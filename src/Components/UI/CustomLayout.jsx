import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeContext } from '../../context/theme-context';
import Navbar from './Navbar';
import classes from './CustomLayout.module.css';

const CustomLayout = ({ children }) => {
  const { theme } = useContext(ThemeContext);
  const location = useLocation();

  return (
    <div className={classes.layout} data-theme={theme}>
      <header className={classes.header}>
        <div className={`${classes.container} ${classes.headerContainer}`}>
          <a href="/" className={classes.logo}>Food Finder</a>
          <nav className={classes.navLinks}>
            <Link to="/" className={location.pathname === '/' ? classes.active : ''}>Browse</Link>
            <Link to="/offers" className={location.pathname === '/offers' ? classes.active : ''}>Offers</Link>
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
        </div>
      </footer>
    </div>
  );
};

export default CustomLayout;
