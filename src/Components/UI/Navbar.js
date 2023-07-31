import React from "react";
import { Button, Menu } from "antd";
import { LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import classes from "../Home/HomePage.module.css";
import { useNavigate } from "react-router-dom";
import { logout } from "../../utils/auth";
import { auth } from "../../config/firebase";
const Navbar = () => {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const logoutHandler = () => {
    logout().then(() => {
      navigate("/login");
    });
  };
  const loginHandler = () => {
    navigate("/login");
  };
  return (
    <>
      <h1 className={classes.title}>Food Places</h1>
      {user && (
        <Menu
          mode="horizontal"
          style={{ background: "#2069f2", float: "right", color: "white" }}
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
    </>
  );
};

export default Navbar;
