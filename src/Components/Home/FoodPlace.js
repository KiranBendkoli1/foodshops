import { Button, Card ,Modal} from "antd";
import {
  LikeOutlined,
  CommentOutlined,
  DislikeOutlined,
  LikeFilled,
  DislikeFilled,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import classes from "./HomePage.module.css";
import {useNavigate } from "react-router-dom";
import { useDispatch} from "react-redux";
import {
  fetchPlaces,
  updateDislikes,
  updateLikes,
} from "../../store/placesSlice";
import { auth } from "../../config/firebase";

const FoodPlace = (props) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [userIsLiked, setUserIsLiked] = useState();
  let user = auth.currentUser;
  if (user) {
    user = user.email;
  }
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
  const handleDetailsClick = () => {
    navigate("/details", { state: { title: title } });
  };
  const commentClickHandler = () => {
    navigate("/comments", { state: { id: id } });
  };
  const addLikeHandler = () => {
    console.log({ liked });
    if (!user) {
      setIsModalOpen(true);
     
    } else {
      dispatch(updateLikes({ id, index, likes, dislikes, user }));
    }
    // dispatch(placeActions.addLike(index))
  };
  const addDislikeHandler = () => {
    if (!user) {
      setIsModalOpen(true);
    } else {
      dispatch(updateDislikes({ id, index, likes, dislikes, user }));
    }
    // dispatch(placeActions.addDislike(index))
  };

  // modal functionalities
 
  const handleOk = () => {
    navigate("/login");
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    dispatch(fetchPlaces());
  }, []);
  return (
    <>
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
        <Button onClick={handleDetailsClick}>View Complete Details</Button>
      </Card>

      <Modal
        title="You need to login first"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>For like and dislike you need to login first </p>
      </Modal>
    </>
  );
};

export default FoodPlace;
