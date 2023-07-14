import React from "react";
import { Card, Input, Form, Button } from "antd";
import { Link } from "react-router-dom";
import classes from "./HomePage.module.css";
const AddFoodPlace = () => {
  return (
    <div className={classes.centerdiv}>    
    <Card  bordered={true} style={{width:'500px',  boxShadow: "3px 2px 2px #aaaaaa" }}>
      <h2 className={classes.heading}>Add New Shop Info</h2>
      <Form
        labelCol={{
          span: 10,
        }}
        wrapperCol={{
          span: 16,
        }}
        autoComplete="off"
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
          <Input />
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
          <Input />
        </Form.Item>
        <Form.Item
          label="Owener's Name"
          name="nameOfOwener"
          rules={[
            {
              required: true,
              message: "Please input name of owener",
            },
          ]}
        >
          <Input />
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
          <Input />
        </Form.Item>
        <Form.Item
          label="Enter image url"
          name="image"
          rules={[
            {
              required: true,
              message: "Please url of image",
            },
          ]}
        >
          <Input />
        </Form.Item>
        
        <Form.Item
        className={classes.button}
        >
          <Button type="primary" htmlType="submit">
            <Link to={"/"}>Submit</Link>
          </Button>
          </Form.Item>
      </Form>
    </Card>
    </div>

  );
};

export default AddFoodPlace;
