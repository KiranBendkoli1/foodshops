import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Modal, Form, Input, Skeleton } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import classes from "./OwnersHomepage.module.css";
import { getUserData } from "../../store/userSlice";
import { updateData, getFoodShopById } from "../../store/placesSlice";
import MapComponent from "../Maps/MapComponent";
import useModal from "../../hooks/useModal";
import Discounts from "../Admin/Discounts";

import OwnerStats from "./OwnerStats";
import OwnerShopCard from "./OwnerShopCard";

const OwnersHomepage = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [inputItemName, setInputItemName] = useState("");
  const [inputDiscount, setInputDiscount] = useState("");
  
  const [isCommentsModalOpen, openCommentsModal, closeCommentsModal] = useModal();
  const [isDiscountModalOpen, openDiscountModal, closeDiscountModal] = useModal();
  
  const storedEmail = localStorage.getItem("email");
  const name = useSelector((state) => state.user.name);
  const contact = useSelector((state) => state.user.contact);
  const shop = useSelector((state) => state.places.foodplace);
  const isLoading = useSelector((state) => state.user.isLoading);

  const data = useMemo(() => ({ email: storedEmail, colname: "shopOwners" }), [storedEmail]);
  const idData = useMemo(() => ({ id: storedEmail }), [storedEmail]);

  useEffect(() => {
    dispatch(getUserData(data));
    dispatch(getFoodShopById(idData));
  }, [dispatch, data, idData]);

  const handleOk = useCallback(() => {
    if (inputItemName !== "" && inputDiscount !== "") {
      const updatePayload = {
        index: shop.index,
        id: shop.id,
        values: {},
        image: "",
        discount: `${inputItemName}|${inputDiscount}`,
      };
      dispatch(updateData(updatePayload)).then(() => {
        setInputDiscount("");
        setInputItemName("");
      });
    }
    form.resetFields();
  }, [inputItemName, inputDiscount, shop, dispatch, form]);

  if (isLoading) return <div className={classes.loading}><Skeleton active /></div>;

  return (
    <div className={classes.container}>
      <header className={classes.header}>
        <div>
           <h1 className={classes.title}>Welcome back, {name || 'Owner'}</h1>
           <p className={classes.subtitle}>Manage your restaurant profile and track performance.</p>
        </div>
        {!shop && (
          <Button type="primary" size="large" className={classes.addShopBtn}>
            <Link to="/addInfo">Add Shop Details</Link>
          </Button>
        )}
      </header>

      {shop ? (
        <div className={classes.dashboardGrid}>
          <OwnerStats 
            likes={shop.likes} 
            dislikes={shop.dislikes} 
            commentsCount={shop.comments?.length} 
            onCommentsClick={openCommentsModal} 
          />

          <OwnerShopCard 
            shop={shop} 
            contact={contact} 
            onManageOffers={openDiscountModal} 
          />

          <div className={classes.mapCard}>
             <h3 className={classes.cardTitle}>Location Preview</h3>
             <div className={classes.mapWrapper}>
                <MapComponent
                  currentPosition={shop.selectPosition || []}
                  mywidth="100%"
                  myheight="100%"
                  address={shop.location}
                />
             </div>
          </div>
        </div>
      ) : (
        <div className={classes.emptyState}>
           <span className="material-symbols-outlined">storefront</span>
           <p>You haven't added your shop details yet.</p>
           <Button type="primary"><Link to="/addInfo">Get Started</Link></Button>
        </div>
      )}

      {/* Modals */}
      <Modal
        title="Add Discount Offer"
        open={isDiscountModalOpen}
        onOk={() => {
          handleOk();
          closeDiscountModal();
        }}
        onCancel={closeDiscountModal}
        className={classes.customModal}
      >
        <div className={classes.modalContent}>
          {shop?.discounts?.length > 0 && (
            <div className={classes.existingDiscounts}>
              <h4>Current Offers</h4>
              <Discounts discounts={shop.discounts} index={shop.index} id={shop.id} />
            </div>
          )}
          <Form form={form} layout="vertical">
            <Form.Item label="Menu Item" name="name" rules={[{ required: true }]}>
              <Input value={inputItemName} onChange={(e) => setInputItemName(e.target.value)} placeholder="e.g. Special Sushi Platter" />
            </Form.Item>
            <Form.Item label="Discount Percentage" name="discount" rules={[{ required: true }]}>
              <Input type="number" min="5" max="100" value={inputDiscount} onChange={(e) => setInputDiscount(e.target.value)} placeholder="e.g. 20" suffix="%" />
            </Form.Item>
          </Form>
        </div>
      </Modal>

      <Modal
        title="Customer Reviews"
        open={isCommentsModalOpen}
        footer={null}
        onCancel={closeCommentsModal}
        className={classes.customModal}
      >
        <div className={classes.commentsList}>
          {shop?.comments?.length > 0 ? (
            shop.comments.map((comment, i) => (
              <div key={i} className={classes.commentItem}>
                <strong>{comment.split('|')[0]}</strong>
                <p>{comment.split('|')[1]}</p>
              </div>
            ))
          ) : (
            <p className={classes.noComments}>No reviews yet.</p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default OwnersHomepage;
