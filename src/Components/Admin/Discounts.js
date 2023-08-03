import React, { memo, useCallback } from "react";
import { Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { deleteItem } from "../../store/placesSlice";
import { useDispatch } from "react-redux";
import { auth } from "../../config/firebase";
const Discounts = ({ discounts, id, index }) => {
  const dispatch = useDispatch();
  const deleteButtonHandler = useCallback(
    (item) => {
      console.log({ item });
      const data = { id, index, item };
      dispatch(deleteItem(data));
    },
    [id, index]
  );

  return (
    <>
      {console.log("discounts loaded")}
      {discounts.map((discount, index) => {
        return (
          <div key={index}>
            <p>{`${discount.split("|")[0]} is at ${
              discount.split("|")[1]
            }% discount`}</p>
            {auth.currentUser &&
            auth.currentUser.email === "admin@gmail.com" ? (
              <></>
            ) : (
              <Button
                type="primary"
                danger
                shape="circle"
                icon={<DeleteOutlined />}
                onClick={() => deleteButtonHandler(discount)}
              ></Button>
            )}
          </div>
        );
      })}
    </>
  );
};

export default memo(Discounts);
