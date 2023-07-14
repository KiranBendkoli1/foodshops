import React from "react";
import { FloatButton } from "antd";
import { Link } from "react-router-dom";
import { ShopOutlined } from "@ant-design/icons";
import FoodPlaces from "./FoodPlaces";
const HomePage = () => {
  return (
    <>
      <FoodPlaces />
      <Link to={"/addInfo"}>
        <FloatButton
          style={{ height: "5rem", width: "5rem" }}
          icon={<ShopOutlined />}
        />
      </Link>
    </>
  );
};

export default HomePage;
