import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Modal, Form, Input, Row, Col, Skeleton } from "antd";
import {
  LikeOutlined,
  CommentOutlined,
  DislikeOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import classes from "../Auth/AuthCommon.module.css";
import { Link } from "react-router-dom";
import Discounts from "../Admin/Discounts";
import { updateData, getFoodShopByEmail } from "../../store/placesSlice";
import ImageCarousel from "../UI/ImageCarousel";
import veg from "../../assets/icons/icons8-veg-48.png";
import nonveg from "../../assets/icons/icons8-non-veg-48.png";
import MapComponent from "../Maps/MapComponent";
import useModal from "../../hooks/useModal";
const OwnersHomepage = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [inputItemName, setInputItemName] = useState("");
  const [inputDiscount, setInputDiscount] = useState("");
  const [isCommentsModalOpen, openCommentsModal, closeCommentsModal] =
    useModal();
  const [isDiscountModalOpen, openDiscountModal, closeDiscountModal] =
    useModal();
  // const user = useSelector((state) => state.user.user);
  let user = useMemo(() => localStorage.getItem("user"), []);
  user = useMemo(() => JSON.parse(user), [user]);

  const shop = useSelector((state) => state.places.foodplace);
  const isLoading = useSelector((state) => state.user.isLoading);
  useEffect(() => {
    const email = user.email;
    dispatch(getFoodShopByEmail({ email }));
  }, []);

  const handleOk = useCallback(() => {
    if (inputItemName !== "" && inputDiscount !== 0) {
      // console.log(`${inputItemName}|${inputDiscount}`);
      const data = {
        index: shop.index,
        id: shop._id,
        values: {},
        image: "",
        discount: { item: inputItemName, discount: inputDiscount },
      };
      dispatch(updateData(data)).then(() => {
        setInputDiscount("");
        setInputItemName("");
      });
    }
    form.resetFields();
  },[]);
  // console.log({ shop });
  return (
    <>
      {isLoading ? (
        <Skeleton />
      ) : (
        <>
          <Row style={{ width: "100%" }} className={classes.text}>
            <Col span={10} offset={2}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  margin: "2px 20px",
                }}
              >
                <h1 className={classes.heading}>{user.name}</h1>{" "}
                <p style={{ display: "flex" }}>
                  {shop && <p>Type: </p>} {"  "}
                  <p>
                    {shop && shop.type
                      ? shop.type.includes("Veg") && (
                          <img
                            src={veg}
                            alt="veg"
                            style={{ width: "20px", height: "20px" }}
                          />
                        )
                      : ""}{" "}
                    {shop && shop.type
                      ? shop.type.includes("Non Veg") && (
                          <img
                            src={nonveg}
                            alt="non-veg"
                            style={{ width: "20px", height: "20px" }}
                          />
                        )
                      : ""}
                  </p>
                </p>
              </div>
              {!shop  ? (
                <Button>
                  <Link to={"/addInfo"}>Add Shop Details</Link>
                </Button>
              ) : (
                <div>
                  <p>Speciality: {shop.speciality}</p>

                  <p>Description: {shop.description}</p>
                  <p>Address: {shop.address} </p>
                  <div className={classes.useractions}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                      }}
                    >
                      <p>
                        {" "}
                        {shop.likes} <LikeOutlined />
                      </p>
                      <p>
                        {shop.dislikes} <DislikeOutlined />{" "}
                      </p>
                      <p onClick={openCommentsModal}>
                        {shop.comments?.length} <CommentOutlined />
                      </p>
                    </div>
                  </div>
                  <ImageCarousel images={shop.images} width={"500px"} />
                  <h4>Contact Details</h4>
                  <p>
                    Email Address : {user.email} <br />
                    Telephone/Mobile No: {user.contact}
                  </p>
                  <div style={{ display: "flex" }}>
                    <Button onClick={openDiscountModal}>
                      <Link>Add Discount Offers</Link>
                    </Button>
                  </div>
                </div>
              )}
            </Col>
            <Col span={12} style={{ marginTop: "200px" }}>
              {shop && (
                <MapComponent
                  currentPosition={
                    shop === undefined ? [] : shop.selectPosition
                  }
                  mywidth="400px"
                  myheight="340px"
                  address={shop === undefined ? [] : shop.address}
                />
              )}
            </Col>
          </Row>

          <Modal
            title="Add Discount Offer"
            open={isDiscountModalOpen}
            onOk={() => {
              handleOk();
              closeDiscountModal();
            }}
            onCancel={() => closeDiscountModal()}
          >
            
            {shop  && shop.discounts !== undefined && (
              <Discounts
                discounts={shop.discounts}
                index={shop.index}
                id={shop._id}
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
          <Modal
            title="Comments"
            open={isCommentsModalOpen}
            onOk={() => closeCommentsModal()}
            onCancel={() => closeCommentsModal()}
          >
            {shop && shop.comments &&
              shop.comments.map((comment) => {
                return (
                  <p key={comment}>
                    <b>{comment.user}</b> {comment.comment}
                    <br />
                  </p>
                );
              })}
          </Modal>
        </>
      )}
    </>
  );
};

export default OwnersHomepage;
