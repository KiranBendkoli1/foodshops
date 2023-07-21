import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Skeleton,
  Table,
  Typography,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../config/firebase";
import { extraDataActions } from "../../store/extraDataSlice";
import { updateData } from "../../utils/fun";
import { fetchPlaces } from "../../store/placesSlice";
import Discounts from "./Discounts";
// const originData = [];
// for (let i = 0; i < 100; i++) {
//   originData.push({
//     key: i.toString(),
//     name: `Edward ${i}`,
//     age: 32,
//     address: `London Park no. ${i}`,
//   });
// }
const InputImage = () => {
  const dispatch = useDispatch();
  const handleImage = (event) => {
    dispatch(extraDataActions.setImage(event.target.files[0]));
  };
  return (
    <>
      <Input
        type="file"
        accept="image/*"
        htmlType="file"
        onChange={handleImage}
      />
    </>
  );
};
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const dispatch = useDispatch();
  const itemName = useSelector((state) => state.extras.item);
  const discount = useSelector((state) => state.extras.discount);
  let inputNode =
    inputType === "file" ? (
      <InputImage />
    ) : inputType === "number" ? (
      <InputNumber />
    ) : (
      <Input />
    );
  if (dataIndex === "discounts") {
    inputNode = (
      <>
        <Input
          placeholder="Item name"
          onChange={(e) => dispatch(extraDataActions.setItem(e.target.value))}
          value={itemName}
        />{" "}
        <br />
        <Input
          placeholder="Discount in %"
          onChange={(e) =>
            dispatch(extraDataActions.setDiscount(e.target.value))
          }
          value={discount}
        />
      </>
    );
  }
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: (dataIndex==="discounts")?false: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
const EditableTable = () => {
  const dispatch = useDispatch();
  const fetchedData = useSelector((state) => state.places.foodplaces);
  const image = useSelector((state) => state.extras.image);
  const item = useSelector((state) => state.extras.item);
  const discount = useSelector((state) => state.extras.discount);
  const isLoading = useSelector((state) => state.places.isLoading);
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.key === editingKey;

  useEffect(() => {
    dispatch(fetchPlaces());
    setData(fetchedData);
  }, [dispatch]);

  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      age: "",
      address: "",
      ...record,
    });
    setEditingKey(record.key);
  };
  const cancel = () => {
    setEditingKey("");
  };
  const save = async (key, id) => {
    try {
      const row = await form.validateFields();
      const imgRef = ref(storage, `foodshops/${image.name}`);
      const uploadTask = await uploadBytes(imgRef, image);
      const url = await getDownloadURL(uploadTask.ref);
      const discountdata = `${item} | ${discount}`;
      dispatch(extraDataActions.setItem(""));
      dispatch(extraDataActions.setDiscount(""));
      console.log({ row });
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
          image: url,
        });
        updateData(id, row, url, discountdata);
        setData(newData);
        setEditingKey("");
      
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  const columns = [
    // {
    //   title: "Id",
    //   dataIndex: "id",
    //   editable: false,
    // },
    {
      title: "Title",
      dataIndex: "title",
      editable: true,
    },
    {
      title: "Speciality",
      dataIndex: "speciality",
      editable: true,
    },
    {
      title: "Description",
      dataIndex: "description",
      editable: true,
    },
    {
      title: "Image",
      dataIndex: "image",
      editable: true,
      render: (text) => <img src={text} height={"120px"} width={"170px"} />,
    },
    {
      title: "Location",
      dataIndex: "location",
      editable: true,
    },
    {
      title: "Likes",
      dataIndex: "likes",
      editable: true,
    },
    {
      title: "Dislikes",
      dataIndex: "dislikes",
      editable: true,
    },
    {
      title: "Discounts",
      dataIndex: "discounts",
      editable: true,
      render: (discounts, data) => {
        console.log({ data });
        return <Discounts discounts={discounts} index={data.index} id={data.id}/>
      },
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key, record.id)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType:
          col.dataIndex === "image"
            ? "file"
            : col.dataIndex === "likes" && "dislikes"
            ? "number"
            : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <>
      {isLoading ? (
        <Skeleton active />
      ) : (
        <Form form={form} component={false}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            dataSource={fetchedData}
            columns={mergedColumns}
            rowClassName="editable-row"
            pagination={{
              pageSize: 3,
              onChange: cancel,
            }}
          />
        </Form>
      )}
    </>
  );
};
export default EditableTable;
