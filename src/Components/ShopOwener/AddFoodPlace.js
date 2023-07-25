import React, { useState } from "react";
import { Card, Input, Form, Button, Checkbox, Upload, message, Spin } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import classes from "../Home/HomePage.module.css";
import {uploadFoodShopData} from "../../store/placesSlice"
import { useDispatch, useSelector } from "react-redux";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../config/firebase";
const { Dragger } = Upload;

const AddFoodPlace = () => {
  // const user = auth.currentUser.email;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const name = useSelector((state) => state.user.name);
  const tcontact = useSelector((state) => state.user.contact);
  const isLoading = useSelector((state)=> state.places.isLoading)
  const [title, setTitle] = useState(name);
  const [speciality, setSpeciality] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [type, setType] = useState([]);
  const [images, setImages] = useState();
  const [contact, setContact] = useState(tcontact);
  const [location, setLocation] = useState("");
  const onFinishHandler = () => {
    // event.preventDefault();
    dispatch(
      uploadFoodShopData({ speciality, description, location, images, type })
    ).then(() => {
      navigate("/");
    });
    console.log(images);
  };

  // props for upload
  const props = {
    name: "file",
    multiple: true,
    onChange(info) {
      console.log({ info });
      const images = info.fileList;
      const newImages = images.map((img)=> (img.originFileObj))
      setImages(newImages);
      console.log({ images });
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <div className={classes.centerdiv}>
      { isLoading? <Spin/>:
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
          <Form.Item label="Select Type" name="type" valuePropName="checked">
            <Checkbox
              onChange={(e) => setType([...type, e.target.checked && "Veg"])}
            >
              Veg
            </Checkbox>
            <Checkbox
              onChange={(e) =>
                setType([...type, e.target.checked && "Non Veg"])
              }
            >
              Non Veg
            </Checkbox>
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
      }
    </div>
  );
};

export default AddFoodPlace;
