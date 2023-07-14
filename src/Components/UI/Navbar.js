import React from "react";
import { Button, Menu  } from "antd";
import {LogoutOutlined,ShopOutlined} from "@ant-design/icons";
import classes from "../Home/HomePage.module.css";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <>
      <h1 className={classes.title}>Food Places</h1>
      <Menu mode="horizontal" style={{ background: "#2069f2", float: "right", color:'white'}}>
    
        <Menu.Item key="">User Email</Menu.Item>
        <Menu.Item key="Logout">
        <Link to={"/login"}> <Button><LogoutOutlined />Logout</Button></Link>
        </Menu.Item>
      </Menu>
    </>
  );
};

export default Navbar;
