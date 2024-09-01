import React, { useCallback,useEffect, useState } from "react";
import { Button, Card, Form, Input, Spin, Row, Col } from "antd";
import { Link, useNavigate } from "react-router-dom";
import classes from "./AuthCommon.module.css";
import { userActions, signUp } from "../../store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../../config/firebase";
const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userType, setUserType] = useState("");
  const email = useSelector((state) => state.user.email);
  const name = useSelector((state) => state.user.name);
  const contact = useSelector((state) => state.user.contact);
  const isLoading = useSelector((state) => state.user.isLoading);
  const [password, setPassword] = useState("");

  const emailChangeHandler = useCallback((event) => {
    dispatch(userActions.setEmail(event.target.value));
  }, [dispatch]);
  const passwordChangeHandler = useCallback((event) => {
    setPassword(event.target.value);
  }, [dispatch]);
  const nameChangeHandler = useCallback((event) => {
    dispatch(userActions.setName(event.target.value));
  }, [dispatch]);
  const contactChangeHandler = useCallback((event) => {
    dispatch(userActions.setContact(event.target.value));
  }, [dispatch]);

  const onFinishHandler = useCallback(() => {
    console.log("Submit executed");
    console.log({ name, email, contact, password, userType });
    dispatch(signUp({ name, email, contact, password, userType })).then(() => {
      localStorage.setItem("role", userType);
      if (userType === "regular") navigate("/");
      if (userType === "shopOwner") navigate("/ownershome");
    });
    setPassword("");
  }, [userType, name, email, contact, password]);

  const compare = useCallback((user, shopOwner) => {
    return userType === "regular" ? user : shopOwner;
  }, [userType]);
  const conditionalSignup = useCallback(() => {
    const type = localStorage.getItem("role");
    if (auth.currentUser && type === "regular" && auth.currentUser)
      navigate("/");
    if (auth.currentUser && type === "shopOwner") navigate("/ownershome");
  },[]);

  useEffect(() => {
    conditionalSignup();
  }, []);

  return isLoading ? (
    <div>
      <Row align="middle" style={{ height: "90vh" }}>
        <Col>
          <Spin
            style={{
              verticalAlign: "middle",
            }}
          />
        </Col>
      </Row>
    </div>
  ) : (
    <div className={`${classes.centerdiv} ${classes.container}`}>
      {userType === "" ? (
        <Card className={classes.card}>
          <h2 className={classes.heading}>WHY ARE YOU HERE?</h2>
          <div style={{ display: "flex", marginTop: "20px" }}>
            <Card
              hoverable={true}
              style={{ margin: "20px" }}
              onClick={() => setUserType("regular")}
            >
              To find best foodshops near you
            </Card>
            <Card
              hoverable={true}
              style={{ margin: "20px" }}
              onClick={() => setUserType("shopOwner")}
            >
              To list your foodshop here{" "}
            </Card>
          </div>
        </Card>
      ) : (
        <Card bordered={true} className={classes.card}>
          <h2 className={classes.heading}>
            SignUp Page for {compare("User", "FoodShop Owner")}
          </h2>

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
              label={compare("Full Name:", "Foodshop Name: ")}
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
              <Input
                onChange={emailChangeHandler}
                type="email"
                htmlType="email"
                value={email}
              />
            </Form.Item>
            <Form.Item
              label="Contact Number: "
              name="contact"
              rules={[
                {
                  required: true,
                  message: "Please input your contact number!",
                },
              ]}
            >
              <Input
                onChange={contactChangeHandler}
                type="number"
                htmlType="number"
                value={contact}
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
                SIGNUP
              </Button>{" "}
              <br />
            </Form.Item>
            <Link exact to={"/login"}>
              Already a user, Click Here to Login
            </Link>
          </Form>
        </Card>
      )}
    </div>
  );
};

export default Signup;
