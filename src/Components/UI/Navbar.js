import React, { memo, useCallback, useContext, useMemo } from "react";
import { Button, Menu } from "antd";
import { LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import classes from "../Home/HomePage.module.css";
import { useNavigate } from "react-router-dom";
import sun from "../../assets/icons/brightness.png";
import moon from "../../assets/icons/moon.png";
import { Switch } from "antd";
import { ThemeContext } from "../../context/theme-context";
import { useDispatch } from "react-redux";
import { logout } from "../../store/userSlice";
const Navbar = () => {
  // const user = useSelector((state) => state.user.user);

  let user = localStorage.getItem("user");
  user = useMemo(() => JSON.parse(user), [user]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logoutHandler = useCallback(() => {
    dispatch(logout()).then(() => {
      navigate("/login");
    });
  }, [dispatch, navigate]);
  const loginHandler = useCallback(() => {
    navigate("/login");
  }, [navigate]);
  const themeContext = useContext(ThemeContext);
  return (
    <>
      <h1 className={classes.title}>Food Places</h1>
      <p style={{ display: "flex" }}>
        <Switch
          style={{ margin: "5px" }}
          onChange={themeContext.toggleTheme}
          checkedChildren={<img src={sun} width={"19px"} height={"19px"} />}
          unCheckedChildren={<img src={moon} width={"17px"} height={"17px"} />}
          defaultChecked
        />
        {user && (
          <Menu
            mode="horizontal"
            className={classes.navmenu}
            style={{ float: "right" }}
          >
            <Menu.Item key="">{user ? user.email : ""}</Menu.Item>
            <Menu.Item key="Logout">
              {user && user.email ? (
                <Button onClick={logoutHandler}>
                  <LogoutOutlined />
                  Logout
                </Button>
              ) : (
                <Button onClick={loginHandler}>
                  <LoginOutlined />
                  Login/SignUp
                </Button>
              )}
            </Menu.Item>
          </Menu>
        )}
        {!user && (
          <Button onClick={loginHandler}>
            <LoginOutlined />
            Login/SignUp
          </Button>
        )}
      </p>
    </>
  );
};

export default memo(Navbar);
