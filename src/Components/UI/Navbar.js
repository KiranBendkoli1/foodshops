import React, { memo, useCallback, useContext, useMemo } from "react";
import { Button, Menu } from "antd";
import { LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import classes from "../Home/HomePage.module.css";
import { useNavigate } from "react-router-dom";
import sun from "../../assets/icons/brightness.png";
import moon from "../../assets/icons/moon.png";
import { Switch } from "antd";
import { ThemeContext } from "../../context/theme-context";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import useAuthStore from "../../zstore/auth";
const Navbar = () => {
  let user = localStorage.getItem("user");
  user = useMemo(() => JSON.parse(user), [user]);
  const { height, width } = useWindowDimensions();
  const navigate = useNavigate();
  const logout = useAuthStore(state=>state.logout);
  const logoutHandler = useCallback(() => {
    logout().then(() => {
      navigate("/login");
    });
  }, [navigate]);
  const loginHandler = useCallback(() => {
    navigate("/login");
  }, [navigate]);
  const themeContext = useContext(ThemeContext);
  const widthBasedResponse = (mobile, web) => {
    return width < 500 ? mobile : web;
  }
  return (
    <>
      <h1 className={classes.title}>FoodPlaces</h1>
      <p style={{ display: "flex" }}>
        <Switch
          size={widthBasedResponse("small", "default")}
          style={{ margin: "5px" }}
          onChange={themeContext.toggleTheme}
          checkedChildren={<img src={sun} width={widthBasedResponse("15px", "19px")} height={widthBasedResponse("15px", "19px")} />}
          unCheckedChildren={<img src={moon} width={widthBasedResponse("15px", "19px")} height={widthBasedResponse("15px", "19px")} />}
          defaultChecked
        />

        <Menu
          // mode={widthBasedResponse("vertical","horizontal")}
          inlineCollapsed={widthBasedResponse(true, false)}
          mode="horizontal"
          className={classes.navmenu}
          style={{ float: "right" }}
        >
          {user && <>
            <Menu.Item key="">{user ? user.email : ""}</Menu.Item>
            <Menu.Item key="Logout">
              {user && user.email ? (
                <Button onClick={logoutHandler} icon={<LogoutOutlined />}>
                  {widthBasedResponse("", "Logout")}
                </Button>
              ) : (
                <Button onClick={loginHandler} icon={<LoginOutlined />}>
                  {widthBasedResponse("", "Login/SignUp")}
                </Button>
              )}
            </Menu.Item></>}
          {!user && (
            <Menu.Item>
              <Button onClick={loginHandler} icon={<LoginOutlined />}>
                {widthBasedResponse("", "Login/SignUp")}
              </Button>
            </Menu.Item>
          )}
        </Menu>
      </p>
    </>
  );
};

export default memo(Navbar);
