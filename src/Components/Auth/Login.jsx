import React, { useCallback, useEffect, useState } from "react";
import { Button, Form, Input } from "antd";
import classes from "./Login.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import supabase from "../../config/supabase";
import { userActions, signIn } from "../../store/userSlice";

const Login = () => {
  const navigate = useNavigate();
  const email = useSelector((state) => state.user.email);
  const isLoading = useSelector((state) => state.user.isLoading);
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");

  const onFinishHandler = useCallback(() => {
    dispatch(signIn({ email, password })).then(async () => {
      const { data: profile } = await supabase.from("profiles").select("role").eq("email", email).single();
      if (profile) {
        localStorage.setItem("role", profile.role);
        localStorage.setItem("email", email);
        if (email === "admin@gmail.com") {
          navigate("/admin");
        } else if (profile.role === "regular") {
          navigate("/");
        } else if (profile.role === "shopOwner") {
          navigate("/ownershome");
        }
      }
    });
  }, [navigate, dispatch, email, password]);

  const emailChangeHandler = useCallback((event) => {
    dispatch(userActions.setEmail(event.target.value));
  }, [dispatch]);

  const passwordChangeHandler = useCallback((event) => {
    setPassword(event.target.value);
  }, []);

  const conditionalLogin = useCallback(() => {
    const userEmail = localStorage.getItem("email");
    if (userEmail) {
      const userRole = localStorage.getItem("role");
      if (userEmail === "admin@gmail.com") {
        navigate("/admin");
      } else if (userRole === "regular") {
        navigate("/");
      } else if (userRole === "shopOwner") {
        navigate("/ownershome");
      }
    }
  }, [navigate]);

  useEffect(() => {
    conditionalLogin();
  }, [conditionalLogin]);

  return (
    <div className={classes.authPage}>
      <div className={classes.loginCard}>
        <div className={classes.cardContent}>
          <h1 className={classes.title}>Welcome Back</h1>
          <p className={classes.subtitle}>Sign in to continue your culinary journey.</p>

          <Form
            layout="vertical"
            onFinish={onFinishHandler}
            className={classes.form}
          >
            <Form.Item
              label="Email Address"
              name="email"
              rules={[{ required: true, type: "email", message: "Enter a valid email!" }]}
            >
              <Input
                onChange={emailChangeHandler}
                placeholder="you@example.com"
                className={classes.input}
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Enter your password!" }]}
            >
              <Input.Password
                onChange={passwordChangeHandler}
                placeholder="••••••••"
                className={classes.input}
              />
            </Form.Item>

            <div className={classes.options}>
              <Link to="/forgot-password" className={classes.forgotLink}>Forgot password?</Link>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              block
              className={classes.loginBtn}
            >
              Sign In
            </Button>

            <p className={classes.signupPrompt}>
              Don't have an account? <Link to="/signup">Create one now</Link>
            </p>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
