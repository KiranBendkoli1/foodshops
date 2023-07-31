import React, { useEffect, useState } from "react";
import { Button, Card, Spin, Modal, Form, Input, Row, Col } from "antd";
import { useDispatch, useSelector } from "react-redux";
import classes from "../Auth/AuthCommon.module.css"
import { Link } from "react-router-dom";
import Discounts from "../Admin/Discounts";
import { getUserData } from "../../store/userSlice";
import {
  fetchPlaces,
  updateData,
  getFoodShopById,
} from "../../store/placesSlice";
import ImageCarousel from "../UI/ImageCarousel";
// import { updateData } from "../../utils/fun";
import veg from "../../assets/icons/icons8-veg-48.png";
import nonveg from "../../assets/icons/icons8-non-veg-48.png";
import MapComponent from "../Maps/MapComponent";
const OwnersHomepage = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [inputItemName, setInputItemName] = useState("");
  const [inputDiscount, setInputDiscount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [isOfferSubmitted, setIsOfferSubmitted] = useState(false);
  const email = useSelector((state) => state.user.email);
  const name = useSelector((state) => state.user.name);
  const contact = useSelector((state) => state.user.contact);
  const shop = useSelector((state) => state.places.foodplace);
  const isLoading = useSelector((state) => state.user.isLoading);
  // console.log(foodplaces);
  // console.log({ name, email });
  // const placeData = foodplaces.filter((place) => place.title === name);
  // console.log({ placeData });
  const data = { email: email, colname: "shopOwners" };
  // useEffect(()=>{

  // })
  const idData = { id: email };
  useEffect(() => {
    dispatch(getUserData(data));
    dispatch(getFoodShopById(idData));
  }, []);

  // const onFinish = (values) => {
  //   console.log("Success:", values);
  //   updateData(placeData.id, {}, "", `${values.name}|${values.discount}`);
  //   setIsModalOpen(false);
  // };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    if (inputItemName !== "" && inputDiscount !== 0) {
      console.log(`${inputItemName}|${inputDiscount}`);
      const data = {
        index: shop.index,
        id: shop.id,
        values: {},
        image: "",
        discount: `${inputItemName}|${inputDiscount}`,
      };
      dispatch(updateData(data)).then(()=>{
    setInputDiscount("");
    setInputItemName("");
      })
    }
    form.resetFields();
    // setIsOfferSubmitted(true);
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {isLoading ? (
        <Row align="middle" style={{ height: "90vh" }}>
          <Col>
            <Spin
              style={{
                verticalAlign: "middle",
              }}
            />
          </Col>
        </Row>
      ) : (
        <>
          <Row style={{ width: "100%" }}>
            <Col span={10} offset={2}>
             <div  style={{ display: "flex", justifyContent:'space-between', margin:"2px 20px" }}>
             <h1 className={classes.heading}>{name}</h1>  <p  style={{ display: "flex" }}>
                    <p>Type: </p> {"  "}
                    <p>
                      {shop && shop.type
                        ? shop.type.includes("Veg") && (
                            <img
                              src={veg}
                              style={{ width: "20px", height: "20px" }}
                            />
                          )
                        : ""}{" "}
                      {shop && shop.type
                        ? shop.type.includes("Non Veg") && (
                            <img
                              src={nonveg}
                              style={{ width: "20px", height: "20px" }}
                            />
                          )
                        : ""}
                    </p>
                  </p>
             </div>
              {shop === undefined ? (
                <Button>
                  <Link to={"/addInfo"}>Add Shop Details</Link>
                </Button>
              ) : (
                <div>
                  <p>Speciality: {shop.speciality}</p>
                 
                  <p>Description: {shop.description}</p>
                  <p>Address: {shop.location} </p>
                  <ImageCarousel images={shop.images} width={"500px"} />
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
              {shop !== undefined && (
                <MapComponent
                  currentPosition={
                    shop === undefined ? [] : shop.selectPosition
                  }
                  mywidth="400px"
                  myheight="340px"
                  address={shop === undefined ? [] : shop.location}
                />
              )}
            </Col>
          </Row>

          <Modal
            title="Add Discount Offer"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            {shop !== undefined && (
              <Discounts
                discounts={shop.discounts}
                index={shop.index}
                id={shop.id}
              />
            )}{" "}
            <Form
             form={form}
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
                  value={inputDiscount}
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

// currently after login we have
