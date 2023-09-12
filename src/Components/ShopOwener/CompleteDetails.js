import React, { useEffect, useMemo, useCallback } from "react";
import { Card, Modal, Form, Input, Button, Spin } from "antd";
import { FaDirections } from "react-icons/fa";
import {
  LikeOutlined,
  CommentOutlined,
  DislikeOutlined,
  DislikeFilled,
  LikeFilled,
  SendOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";

import { RWebShare } from "react-web-share";
import classes from "../Home/HomePage.module.css";
import { useNavigate, useParams } from "react-router-dom";
import ImageCarousel from "../UI/ImageCarousel";
import useModal from "../../hooks/useModal";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import usePlaceStore from "../../zstore/place";
const CompleteDetails = (props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    isLoading,
    foodplace: data,
    updateLikes,
    updateDislikes,
    addComment,
    getFoodShopById,
  } = usePlaceStore((state) => ({
    isLoading: state.isLoading,
    foodplace: state.foodplace,
    updateLikes: state.updateLikes,
    updateDislikes: state.updateDislikes,
    addComment: state.addComment,
    getFoodShopById: state.getFoodShopById,
  }));
  const [isLikesOpen, openLikesModal, closeLikesModal] = useModal();
  const [isCommentsModalOpen, openCommentsModal, closeCommentsModal] =
    useModal();
  const [
    isCommentsWarningOpen,
    openCommentsWarningModal,
    closeCommentsWarningModal,
  ] = useModal();
  const [width, height] = useWindowDimensions();
  let user = useMemo(() => localStorage.getItem("user"), []);
  user = useMemo(() => JSON.parse(user), [user]);

  const {
    liked,
    disliked,
    selectPosition,
    images,
    description,
    contact,
    address,
    title,
    likes,
    speciality,
    comments,
    dislikes,
  } = data;
  const addLikeHandler = useCallback(() => {
    if (!user) {
      openLikesModal();
    } else {
      updateLikes({ id, likes, dislikes, user });
    }
  }, [id, likes, dislikes, user, liked, openLikesModal]);
  const addDislikeHandler = useCallback(() => {
    if (!user) {
      openLikesModal();
    } else {
      updateDislikes({ id, likes, dislikes, user });
    }
  }, [id, likes, dislikes, user, openLikesModal]);

  const postCommentHandler = useCallback(
    (values) => {
      addComment({ id, user, comments, values });
    },
    [id, user, comments, navigate]
  );

  const commentsMap = useMemo(() => {
    return (
      comments &&
      comments.map((comment, index) => {
        return (
          <p key={index}>
            <b>{comment.user}</b> {comment.comment}
            <br />
          </p>
        );
      })
    );
  }, [comments]);
  useEffect(() => {
    getFoodShopById({ id });
  }, [id]);
  return (
    <Spin spinning={isLoading}>
      <div className={classes.background} style={{ padding: "5px" }}>
        {!data ? (
          <Spin />
        ) : (
          <Card
            style={{
              height: "auto",
              maxWidth: "800px",
              width: width < 500 ? width : "800px",
            }}
          >
            <ImageCarousel
              images={images}
              width={width < 500 ? width / 1.5 : "400px"}
              height={height / 1.2}
            />
            <div>
              <h2 className={classes.shopname}>{data?.title || ""}</h2>
              <p>
                <u>Speciality:</u> {speciality}
              </p>
              <p style={{ textAlign: "justify", textJustify: "inter-word" }}>
                <u>Description:</u> {description}
              </p>
              <p>
                <u>Contact No:</u> {contact}
              </p>
              <p>
                <u>Address: </u>
                {address}
              </p>
              <div className={classes.useractions}>
                <p
                  onClick={addLikeHandler}
                  className={classes.icons}
                  style={{ fontSize: "120%" }}
                >
                  {liked && liked.find((e) => user && e === user.email) ? (
                    <>
                      {likes} <LikeFilled />
                    </>
                  ) : (
                    <>
                      {likes} <LikeOutlined />
                    </>
                  )}
                </p>
                <p
                  onClick={addDislikeHandler}
                  className={classes.icons}
                  style={{ fontSize: "120%" }}
                >
                  {disliked &&
                  disliked.find((e) => user && e === user.email) ? (
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
                  className={classes.icons}
                  style={{ fontSize: "120%" }}
                >
                  {comments && comments.length} <CommentOutlined />
                </p>
                <p style={{ fontSize: "120%" }}>
                  <RWebShare
                    data={{
                      text: `details of ${title}`,
                      url: `${window.location.href}details/${id}`,
                      title: title,
                    }}
                  >
                    <ShareAltOutlined className={classes.icons} />
                  </RWebShare>
                </p>
                {selectPosition && (
                  <p
                    style={{ fontSize: "120%" }}
                    onClick={() => {
                      navigate(
                        `/gotomap/${selectPosition[0]}/${selectPosition[1]}/${address}`
                      );
                    }}
                  >
                    <FaDirections className={classes.icons} />
                  </p>
                )}
              </div>
            </div>
            <Modal
              title="You need to login first"
              open={isLikesOpen}
              onOk={() => {
                navigate("/login");
                closeLikesModal();
              }}
              onCancel={closeLikesModal}
            >
              <p>For like and dislike you need to login first </p>
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
                  {commentsMap}
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
                        onClick={() => {
                          !user && openCommentsWarningModal();
                        }}
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
              onCancel={closeCommentsWarningModal}
            >
              <p>For posting comments you need to login first </p>
            </Modal>
          </Card>
        )}
      </div>
    </Spin>
  );
};

export default CompleteDetails;
