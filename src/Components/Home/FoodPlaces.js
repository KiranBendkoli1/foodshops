import React from "react";
import FoodPlace from "./FoodPlace";
import DUMMY_DATA from "../../data/dummy_data";
const FoodPlaces = () => {
  return (
    <>
     {
        DUMMY_DATA.map((foodplace)=>{
            return <FoodPlace foodplace={foodplace}/>;
        })
      }
    </>
  );
};

export default FoodPlaces;
