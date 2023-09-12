import React, { memo, useCallback, useMemo } from "react";
import { Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import usePlaceStore from "../../zstore/place";
const Discounts = ({ discounts, id, index }) => {
  const deleteItem = usePlaceStore(state => state.deleteItem);
  let user = useMemo(() => localStorage.getItem("user"), []);
  user = useMemo(() => JSON.parse(user), [user]);

  const deleteButtonHandler = useCallback(
    (item) => {
      const data = { id, index, item };
      deleteItem(data);
    },
    [id, index]
  );

  return (
    <>
      {discounts.map((discount, index) => {
        return (
          <div key={index}>
            <p>{`${discount.item} is at ${discount.discount}% discount`}</p>
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
