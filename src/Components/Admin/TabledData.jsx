import React, { useEffect, useState } from "react";
import { Button, Table, Form, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { updateData } from "../../utils/fun";
import { fetchPlaces } from "../../store/placesSlice";
import supabase from "../../config/supabase";
const TabledData = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.places.foodplaces);
  const [isLoading, setIsLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [image, setImage] = useState("");
  const [editRow, setEditRow] = useState(null);
  const [id, setId] = useState("");
  const [form] = Form.useForm();
  useEffect(() => {
    dispatch(fetchPlaces());
    setDataSource(data);
  }, []);
  const columns = [
    {
      title: "Title",
      key: "title",
      dataIndex: "title",
      render: (text, record) => {
        // 
        if (editRow === record.key) {
          return (
            <Form.Item
              name="title"
              rules={[
                {
                  required: true,
                  message: "please enter your name",
                },
              ]}
            >
              <Input />
            </Form.Item>
          );
        } else {
          return <p>{text}</p>;
        }
      },
    },
    {
      title: "Speciality",
      key: "title",
      dataIndex: "speciality",
      render: (text, record) => {
        if (editRow === record.key) {
          return (
            <Form.Item
              name="speciality"
              rules={[
                {
                  required: true,
                  message: "please enter your speciality",
                },
              ]}
            >
              <Input />
            </Form.Item>
          );
        } else {
          return <p>{text}</p>;
        }
      },
    },
    {
      title: "Description",
      key: "title",
      dataIndex: "description",
      render: (text, record) => {
        if (editRow === record.key) {
          return (
            <Form.Item
              name="description"
              rules={[
                {
                  required: true,
                  message: "please enter your description",
                },
              ]}
            >
              <Input />
            </Form.Item>
          );
        } else {
          return <p>{text}</p>;
        }
      },
    },
    {
      title: "Image",
      key: "image",
      dataIndex: "image",
      render: (text, record) => {
        if (editRow === record.key) {
          return (
            <Form.Item
              // name="image"
              rules={[
                {
                  required: true,
                  message: "please select image",
                },
              ]}
            >
              <Input
                htmlType="file"
                type="file"
                onChange={(event) => setImage(event.target.files[0])}
              />
            </Form.Item>
          );
        } else {
          return (
            <>
              {" "}
              {isLoading ? (
                <p>Loading...</p>
              ) : (
                <img src={text} alt="" srcSet="" height={"100px"} />
              )}
            </>
          );
        }
      },
    },
    {
      title: "Location",
      key: "location",
      dataIndex: "location",
      render: (text, record) => {
        if (editRow === record.key) {
          return (
            <Form.Item
              name="location"
              rules={[
                {
                  required: true,
                  message: "please enter your address",
                },
              ]}
            >
              <Input />
            </Form.Item>
          );
        } else {
          return <p>{text}</p>;
        }
      },
    },
    {
      title: "Actions",
      render: (_, record) => {
        return (
          <>
            <Button
              type="link"
              onClick={() => {
                setEditRow(record.key);
                setId(record.id);
                form.setFieldsValue({
                  key: record.key,
                  title: record.title,
                  speciality: record.speciality,
                  description: record.description,
                  location: record.location,
                  image: record.image,
                  likes: record.likes,
                  dislikes: record.dislikes,
                });
              }}
            >
              Update
            </Button>
            <Button type="link" htmlType="submit">
              Save
            </Button>
          </>
        );
      },
    },
  ];

  const onFinish = async (values) => {
    let url = "";

    if (image) {
      const safeShopname = (values.title || "default").replace(/\s+/g, "_");
      const safeImageName = image.name.replace(/\s+/g, "_");
      const imagePath = `${safeShopname}/${Date.now()}-${safeImageName}`;

      const { data, error } = await supabase.storage
        .from("foodshops")
        .upload(imagePath, image);

      if (!error) {
        url = supabase.storage.from("foodshops").getPublicUrl(data.path).data.publicUrl;
      }
    }

    updateData(id, values, url);
    const updatedDataSource = [...dataSource];
    const temp = updatedDataSource.splice(editRow, 1, {
      ...values,
      image: url || values.image,
      key: editRow,
    });
    setDataSource(updatedDataSource);
    setEditRow(null);
    setId("");
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <Table
        pagination={{ pageSize: 3 }}
        columns={columns}
        dataSource={dataSource}
      ></Table>
    </Form>
  );
};

export default TabledData;
