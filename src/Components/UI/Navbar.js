import React, { memo, useCallback, useContext } from "react";
import { Button, Menu } from "antd";
import { LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import classes from "../Home/HomePage.module.css";
import { useNavigate } from "react-router-dom";
import { logout } from "../../utils/auth";
import { auth } from "../../config/firebase";
import sun from "../../assets/icons/brightness.png";
import moon from "../../assets/icons/moon.png";
import { Switch } from "antd";
import { ThemeContext } from "../../context/theme-context";
const Navbar = () => {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const logoutHandler = useCallback(() => {
    logout().then(() => {
      navigate("/login");
    });
  },[]);
  const loginHandler = useCallback(() => {
    navigate("/login");
  }, []);
  const themeContext = useContext(ThemeContext);
  return (
    <>
      <h1 className={classes.title}>Food Places</h1>
      <p style={{ display: "flex" }}>
        <Switch
          onChange={themeContext.toggleTheme}
          checkedChildren={<img src={sun} width={"19px"} height={"19px"} />}
          unCheckedChildren={<img src={moon} width={"17px"} height={"17px"} />}
          defaultChecked
        />
        {console.log(themeContext.theme)}
        {user && (
          <Menu
            mode="horizontal"
            className={classes.navmenu}
            style={{ float: "right" }}
          >
            <Menu.Item key="">{user ? user.email : ""}</Menu.Item>
            <Menu.Item key="Logout">
              {" "}
              <Button onClick={logoutHandler}>
                <LogoutOutlined />
                Logout
              </Button>
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
