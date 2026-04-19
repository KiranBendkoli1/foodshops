import React, { memo, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../utils/auth";
import { ThemeContext } from "../../context/theme-context";
import classes from "./Navbar.module.css";

const Navbar = () => {
  const userEmail = localStorage.getItem("email");
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const logoutHandler = useCallback(() => {
    logout().then(() => {
      localStorage.removeItem("email");
      localStorage.removeItem("role");
      navigate("/login");
    });
  }, [navigate]);

  const loginHandler = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  return (
    <div className={classes.lightContainer}>
      <button className={classes.iconButton} aria-label="Notifications">
        <span className="material-symbols-outlined" aria-hidden="true">notifications</span>
      </button>

      <button
        className={classes.themeToggle}
        onClick={toggleTheme}
        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      >
        <span className="material-symbols-outlined" aria-hidden="true">
          {theme === 'dark' ? 'light_mode' : 'dark_mode'}
        </span>
      </button>

      {userEmail ? (
        <details className={classes.userMenu}>
          <summary className={classes.userBadge}>
            <div className={classes.userAvatar}>
              <span className="material-symbols-outlined">person</span>
            </div>
            <span className={classes.userName}>{userEmail.split('@')[0]}</span>
          </summary>
          <div className={classes.menuPanel}>
            <span className={classes.userEmail}>{userEmail}</span>
            <button type="button" onClick={logoutHandler} className={classes.logoutItem}>
              <span className="material-symbols-outlined">logout</span>
              <span>Logout</span>
            </button>
          </div>
        </details>
      ) : (
        <button className={classes.loginBtn} onClick={loginHandler}>
          Sign In
        </button>
      )}
    </div>
  );
};

export default memo(Navbar);
