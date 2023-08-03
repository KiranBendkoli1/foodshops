import { Button, Card, Form, Input, Modal } from "antd";
import {
  LikeOutlined,
  CommentOutlined,
  DislikeOutlined,
  ShareAltOutlined,
  SendOutlined,
  LikeFilled,
  DislikeFilled,
} from "@ant-design/icons";
import { addComment } from "../../store/placesSlice";
import directionIcon from "../../assets/icons/traffic-sign.png";
import React, { useEffect, useState } from "react";
import classes from "./HomePage.module.css";
import { useNavigate } from "react-router-dom";
import ImageCarousel from "../UI/ImageCarousel";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPlaces,
  updateDislikes,
  updateLikes,
} from "../../store/placesSlice";
import { auth } from "../../config/firebase";
import { RWebShare } from "react-web-share";
import veg from "../../assets/icons/icons8-veg-48.png";
import nonveg from "../../assets/icons/icons8-non-veg-48.png";
import useModal from "../../hooks/useModal";
const FoodPlace = (props) => {
  const dispatch = useDispatch();
  const [isLikesOpen, openLikesModal, closeLikesModal] = useModal();
  const [isOfferModalOpen, openOfferModal, closeOfferModal] = useModal();
  const [isCommentsModalOpen, openCommentsModal, closeCommentsModal] = useModal();
  const [isCommentsWarningOpen, openCommentsWarningModal, closeCommentsWarningModal] = useModal();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  // const [userIsLiked, setUserIsLiked] = useState();
  const isLoading = useSelector((state) => state.places.isLoading);
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
  // const commentClickHandler = () => {
  //   navigate(`/comments/${id}`);
  // };
  const addLikeHandler = () => {
    console.log({ liked });
    if (!user) {
      openLikesModal();
    } else {
      dispatch(updateLikes({ id, index, likes, dislikes, user }));
    }
    // dispatch(placeActions.addLike(index))
  };
  const addDislikeHandler = () => {
    if (!user) {
      openLikesModal();
    } else {
      dispatch(updateDislikes({ id, index, likes, dislikes, user }));
    }
    // dispatch(placeActions.addDislike(index))
  };




  const postCommentHandler = (values) => {
    dispatch(addComment({ id, user, comments, index, values }));
    navigate("/");
  };

  useEffect(() => {
    dispatch(fetchPlaces());
  }, []);
  return (
    <>
      <Card hoverable className={classes.shopcard} key={id}>
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
            {type
              ? type.includes("Veg") && (
                  <img src={veg} style={{ width: "20px", height: "20px" }} />
                )
              : ""}{" "}
            {type
              ? type.includes("Non Veg") && (
                  <img src={nonveg} style={{ width: "20px", height: "20px" }} />
                )
              : ""}
          </div>
        </div>
        <div className={classes.center} style={{ marginTop: "20px" }}>
          <img src={image ? image : images[0]} width="260px" height={"250px"} />
        </div>
        <p>Speciality: {speciality}</p>
        <p>Address: {location}</p>
        <div className={classes.useractions}>
          <p onClick={addLikeHandler} style={{ fontSize: "120%" }}>
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
          <p onClick={addDislikeHandler} style={{ fontSize: "120%" }}>
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
          <p
            onClick={openCommentsModal}
            style={{ fontSize: "120%" }}
          >
            {comments.length} <CommentOutlined />
          </p>
          <p style={{ fontSize: "120%" }}>
            <RWebShare
              data={{
                text: `details of ${title}`,
                url: `${window.location.href}details/${id}`,
                title: title,
              }}
            >
              <ShareAltOutlined />
            </RWebShare>
          </p>
          {selectPosition && (
            <p
              style={{ fontSize: "120%" }}
              onClick={() => {
                navigate(
                  `/gotomap/${selectPosition[0]}/${selectPosition[1]}/${location}`
                );
              }}
            >
              <img
                src={directionIcon}
                alt="icon"
                style={{ width: "18px", height: "18px" }}
              />
            </p>
          )}
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
            onClick={openOfferModal}
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
        open={isLikesOpen}
        onOk={() => {
          navigate("/login");
          closeLikesModal();
        }}
        onCancel={()=>closeLikesModal()}
      >
        <p>For like and dislike you need to login first </p>
      </Modal>

      <Modal
        title={`Special Offers at ${title}`}
        open={isOfferModalOpen}
        onOk={closeOfferModal}
        onCancel={closeOfferModal}
      >
        {discounts.length === 0 && <p>No offers yet</p>}
        {discounts.map((discount) => {
          return (
            <div key={discount}>
              <p>{`${discount.split("|")[0]} is at ${
                discount.split("|")[1]
              } discount`}</p>
            </div>
          );
        })}
      </Modal>

      <Modal
        title=""
        open={isCommentsModalOpen}
        footer={null}
        onOk={closeCommentsModal}
        onCancel={closeCommentsModal}
      >
        <div className={classes["comments-card"]}>
          <h2>{title}</h2>
          <ImageCarousel images={images} />
          <div>
            <h2>Comments...</h2>
            {comments.map((comment) => {
              return (
                <p key={comment}>
                  <b>{comment.split("|")[0]}</b> {comment.split("|")[1]}
                  <br />
                </p>
              );
            })}
            <Form
              wrapperCol={{
                span: 16,
              }}
              onFinish={postCommentHandler}
            >
              <Form.Item
                label="comment"
                name="comment"
                rules={[
                  {
                    required: true,
                    message: "Please input comment!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item>
                <Button
                  type={user ? "primary" : "disabled"}
                  htmlType={user ? "submit" : "reset"}
                  onClick={()=>{!user && openCommentsWarningModal()}}
                  loading={isLoading}
                >
                  <SendOutlined /> Post Comment
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Modal>

      <Modal
        title="You need to login first"
        open={isCommentsWarningOpen}
        onOk={() => {
          navigate("/login");
          closeCommentsWarningModal();
        }}
        onCancel={()=>closeCommentsWarningModal()}
      >
        <p>For posting comments you need to login first </p>
      </Modal>

    </>
  );
};

export default FoodPlace;
