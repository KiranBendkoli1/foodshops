import React, { memo, useCallback ,useMemo} from "react";
import { Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { deleteItem } from "../../store/placesSlice";
import { useDispatch } from "react-redux";
const Discounts = ({ discounts, id, index }) => {
  
  let user = localStorage.getItem("user");
  user = useMemo(() => JSON.parse(user), [user]);
  const dispatch = useDispatch();
  const deleteButtonHandler = useCallback(
    (item) => {
      // console.log({ item });
      const data = { id, index, item };
      dispatch(deleteItem(data));
    },
    [id, index, dispatch]
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
