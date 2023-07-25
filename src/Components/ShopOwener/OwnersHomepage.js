import React, { useEffect, useState } from "react";
import { Button, Card, Spin, Modal, Form, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import classes from "./ShowOwners.module.css";
import { getUserData } from "../../store/userSlice";
import ImageCarousel from "../UI/ImageCarousel";
import { updateData } from "../../utils/fun";
import veg from "../../assets/icons/icons8-veg-48.png";
import nonveg from "../../assets/icons/icons8-non-veg-48.png";
const OwnersHomepage = () => {
  const dispatch = useDispatch();
  // const email = auth.currentUser.email;
  const email = useSelector((state) => state.user.email);
  const name = useSelector((state) => state.user.name);
  const contact = useSelector((state) => state.user.contact);
  const isLoading = useSelector((state) => state.user.isLoading);
  const foodplaces = useSelector((state) => state.places.foodplaces);
  const placeData = foodplaces.filter((place) => place.title === name)[0];
  console.log({ placeData });
  const data = { email: email, colname: "shopOwners" };
  useEffect(() => {
    dispatch(getUserData(data));
  }, [dispatch]);

  const onFinish = (values) => {
    console.log("Success:", values);
    updateData(placeData.id, {}, "", `${values.name}|${values.discount}`);
    setIsModalOpen(false);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {isLoading ? (
        <Spin />
      ) : (
        <>
          <Card
            className={classes.shopcard}
            style={{ padding: "10px", width: "60%" }}
          >
            <h1>{name}</h1>
            <h4>Contact Details</h4>
            <p>
              Email Address : {email} <br />
              Telephone/Mobile No: {contact}
            </p>
 
            <p>Speciality: {placeData.speciality}</p>
            <div>
              <p>Type</p>
              <div>
                {placeData.type
                  ? placeData.type.includes("Veg") && (
                      <img
                        src={veg}
                        style={{ width: "20px", height: "20px" }}
                      />
                    )
                  : ""}{" "}
                {placeData.type
                  ? placeData.type.includes("Non Veg") && (
                      <img
                        src={nonveg}
                        style={{ width: "20px", height: "20px" }}
                      />
                    )
                  : ""}
              </div>
            </div>
            <p>Description: {placeData.description}</p>
            <p></p>
            <ImageCarousel images={placeData.images} />
          </Card>
          <div style={{ display: "flex" }}>
            {!placeData && (
              <Button>
                <Link to={"/addInfo"}>Add Shop Details</Link>
              </Button>
            )}
            <Button onClick={showModal}>
              <Link>Add Discount Offers</Link>
            </Button>
          </div>
          <Modal
            title="Add Discount Offer"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <Form
              name="basic"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              style={{
                maxWidth: 600,
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item
                label="Name of Item"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please input your item name!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Discount in %"
                name="discount"
                rules={[
                  {
                    required: true,
                    message: "Please input your discount",
                  },
                ]}
              >
                <Input
                  type="number"
                  htmlType="number"
                  min="5"
                  max="100"
                  step="5"
                />
              </Form.Item>

              <Form.Item
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}
              >
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </>
      )}
    </>
  );
};

export default OwnersHomepage;
