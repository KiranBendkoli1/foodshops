import React, { useState } from "react";
import { Button, Card, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import classes from "./AuthCommon.module.css";
import { userActions } from "../../store/userSlice";
import { signUp } from "../../utils/auth";
import { useDispatch, useSelector } from "react-redux";
const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const email = useSelector((state) => state.user.email);
  const name = useSelector((state) => state.user.name);
  const [password, setPassword] = useState("");

  const emailChangeHandler = (event) => {
    dispatch(userActions.setEmail(event.target.value));
  };
  const passwordChangeHandler = (event) => {
    setPassword(event.target.value);
  };
  const nameChangeHandler = (event) => {
    dispatch(userActions.setName(event.target.value));
  };

  const onFinishHandler = () => {
    console.log("Submit executed");
    signUp(name, email, password).then(()=>{
      navigate("/");
    })
    
  };
  return (
    <div className={classes.centerdiv}>
      <Card bordered={true} className={classes.card}>
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
            label="Full Name: "
            name="name"
            rules={[
              {
                required: true,
                message: "Please input your name!",
              },
            ]}
          >
            <Input onChange={nameChangeHandler} value={name} />
          </Form.Item>
          <Form.Item
            label="Email Address: "
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
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
          <Form.Item className={classes.button}>
            <Button type="primary" htmlType="submit">
              SIGNUP
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
