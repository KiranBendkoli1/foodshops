import React, { useEffect, useState } from "react";
import { Button, Card, Spin, Modal, Form, Input, Row, Col } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Discounts from "../Admin/Discounts";
import classes from "./ShowOwners.module.css";
import { getUserData } from "../../store/userSlice";
import ImageCarousel from "../UI/ImageCarousel";
import { updateData } from "../../utils/fun";
import veg from "../../assets/icons/icons8-veg-48.png";
import nonveg from "../../assets/icons/icons8-non-veg-48.png";
import MapComponent from "../Maps/MapComponent";
const OwnersHomepage = () => {
  const dispatch = useDispatch();
  const [inputItemName, setInputItemName] = useState("");
  const [inputDiscont, setInputDiscount] = useState("");
  const email = useSelector((state) => state.user.email);
  const name = useSelector((state) => state.user.name);
  const contact = useSelector((state) => state.user.contact);
  const isLoading = useSelector((state) => state.user.isLoading);
  const foodplaces = useSelector((state) => state.places.foodplaces);
  console.log(foodplaces);
  console.log({ email });
  const placeData = foodplaces.filter((place) => place.title === name);
  console.log({ placeData });
  const data = { email: email, colname: "shopOwners" };
  useEffect(() => {
    dispatch(getUserData(data));
  }, [dispatch]);

  // const onFinish = (values) => {
  //   console.log("Success:", values);
  //   updateData(placeData.id, {}, "", `${values.name}|${values.discount}`);
  //   setIsModalOpen(false);
  // };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    if (inputItemName !== "" && inputDiscont !== 0) {
      updateData(placeData.id, {}, "", `${inputItemName}|${inputDiscont}`);
    }
    setInputDiscount("");
    setInputItemName("");
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {isLoading || placeData === undefined ? (
        <Spin />
      ) : (
        <>
          <Row style={{ width: "100%" }}>
            <Col span={10} offset={2}>
              <h1>{name}</h1>

              {/* </Card> */}
              {Array.isArray(placeData) && placeData.length === 0 ? (
                <Button>
                  <Link to={"/addInfo"}>Add Shop Details</Link>
                </Button>
              ) : (
                <div>
                  <p>Speciality: {placeData[0].speciality}</p>
                  <div style={{display:'flex'}}>
                    <p>Type: </p> {"  "}
                    <p>
                      {placeData[0].type
                        ? placeData[0].type.includes("Veg") && (
                            <img
                              src={veg}
                              style={{ width: "20px", height: "20px" }}
                            />
                          )
                        : ""}{" "}
                      {placeData[0].type
                        ? placeData[0].type.includes("Non Veg") && (
                            <img
                              src={nonveg}
                              style={{ width: "20px", height: "20px" }}
                            />
                          )
                        : ""}
                    </p>
                  </div>
                  <p>Description: {placeData[0].description}</p>
                  <p></p>
                  <ImageCarousel images={placeData[0].images} width={"500px"} />
                  <h4>Contact Details</h4>
                  <p>
                    Email Address : {email} <br />
                    Telephone/Mobile No: {contact}
                  </p>
                  <div style={{ display: "flex" }}>
                    <Button onClick={showModal}>
                      <Link>Add Discount Offers</Link>
                    </Button>
                  </div>
                </div>
              )}
            </Col>
            <Col span={12} style={{ marginTop: "200px" }}>
              <MapComponent
                currentPosition={
                  placeData === undefined ||
                  (Array.isArray(placeData) && placeData.length === 0)
                    ? []
                    : placeData[0].selectPosition
                }
                mywidth="400px"
                myheight="340px"
              />
            </Col>
          </Row>

          <Modal
            title="Add Discount Offer"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            {placeData.length > 0 && (
              <Discounts
                discounts={placeData[0].discounts}
                index={placeData[0].index}
                id={placeData[0].id}
              />
            )}{" "}
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
                <Input
                  value={inputItemName}
                  onChange={(e) => setInputItemName(e.target.value)}
                />
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
                  value={inputDiscont}
                  onChange={(e) => setInputDiscount(e.target.value)}
                />
              </Form.Item>
            </Form>
          </Modal>
        </>
      )}
    </>
  );
};

export default OwnersHomepage;
