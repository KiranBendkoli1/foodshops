import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button, Card, Form, Input, Spin, Row, Col } from "antd";
import { Link, useNavigate } from "react-router-dom";
import classes from "./AuthCommon.module.css";
import { signUp } from "../../store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userType, setUserType] = useState("");
  const isLoading = useSelector((state) => state.user.isLoading);

  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const contactRef = useRef();

  const onFinishHandler = useCallback(() => {
    // console.log("Submit executed");
    const name = nameRef.current.input.value;
    const email = emailRef.current.input.value;
    const contact = contactRef.current.input.value;
    const password = passwordRef.current.input.value;
    // console.log({ name, email, contact, password, userType });
    dispatch(signUp({ name, email, contact, password, userType })).then(
      async (data) => {
        // console.log(data);
        // console.log(res);
        const res = await data.payload;
        if (res.status === "failure") {
          toast.error(res.message);
        } else if (res.status === "success") {
          // console.log(user);
          toast.success(res.message);
          const user = res.data;
          localStorage.setItem("user", JSON.stringify(user));
          if (userType === "regular") navigate("/");
          if (userType === "shopOwner") navigate("/ownershome");
        }
      }
    );
  }, [userType, nameRef, emailRef, contactRef, passwordRef, dispatch, navigate]);

  const compare = useCallback(
    (user, shopOwner) => {
      return userType === "regular" ? user : shopOwner;
    },
    [userType]
  );
  const conditionalSignup = useCallback(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role === "regular") navigate("/");
    if (user && user.role === "shopOwner") navigate("/ownershome");
  }, [navigate]);

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
              <Input ref={nameRef} />
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
              <Input type="email" htmlType="email" ref={emailRef} />
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
              <Input type="text" htmlType="text" ref={contactRef} />
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
                type="password"
                htmlType="password"
                ref={passwordRef}
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
