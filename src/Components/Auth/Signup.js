import React, { useState } from "react";
import { Button, Card, Form, Input } from "antd";
import { Link } from "react-router-dom";
import classes from "./AuthCommon.module.css";
const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const onFinishHandler = () => {};

  const emailChangeHandler = (event) => {
    setEmail(event.target.value);
    console.log(event.target.value);
  };
  const passwordChangeHandler = (event) => {
    setPassword(event.target.value);
  };

  return (
    <div className={classes.centerdiv}>
      <Card
        bordered={true}
       className={classes.card}
      >
        <h2 className={classes.heading}>SignUp Page</h2>

        <Form
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          autoComplete="off"
          onFinish={onFinishHandler}
        >
          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input onChange={emailChangeHandler} value={email} />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password onChange={passwordChangeHandler} value={password} />
          </Form.Item>
          <Form.Item
            className={classes.button}
          >
            <Button type="primary"  htmlType="submit" >
              <Link to={"/"}>SIGNUP</Link>
            </Button>{" "}
            <br />
           
          </Form.Item>
          <Link exact to={"/login"}>
              Already a user, Click Here to Login
            </Link>
        </Form>
      </Card>
    </div>
  );
};

export default Signup;
