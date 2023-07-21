import React from "react";
import { Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { deleteItem } from "../../store/placesSlice";
import { useDispatch } from "react-redux";
const Discounts = ({ discounts, index, id }) => {
  const dispatch = useDispatch();
  const deleteButtonHandler = (item) => {
    console.log({item})
    const data = {id, index, item};
    dispatch(deleteItem(data));
  };
  return (
    <>
      {discounts.map((discount) => {
        return (
          <>
            <p>{`${discount.split("|")[0]} is at ${
              discount.split("|")[1]
            } discount`}</p>
            <Button
              type="primary"
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={()=>deleteButtonHandler(discount)}
            ></Button>
          </>
        );
      })}
    </>
  );
};

export default Discounts;
