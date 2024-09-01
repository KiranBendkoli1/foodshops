import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Card, Form, Input } from "antd";
import classes from "./AuthCommon.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "../../store/userSlice";
import { toast } from "react-toastify";
const Login = () => {
  const navigate = useNavigate();
  const isLoading = useSelector((state) => state.user.isLoading);
  const dispatch = useDispatch();
  const emailRef = useRef();
  const passwordRef = useRef();

  const onFinishHandler = useCallback(() => {
    const email = emailRef.current.input.value;
    const password = passwordRef.current.input.value;
    dispatch(signIn({ email, password })).then(async (data) => {
      console.log(data);
      // console.log(res);
      const res = await data.payload;
      if (res.status === "failure") {
        toast.error(res.message)
      } else if (res.status === "success") {
        // console.log(user);
        toast.success(res.message)
        const user = res.data;
        localStorage.setItem("user", JSON.stringify(user));
        if (user && user.role === "admin") {
          navigate("/admin");
        } else if (user && user.role === "regular") {
          navigate("/");
        } else if (user && user.role === "shopOwner") {
          navigate("/ownershome");
        }
      }
    });
    // console.log(email);
  }, [navigate, dispatch, emailRef, passwordRef]);

  const conditionalLogin = useCallback(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.email === "admin@admin.com") {
      navigate("/admin");
    } else if (user && user.role === "email") {
      navigate("/");
    } else if (user && user.role === "shopOwner") {
      navigate("/ownershome");
    }
  }, [navigate]);
  useEffect(() => {
    conditionalLogin();
  }, [conditionalLogin]);

  return (
    <div className={`${classes.centerdiv} ${classes.container}`}>
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
            <Input ref={emailRef} type="email" htmlType="email" />
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
              ref={passwordRef}
              type="password"
              htmlType="password"
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
