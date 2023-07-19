import { Button, Card } from "antd";
import {
  LikeOutlined,
  CommentOutlined,
  DislikeOutlined,
  LikeFilled,
  DislikeFilled,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import classes from "./HomePage.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPlaces,
  placeActions,
  updateDislikes,
  updateLikes,
} from "../../store/placesSlice";
import { auth } from "../../config/firebase";

const FoodPlace = (props) => {
  const dispatch = useDispatch();
  // const [userIsLiked, setUserIsLiked] = useState();
  const user = auth.currentUser.email;
  const navigate = useNavigate();
  const {
    index,
    id,
    liked,
    disliked,
    nameOfOwener,
    image,
    description,
    title,
    likes,
    speciality,
    comments,
    dislikes,
  } = props.foodplace;
  const handleClick = () => {
    navigate("/details", { state: { title: title } });
  };
  const commentClickHandler = () => {
    navigate("/comments", { state: { id: id } });
  };
  const addLikeHandler = () => {
    console.log({ liked });
    // dispatch(placeActions.addLike(index))
    dispatch(updateLikes({ id, index, likes, dislikes, user }));
  };
  const addDislikeHandler = () => {
    // dispatch(placeActions.addDislike(index))
    dispatch(updateDislikes({ id, index, likes, dislikes, user }));
  };
  useEffect(() => {
    dispatch(fetchPlaces());
  }, []);
  return (
    <div>
      <Card className={classes.shopcard}>
        <p className={classes.center} style={{ padding: "0px", margin: "0px" }}>
          {title}
        </p>
        <div>
          <img src={image} width="260px" height={"250px"} />
        </div>
        <p>Speciality: {speciality}</p>
        <div className={classes.useractions}>
          <p onClick={addLikeHandler}>
            {liked.find((e) => e === user) ? (
              <>
                {likes} <LikeFilled />
              </>
            ) : (
              <>
                {likes} <LikeOutlined />
              </>
            )}
          </p>
          <p onClick={addDislikeHandler}>
            {disliked.find((e) => e === user) ? (
              <>
                {dislikes} <DislikeFilled />
              </>
            ) : (
              <>
                {dislikes} <DislikeOutlined />
              </>
            )}
          </p>
          <p onClick={commentClickHandler}>
            {comments.length} <CommentOutlined />
          </p>
        </div>
        <Button onClick={handleClick}>View Complete Details</Button>
      </Card>
    </div>
  );
};

export default FoodPlace;
