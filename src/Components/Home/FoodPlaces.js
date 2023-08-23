import React, { useCallback, useMemo, useState } from "react";
import FoodPlace from "./FoodPlace";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { Col, Row, Select, Space } from "antd";
import { fetchPlaces } from "../../store/placesSlice";
const { Option } = Select;

const FoodPlaces = () => {
  const [search, setSearch] = useState("");
  let foodplaces = useSelector((state) => state.places.foodplaces);
  const names = useMemo(
    () => foodplaces.map((place) => place.title),
    [foodplaces]
  );
  const locations = useMemo(
    () => foodplaces.map((place) => place.address),
    [foodplaces]
  );
  const searchableItems = useMemo(
    () => names.concat(locations),
    [names, locations]
  );
  const dispatch = useDispatch();
  const handleChange = useCallback((value) => {
    setSearch(value.toString());
  }, []);
  useEffect(() => {
    dispatch(fetchPlaces());
  }, [dispatch]);
  return (
    <>
      <Select
        align={"center"}
        mode="multiple"
        style={{
          width: "50%",
          marginTop: "12px",
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
              foodplace.address.toLowerCase().includes(search.toLowerCase())
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
