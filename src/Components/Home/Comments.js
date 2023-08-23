import { Input, Card, Form, Button, Modal } from "antd";
import { SendOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import classes from "./HomePage.module.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addComment } from "../../store/placesSlice";
import { auth } from "../../config/firebase";
import ImageCarousel from "../UI/ImageCarousel";

const Comments = (props) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let user = auth.currentUser;
  if (user) {
    user = user.email;
  }
  // console.log({ user });
  const flag = user ? true : false;
  const foodplaces = useSelector((state) => state.places.foodplaces);
  const data = foodplaces.filter((data) => id === data.id)[0];
  const { index, comments, image, title, images } = data;
  useEffect(() => {
    // console.log(data);
  }, []);
  const postCommentHandler = (values) => {
    dispatch(addComment({ id, user, comments, index, values }));
    navigate("/");
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    navigate("/login");
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Card className={classes["comments-card"]}>
      <h2>{title}</h2>
      <ImageCarousel images={images} />
      <div>
        <h2>Comments...</h2>
        {comments.map((comment, index) => {
          return (
            <p key={index}>
              <b>{comment.user}</b> {comment.comment}
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
              onClick={showModal}
            >
              <SendOutlined /> Post Comment
            </Button>
          </Form.Item>
        </Form>
      </div>
      <Modal
        title="You need to login first"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>For Commenting Here you need to login first </p>
      </Modal>
    </Card>
  );
};

export default Comments;
