import React, { useCallback, useEffect, useState } from "react";
import { Button, Card, Form, Input } from "antd";
import classes from "./AuthCommon.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { auth, firestore } from "../../config/firebase";
import { getDoc, doc } from "firebase/firestore";
import { userActions, signIn } from "../../store/userSlice";
const Login = () => {
  const navigate = useNavigate();
  const email = useSelector((state) => state.user.email);
  const isLoading = useSelector((state) => state.user.isLoading);
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");

  const onFinishHandler = useCallback(() => {
    dispatch(signIn({ email, password })).then(async () => {
      console.log({email, password})
      const res = await getDoc(doc(firestore, "roles", email));
      localStorage.setItem("role", res.data().role);
      if (email === "admin@gmail.com") {
        navigate("/admin");
      } else if (res.data().role === "regular") {
        navigate("/");
      } else if (res.data().role === "shopOwner") {
        navigate("/ownershome");
      }
    });
    console.log(email);
  }, [navigate, dispatch,email, password]);

  const emailChangeHandler = useCallback((event) => {
    dispatch(userActions.setEmail(event.target.value));
  }, [dispatch]);
  const passwordChangeHandler = useCallback((event) => {
    setPassword(event.target.value);
  }, []);
  const conditionalLogin = useCallback(() => {
    if (auth.currentUser) {
      const userRole = localStorage.getItem("role");
      if (auth.currentUser.email === "admin@gmail.com") {
        navigate("/admin");
      } else if (auth.currentUser && userRole === "regular") {
        navigate("/");
      } else if (auth.currentUser && userRole === "shopOwner") {
        navigate("/ownershome");
      }
    }
  }, [navigate]);
  useEffect(() => {
    conditionalLogin();
  }, [conditionalLogin]);

  return (
    <div className={`${classes.centerdiv} ${classes.container}`}>
      <Card bordered={true} className={classes.card}>
        <h2 className={classes.heading}>Login Page</h2>
        {console.log(window.innerHeight)}
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
            <Button type="primary" htmlType="submit" loading={isLoading}>
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
