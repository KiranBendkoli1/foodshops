import React, { useState } from "react";
import FoodPlace from "./FoodPlace";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import classes from "./HomePage.module.css";
import { Col, Form, Input, Row } from "antd";
import { fetchPlaces } from "../../store/placesSlice";
const FoodPlaces = () => {
  const [search, setSearch] = useState("");
  let foodplaces = useSelector((state) => state.places.foodplaces);
  const isLoading = useSelector((state) => state.places.isLoading);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchPlaces());
    console.log(foodplaces);
  }, []);
  return (
    <>
      <Form className={classes.form}>
        <Form.Item
          name=""
          rules={[
            {
              required: false
            },
          ]}
        >
          <Input
            placeholder="Enter location/name to see results"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
        </Form.Item>
      </Form>
      <Row>
        {foodplaces
          .filter(
            (foodplace) =>
              foodplace.title.toLowerCase().includes(search.toLowerCase()) ||
              foodplace.location.toLowerCase().includes(search.toLowerCase())
          )
          .map((foodplace) => {
            return (
              <Col>
                <FoodPlace foodplace={foodplace} key={foodplace.id} />
              </Col>
            );
          })}
      </Row>
    </>
  );
};

export default FoodPlaces;
