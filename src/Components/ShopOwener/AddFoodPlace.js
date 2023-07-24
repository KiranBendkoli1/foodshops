import React, { useState } from "react";
import { Card, Input, Form, Button, Checkbox, Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import classes from "../Home/HomePage.module.css";
import { uploadFoodPlaceData } from "../../utils/fun";
import { useSelector } from "react-redux";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../config/firebase";
const { Dragger } = Upload;

const props = {
  name: "file",
  multiple: true,
  onChange(info) {
    const images = [];
    console.log({info})
    const files = info.fileList;
    console.log({files});
    // console.log({ file });
    files.forEach(file => {
      const imgRef = ref(storage, `foodshops/${file.name}`);
      uploadBytes(imgRef, file).then((uploadTask) => {
        getDownloadURL(uploadTask.ref).then((url) => {
          images.push(url);
        });
      });
    })
  },
  
  
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
};
const AddFoodPlace = () => {
  // const user = auth.currentUser.email;
  const navigate = useNavigate();
  const name = useSelector((state) => state.user.name);
  const tcontact = useSelector((state) => state.user.contact);

  const [title, setTitle] = useState(name);
  const [speciality, setSpeciality] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [contact, setContact] = useState(tcontact);
  const [location, setLocation] = useState("");
  const onFinishHandler = () => {
    // event.preventDefault();
    uploadFoodPlaceData(title, speciality, description, location, image).then(
      () => {
        navigate("/");
      }
    );

    console.log("image", image);
  };
  return (
    <div className={classes.centerdiv}>
      <Card
        bordered={true}
        style={{ width: "500px", boxShadow: "3px 2px 2px #aaaaaa" }}
      >
        <h2 className={classes.myheader}>Add Detail Information of {title}</h2>
        <Form
          labelCol={{
            span: 10,
          }}
          wrapperCol={{
            span: 16,
          }}
          autoComplete="off"
          onFinish={onFinishHandler}
        >
          <Form.Item
            label="Speciality"
            name="speciality"
            rules={[
              {
                required: true,
                message: "Please input Shop's Speciality",
              },
            ]}
          >
            <Input
              onChange={(event) => setSpeciality(event.target.value)}
              value={speciality}
            />
          </Form.Item>
          <Form.Item
            label="Location"
            name="location"
            rules={[
              {
                required: true,
                message: "Please input location",
              },
            ]}
          >
            <Input
              onChange={(event) => setLocation(event.target.value)}
              value={location}
            />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[
              {
                required: true,
                message: "Please input description about place!",
              },
            ]}
          >
            <Input
              onChange={(event) => setDescription(event.target.value)}
              value={description}
            />
          </Form.Item>
          <Form.Item
            label="Select Type"
            name="disabled"
            valuePropName="checked"
          >
            <Checkbox>Veg</Checkbox>
            <Checkbox>Non Veg</Checkbox>
          </Form.Item>
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload. Strictly prohibited from
              uploading company data or other banned files.
            </p>
          </Dragger>
          <Form.Item className={classes.button}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddFoodPlace;
