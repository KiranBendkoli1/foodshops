import { Card } from "antd";
import { LikeOutlined, CommentOutlined } from "@ant-design/icons";
import React from "react";
import classes from "./HomePage.module.css";
import { Link } from "react-router-dom";

const FoodPlace = (props) => {
  const { nameOfOwener, image, description, title,likes, speciality , comments} = props.foodplace;
  return (
    <div>
    
      <Card className={classes.shopcard}>
        <p  className={classes.center} style={{padding: "0px", margin:'0px'}}>{title}</p>
        <div>
          <img src={image} height="300px" />
        </div>
        <p>Speciality: {speciality}</p>
        <div>Shop Owener: {nameOfOwener}</div>
        <p>{description}</p>
        <div className={classes.useractions}>
       <p>   {likes} {' '}<LikeOutlined /></p>
         <p><Link to={'/comments'}>{comments.length} <CommentOutlined /></Link></p>
        </div>
      </Card>
    </div>
  );
};

export default FoodPlace;
