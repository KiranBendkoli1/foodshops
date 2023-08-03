import React, { useContext, useState } from "react";
import FoodPlace from "./FoodPlace";
import { useSelector, useDispatch } from "react-redux";
import classes from "./HomePage.module.css";
import { useEffect } from "react";
import { Col, Row, Select, Space } from "antd";
import { fetchPlaces } from "../../store/placesSlice";
import {} from "antd";
import { ThemeContext } from "../../context/theme-context";
const { Option } = Select;

const FoodPlaces = () => {
  const [search, setSearch] = useState("");
  let foodplaces = useSelector((state) => state.places.foodplaces);
  const isLoading = useSelector((state) => state.places.isLoading);
  const names = foodplaces.map((place) => place.title);
  const locations = foodplaces.map((place) => place.location);
  const searchableItems = names.concat(locations);
  const dispatch = useDispatch();
  const themeContext = useContext(ThemeContext);
  const handleChange = (value) => {
    setSearch(value.toString());
    console.log(`selected ${value}`);
  };
  useEffect(() => {
    dispatch(fetchPlaces());
    console.log(foodplaces);
  }, []);
  return (
    <>
      <Select
        align={"center"}
        mode="multiple"
        style={{
          width: "50%",
          marginTop: "10px",
          marginBottom: "10px",
        }}
        placeholder="select location"
        onChange={handleChange}
        optionLabelProp="label"
      >
        {searchableItems.map((item) => {
          return (
            <>
              <Option value={item} label={item}>
                <Space>{item}</Space>
              </Option>
            </>
          );
        })}
      </Select>

      <Row align={"center"}>
        {foodplaces
          .filter(
            (foodplace) =>
              foodplace.title.toLowerCase().includes(search.toLowerCase()) ||
              foodplace.location.toLowerCase().includes(search.toLowerCase())
          )
          .map((foodplace) => {
            return (
              <Col key={foodplace.id}>
                <FoodPlace foodplace={foodplace} key={foodplace.id} />
              </Col>
            );
          })}
      </Row>
    </>
  );
};

export default FoodPlaces;
