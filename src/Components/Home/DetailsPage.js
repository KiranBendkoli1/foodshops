import React from "react";
import { Card } from "antd";
import {
  LikeOutlined,
  CommentOutlined,
  DislikeOutlined,
} from "@ant-design/icons";

import classes from "./HomePage.module.css";
import { Link, useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
const DetailsPage = (props) => {
  // const {title} = useParams();
  const { state } = useLocation();
  const { title } = state;
  const foodplaces = useSelector((state) => state.places.foodplaces);
  console.log({ foodplaces });
  const data = foodplaces.filter((data) => title === data.title)[0];
  console.log({ data });
  // return (
  //   <div>
  //     print
  //   </div>
  // )
  return (
    <div>
      <Card className={classes.shopcard}>
        <p  className={classes.center} style={{padding: "0px", margin:'0px'}}>{data.title}</p>
        <div>
          <img src={data.image} height="300px" />
        </div>
        <p>Speciality: {data.speciality}</p>
        <p>{data.description}</p>
        <p>{data.location}</p>
        <div className={classes.useractions}>
       <p>   {data.likes} {' '}<LikeOutlined /></p>
       <p>{data.dislikes} {' '}<DislikeOutlined /> </p>
         <p><Link to={'/comments'}>{data.comments.length} <CommentOutlined /></Link></p>
        </div>
      </Card>
    </div>
  );
};

export default DetailsPage;
