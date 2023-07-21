import React from "react";
import FoodPlace from "./FoodPlace";
import { useSelector } from "react-redux";
const FoodPlaces = () => {
  const foodplaces = useSelector(state=>state.places.foodplaces);
  
  return (
    <>
  {console.log(foodplaces)}
      {foodplaces.map((foodplace) => {
        return <FoodPlace foodplace={foodplace} />;
      })}
    </>
  );
};

export default FoodPlaces;
