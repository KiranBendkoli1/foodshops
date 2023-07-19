import { Input, Card, Form, Button } from "antd";
import { SendOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import classes from "./HomePage.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addComment } from "../../store/placesSlice";
import { auth } from "../../config/firebase";

const Comments = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const user = auth.currentUser.email;
  // const [commentVal, setCommentVal] = useState("");
  const { id } = state;
  const foodplaces = useSelector((state) => state.places.foodplaces);
  // console.log({ foodplaces });
  const data = foodplaces.filter((data) => data.id === id)[0];
  const { index, comments, image, title } = data;
  useEffect(() => {
    console.log(data);
  }, []);
  const postCommentHandler = (values) => {
    dispatch(addComment({ id, user, comments, index, values }));
    navigate("/");
  };
  return (
    <Card className={classes["comments-card"]}>
      <h2>{title}</h2>
      <img src={image} alt={title} srcset="" height={"300px"} />
      <div>
        <h2>Comments...</h2>
        {comments.map((comment) => {
          return (
            <p>
             <b>{comment.split("|")[0]}</b> {comment.split("|")[1]}<br />
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
            <Button type="primary" htmlType="submit">
              <SendOutlined /> Post Comment
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Card>
  );
};

export default Comments;
