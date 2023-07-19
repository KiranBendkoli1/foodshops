import React from "react";
import { FloatButton } from "antd";
import { Link } from "react-router-dom";
import { ShopOutlined } from "@ant-design/icons";
import FoodPlaces from "./FoodPlaces";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchPlaces } from "../../store/placesSlice";
const HomePage = () => {
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(fetchPlaces())
  }, [dispatch])
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
