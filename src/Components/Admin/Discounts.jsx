import React, { memo, useCallback } from "react";
import { Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { deleteItem } from "../../store/placesSlice";
import { useDispatch } from "react-redux";
const Discounts = ({ discounts, id, index }) => {
  const dispatch = useDispatch();
  const deleteButtonHandler = useCallback(
    (item) => {
      const data = { id, index, item };
      dispatch(deleteItem(data));
    },
    [id, index]
  );

  return (
    <>
      {discounts.map((discount, index) => {
        return (
          <div key={index}>
            <p>{`${discount.split("|")[0]} is at ${discount.split("|")[1]
              }% discount`}</p>
            {localStorage.getItem("email") === "admin@gmail.com" ? (
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
