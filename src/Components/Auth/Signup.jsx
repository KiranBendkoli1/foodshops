import React, { useCallback, useEffect, useState } from "react";
import { Button, Form, Input, Row, Col } from "antd";
import { Link, useNavigate } from "react-router-dom";
import classes from "./Signup.module.css";
import { signUp } from "../../store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import Seo from "../SEO/Seo";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userType, setUserType] = useState("");
  const isLoading = useSelector((state) => state.user.isLoading);

  const onFinishHandler = useCallback((values) => {
    const { name, shopName, email, contact, password } = values;
    dispatch(signUp({ name, shopName, email, contact, password, userType })).then(() => {
      localStorage.setItem("role", userType);
      localStorage.setItem("email", email);
      if (userType === "regular") navigate("/");
      if (userType === "shopOwner") navigate("/ownershome");
    });
  }, [userType, dispatch, navigate]);

  const conditionalSignup = useCallback(() => {
    const type = localStorage.getItem("role");
    const userEmail = localStorage.getItem("email");
    if (userEmail && type === "regular") navigate("/");
    if (userEmail && type === "shopOwner") navigate("/ownershome");
  }, [navigate]);

  useEffect(() => {
    conditionalSignup();
  }, [conditionalSignup]);

  if (isLoading) {
    return (
      <>
        <Seo
          title="Create account"
          description="Create a Food Shops account to discover places or list your restaurant."
        />
        <div className={classes.loader}>Preparing your account...</div>
      </>
    );
  }

  return (
    <>
      <Seo
        title="Create account"
        description="Join Food Shops as a diner or shop owner to explore listings or publish your food place."
      />
    <div className={classes.authPage}>
      <div className={classes.signupCard}>
        {userType === "" ? (
          <div className={classes.selectionContent}>
            <h1 className={classes.title}>Choose Your Experience</h1>
            <p className={classes.subtitle}>How would you like to use Food Finder?</p>

            <div className={classes.roleGrid}>
              <button
                type="button"
                className={classes.roleCard}
                onClick={() => setUserType("regular")}
              >
                <div className={classes.roleIcon}>
                  <span className="material-symbols-outlined">search</span>
                </div>
                <h2>Diner</h2>
                <p>Find the best food shops and explore culinary gems near you.</p>
              </button>

              <button
                type="button"
                className={classes.roleCard}
                onClick={() => setUserType("shopOwner")}
              >
                <div className={classes.roleIcon}>
                  <span className="material-symbols-outlined">storefront</span>
                </div>
                <h2>Business Owner</h2>
                <p>List your restaurant and reach thousands of food enthusiasts.</p>
              </button>
            </div>

            <p className={classes.loginHint}>
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        ) : (
          <div className={classes.formContent}>
            <button className={classes.backBtn} onClick={() => setUserType("")}>
              <span className="material-symbols-outlined">arrow_back</span>
            </button>

            <h1 className={classes.title}>
              {userType === "regular" ? "Join as a Diner" : "Join as an Owner"}
            </h1>
            <p className={classes.subtitle}>Tell us a bit about yourself to get started.</p>

            <Form
              layout="vertical"
              onFinish={onFinishHandler}
              className={classes.form}
            >
              <Form.Item
                label="Full Name"
                name="name"
                rules={[{ required: true, message: "Please enter your name" }]}
              >
                <Input placeholder="John Doe" className={classes.input} />
              </Form.Item>

              {userType === "shopOwner" && (
                <Form.Item
                  label="Restaurant Name"
                  name="shopName"
                  rules={[{ required: true, message: "Please enter your foodshop name" }]}
                >
                  <Input placeholder="The Emerald Plate" className={classes.input} />
                </Form.Item>
              )}

              <Form.Item
                label="Email Address"
                name="email"
                rules={[{ required: true, type: "email", message: "Enter a valid email" }]}
              >
                <Input type="email" placeholder="you@example.com" className={classes.input} />
              </Form.Item>

              <Form.Item
                label="Contact Number"
                name="contact"
                rules={[{ required: true, message: "Enter your contact number" }]}
              >
                <Input type="number" placeholder="+1 (555) 000-0000" className={classes.input} />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Choose a secure password" }]}
              >
                <Input.Password placeholder="••••••••" className={classes.input} />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                block
                className={classes.signupBtn}
              >
                Create Account
              </Button>
            </Form>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Signup;
