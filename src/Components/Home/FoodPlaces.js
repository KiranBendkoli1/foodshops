import React from "react";
import FoodPlace from "./FoodPlace";
import { useSelector } from "react-redux";
import MyModal from "./MyModal";
const FoodPlaces = () => {
  const foodplaces = useSelector(state=>state.places.foodplaces);
  
  return (
    <>
    <MyModal/>
  {console.log(foodplaces)}
      {foodplaces.map((foodplace) => {
        return <FoodPlace foodplace={foodplace} />;
      })}
    </>
  );
};

export default FoodPlaces;
