import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Skeleton,
  Table,
  Typography,
} from "antd";
import ImageCarousel from "../UI/ImageCarousel";
import { useDispatch, useSelector } from "react-redux";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../config/firebase";
import { extraDataActions } from "../../store/extraDataSlice";
import {
  fetchPlaces,
  deleteDataFromDb,
  updateData,
} from "../../store/placesSlice";
import Discounts from "./Discounts";

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
              required: dataIndex === "discounts" ? false : true,
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
  const handleDelete = (key, id) => {
    console.log(id);
    const newData = data.filter((item) => item.key !== key);
    dispatch(deleteDataFromDb(id));
    setData(newData);
  };
  const save = async (key, id) => {
    try {
      const row = await form.validateFields();
      console.log(image);
      const imgRef = ref(storage, `foodshops/${image.name}`);
      const uploadTask = await uploadBytes(imgRef, image);
      let url = await getDownloadURL(uploadTask.ref);
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
        if (image === "") {
          url = image;
        }
        const data = {
          index,
          id,
          values: row,
          image: url,
          discount: discountdata,
        };
        console.log(data);
        dispatch(updateData(data));
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
      dataIndex: "images",
      editable: true,
      render: (text) => (
        <ImageCarousel images={text} width={"200px"} height={"160px"} />
      ),
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
      editable: false,
      render: (discounts, data) => {
        // console.log({ data });
        return (
          <Discounts discounts={discounts} index={data.index} id={data.id} />
        );
      },
    },
    {
      title: "Edit",
      dataIndex: "edit",
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
    {
      title: "Delete",
      dataIndex: "delete",
      render: (_, record) =>
        data.length >= 1 ? (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.key, record.id)}
          >
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => {
        return {
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
      }},
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