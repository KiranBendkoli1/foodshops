import React, { useState } from "react";
import { Button, Card, Form, Input } from "antd";
import classes from "./AuthCommon.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { firestore } from "../../config/firebase";
import { getDoc, doc } from "firebase/firestore";
import { userActions, signIn } from "../../store/userSlice";
// import { signIn } from "../../utils/auth";

const Login = () => {
  const navigate = useNavigate();
  const email = useSelector((state) => state.user.email);
  const isLoading = useSelector((state) => state.user.isLoading);
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const onFinishHandler = async() => {
    console.log(password);
    const res = await getDoc(doc(firestore, "roles", email));
    dispatch(signIn({ email, password })).then(() => {
      if (email === "admin@gmail.com") {
        navigate("/admin");
      } else if (res.data().role === "regular") {
        navigate("/");
      } else if (res.data().role === "shopOwner") {
        navigate("/ownershome");
      } 
    });
    console.log(email);
  };

  const emailChangeHandler = (event) => {
    dispatch(userActions.setEmail(event.target.value));
  };
  const passwordChangeHandler = (event) => {
    setPassword(event.target.value);
  };


  return (
    <div className={classes.centerdiv}>
      <Card bordered={true} className={classes.card}>
        <h2 className={classes.heading}>Login Page</h2>

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
                message: "Please input your email address!",
              },
            ]}
          >
            <Input
              onChange={emailChangeHandler}
              type="email"
              htmlType="email"
              value={email}
            />
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
            <Input.Password
              onChange={passwordChangeHandler}
              type="password"
              htmlType="password"
              value={password}
            />
          </Form.Item>
          <Form.Item className={classes.button}>
            <Button type="primary" htmlType="submit" loading={isLoading}
            >
              LOGIN
            </Button>{" "}
            <br />
          </Form.Item>
          <Link exact to={"/signup"}>
            Does Not Have Account Click Here to Create{" "}
          </Link>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
