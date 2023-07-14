import { Input, Card, Form, Button } from "antd";
import { SendOutlined } from "@ant-design/icons";
import React from "react";
import classes from './HomePage.module.css';
const Comments = (props) => {
  const comments = [
    "Yes the food is really nice here",
    " Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
    " Perferendis, veniam veritatis quia vel voluptatibus cumque sit.",
  ];

  return (
    <Card className={classes['comments-card']}>
      <img
        src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
        alt=""
        srcset=""
        height={"300px"}
      />
      <div>
        <h2>Comments...</h2>
        {comments.map((comment) => {
          return (
            <p>
              {comment} <hr />
            </p>
          );
        })}
        <Form
          wrapperCol={{
            span: 16,
          }}
        >
          <Form.Item>
            <Input />
            <Button type="primary">
              <SendOutlined /> Post Comment
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Card>
  );
};

export default Comments;
