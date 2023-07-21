import React, { useState } from "react";
import { Card, Input, Form, Button } from "antd";
import { useNavigate } from "react-router-dom";
import classes from "./HomePage.module.css";
import { uploadFoodPlaceData } from "../../utils/fun";
const AddFoodPlace = () => {
  // const user = auth.currentUser.email;
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [location, setLocation] = useState("");
  const onFinishHandler = () => {
    // event.preventDefault();
    uploadFoodPlaceData(
      title,
      speciality,
      description,
      location,
      image
    ).then(() => {
      navigate("/");
    });
   
    console.log("image", image);
  };
  return (
    <div className={classes.centerdiv}>
      <Card
        bordered={true}
        style={{ width: "500px", boxShadow: "3px 2px 2px #aaaaaa" }}
      >
        <h2 className={classes.heading}>Add New Shop Info</h2>
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
            label="Enter Shop Name"
            name="shopname"
            rules={[
              {
                required: true,
                message: "Please input shop name!",
              },
            ]}
          >
            <Input
              onChange={(event) => setTitle(event.target.value)}
              value={title}
            />
          </Form.Item>
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
            label="Describe place in details"
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
            label="Select Image"
            name="image"
            rules={[
              {
                required: true,
                message: "Please url of image",
              },
            ]}
          >
            <Input
              htmlType="file"
              type="file"
              onChange={(event) => setImage(event.target.files[0])}
            />
          </Form.Item>

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
