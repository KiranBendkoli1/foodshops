import { Button, Card, Modal } from "antd";
import {
  LikeOutlined,
  CommentOutlined,
  DislikeOutlined,
  ShareAltOutlined,
  LikeFilled,
  DislikeFilled,
} from "@ant-design/icons";
import directionIcon from "../../assets/icons/traffic-sign.png"
import React, { useEffect, useState } from "react";
import classes from "./HomePage.module.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  fetchPlaces,
  updateDislikes,
  updateLikes,
} from "../../store/placesSlice";
import { auth } from "../../config/firebase";
import { RWebShare } from "react-web-share";
import veg from "../../assets/icons/icons8-veg-48.png";
import nonveg from "../../assets/icons/icons8-non-veg-48.png";
const FoodPlace = (props) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOffersModalOpen, setIsOffersModalOpen] = useState(false);
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
    image,
    selectPosition,
    images,
    type,
    discounts,
    location,
    title,
    likes,
    speciality,
    comments,
    dislikes,
  } = props.foodplace;
  const handleDetailsClick = () => {
    navigate(`/details/${id}`);
  };
  const commentClickHandler = () => {
    navigate(`/comments/${id}`);
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

  // offer modal
  const handleOffersClick = () => {
    setIsOffersModalOpen(true);
  };
  const handleOfferOk = () => {
    setIsOffersModalOpen(false);
  };
  const handleOfferCancel = () => {
    setIsOffersModalOpen(false);
  };
  useEffect(() => {
    dispatch(fetchPlaces());
  }, []);
  return (
    <>
      <Card  hoverable className={classes.shopcard} key={id}>
        <div
          style={{
            height: "20px",
            display: "flex",
            justifyContent: "space-evenly",
          }}
        >
          <h3
            className={`${classes.center} ${classes.shopname}`}
            style={{ padding: "0px", margin: "0px" }}
          >
            {title.toUpperCase()}
          </h3>{" "}
          <div>
            {type? type.includes("Veg") && <img src={veg} style={{ width: "20px", height: "20px" }} />:""}{" "}
            {type? type.includes("Non Veg") && <img src={nonveg} style={{ width: "20px", height: "20px" }} />:""}
          </div>
        </div>
        <div className={classes.center} style={{ marginTop: "20px" }}>
          <img src={image ? image : images[0]} width="260px" height={"250px"} />
        </div>
        <p>Speciality: {speciality}</p>
        <p>Address: {location}</p>
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
          <p>
            <RWebShare
              data={{
                text: `details of ${title}`,
                url: `http://localhost:3000/details/${id}`,
                title: title,
              }}
            >
              <ShareAltOutlined />
            </RWebShare>
          </p>
          {selectPosition && <p onClick={()=>{navigate(`/gotomap/${selectPosition[0]}/${selectPosition[1]}`)}}>
            <img src={directionIcon} alt="icon" style={{width:"14px", height:"14px"}} />
          </p>}
        </div>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <Button
            onClick={handleDetailsClick}
            shape="round"
            type="primary"
            ghost
          >
            View Complete Details
          </Button>
          <Button
            onClick={handleOffersClick}
            shape="round"
            type="primary"
            ghost
          >
            View Offers
          </Button>
        </div>
      </Card>

      <Modal
        title="You need to login first"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>For like and dislike you need to login first </p>
      </Modal>

      <Modal
        title={`Special Offers at ${title}`}
        open={isOffersModalOpen}
        onOk={handleOfferOk}
        onCancel={handleOfferCancel}
      >
        {discounts.length === 0 && <p>No offers yet</p>}
        {discounts.map((discount) => {
          return (
            <>
              <p>{`${discount.split("|")[0]} is at ${
                discount.split("|")[1]
              } discount`}</p>
            </>
          );
        })}
      </Modal>
    </>
  );
};

export default FoodPlace;
