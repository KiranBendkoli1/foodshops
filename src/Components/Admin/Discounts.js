import React, { memo, useCallback } from "react";
import { Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { deleteItem } from "../../store/placesSlice";
import { useDispatch,useSelector } from "react-redux";
const Discounts = ({ discounts, id, index }) => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const deleteButtonHandler = useCallback(
    (item) => {
      // console.log({ item });
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
            <p>{`${discount.item} is at ${discount.discount}% discount`}</p>
            {console.log(user)}
            {user && user.email === "admin@admin.com" ? (
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
