import React, { memo, useCallback, useContext } from "react";
import { Dropdown } from "antd";
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

  const userMenuItems = [
    {
      key: 'email',
      label: <span className={classes.userEmail}>{userEmail}</span>,
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: (
        <div onClick={logoutHandler} className={classes.logoutItem}>
          <span className="material-symbols-outlined">logout</span>
          <span>Logout</span>
        </div>
      ),
    },
  ];

  return (
    <div className={classes.lightContainer}>
      <button className={classes.iconButton}>
        <span className="material-symbols-outlined">notifications</span>
      </button>

      <button
        className={classes.themeToggle}
        onClick={toggleTheme}
        aria-label="Toggle Theme"
      >
        <span className="material-symbols-outlined">
          {theme === 'dark' ? 'light_mode' : 'dark_mode'}
        </span>
      </button>

      {userEmail ? (
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
          <div className={classes.userBadge}>
            <div className={classes.userAvatar}>
              <span className="material-symbols-outlined">person</span>
            </div>
            <span className={classes.userName}>{userEmail.split('@')[0]}</span>
          </div>
        </Dropdown>
      ) : (
        <button className={classes.loginBtn} onClick={loginHandler}>
          Sign In
        </button>
      )}
    </div>
  );
};

export default memo(Navbar);
