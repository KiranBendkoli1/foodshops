import { Input, Card, Form, Button, Modal } from "antd";
import { SendOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import classes from "./HomePage.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addComment } from "../../store/placesSlice";
import Seo from "../SEO/Seo";

const Comments = (props) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let user = localStorage.getItem("email");
  const foodplaces = useSelector((state) => state.places.foodplaces);
  const data = foodplaces.filter((data) => id === data.id)[0];
  const { index, comments, title, images } = data;
  useEffect(() => {
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
    <>
      <Seo
        title={`${title} — reviews & comments`}
        rawTitle
        description={`Read and add comments for ${title} on Food Shops.`}
        image={images?.[0]}
      />
    <Card className={classes["comments-card"]}>
      <h2>{title}</h2>
      <img src={images?.[0]} alt={title} style={{ width: '100%', borderRadius: '12px', marginBottom: '1rem' }} />
      <div>
        <h2>Comments...</h2>
        {comments.map((comment, index) => {
          return (
            <p key={index}>
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
    </>
  );
};

export default Comments;
