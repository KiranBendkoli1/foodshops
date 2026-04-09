import React, { useEffect } from "react";
import FoodPlaces from "./FoodPlaces";

const HomePage = () => {
  // Ensure dark theme for home feed
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  }, []);

  return (
    <>
      <FoodPlaces />
    </>
  );
};

export default HomePage;
