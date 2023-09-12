import React, { useCallback, useEffect, useRef } from "react";
import { Button, Card, Form, Input } from "antd";
import classes from "./AuthCommon.module.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuthStore from "../../zstore/auth";
const Login = () => {
  const navigate = useNavigate();
  const isLoading = useAuthStore(state => state.isLoading)
  const signIn = useAuthStore(state => state.signIn);
  const emailRef = useRef();
  const passwordRef = useRef();
  const onFinishHandler = useCallback(() => {
    const email = emailRef.current.input.value;
    const password = passwordRef.current.input.value;
    signIn({ email, password }).then(async (data) => {
      console.log(data);
      const res = await data;
      if (res.status === "failure") {
        toast.error(res.message)
        return res.message;
      } else if (res.status === "success") {
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
        return res.message;
      }
    });
  }, [navigate, emailRef, passwordRef]);

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
            htmlFor="email"
            rules={[
              {
                required: true,
                message: "Please input your email address!",
              },
            ]}
          >
            <Input ref={emailRef} name="email" type="email" htmlType="email" placeholder="email adderss" />
          </Form.Item>
          <Form.Item
            label="Password"
            htmlFor="password"
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
              name="password"
              type="password"
              placeholder="password"
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
