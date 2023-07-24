import React, { useEffect } from "react";
import { Button, Card, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import classes from "./ShowOwners.module.css";
import { getUserData } from "../../store/userSlice";
const OwnersHomepage = () => {
  const dispatch = useDispatch();
  // const email = auth.currentUser.email;
  const email = useSelector((state) => state.user.email);
  const name = useSelector((state) => state.user.name);
  const contact = useSelector((state) => state.user.contact);
  const isLoading = useSelector((state) => state.user.isLoading);
  const data = { email: email, colname: "shopOwners" };
  useEffect(() => {
    dispatch(getUserData(data));
  }, [dispatch]);
  return (
    <>
      {isLoading ? (
        <Spin />
      ) : (
        <>
          <Card className={classes.shopcard}>
            <h1>{name}</h1>
            <h4>Contact Details</h4>
            <p>
              Email Address : {email} <br />
              Telephone/Mobile No: {contact}
            </p>
          </Card>
          <div style={{ display: "flex" }}>
            <Button>
              <Link to={"/addInfo"}>Add Shop Details</Link>
            </Button>
            <Button>
              <Link>Discount Offers</Link>
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default OwnersHomepage;
