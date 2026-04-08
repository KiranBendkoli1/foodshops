import React, { useCallback,useEffect, useState } from "react";
import { Button, Card, Form, Input, Spin, Row, Col } from "antd";
import { Link, useNavigate } from "react-router-dom";
import classes from "./AuthCommon.module.css";
import { signUp } from "../../store/userSlice";
import { useDispatch, useSelector } from "react-redux";

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
    if (userEmail && type === "regular")
      navigate("/");
    if (userEmail && type === "shopOwner") navigate("/ownershome");
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
            SignUp Page for {userType === "regular" ? "User" : "FoodShop Owner"}
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
              label="Full Name: "
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input your name!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            
            {userType === "shopOwner" && (
              <Form.Item
                label="Foodshop Name:"
                name="shopName"
                rules={[
                  {
                    required: true,
                    message: "Please input your foodshop name!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            )}

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
              <Input type="email" htmlType="email" />
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
              <Input type="number" htmlType="number" />
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
              <Input.Password type="password" htmlType="password" />
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
