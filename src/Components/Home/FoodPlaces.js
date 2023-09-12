import React, { useCallback, useMemo, useState } from "react";
import FoodPlace from "./FoodPlace";
import { useEffect } from "react";
import { Col, Row, Select, Space } from "antd";
import usePlaceStore from "../../zstore/place";
const { Option } = Select;

const FoodPlaces = () => {
  const [search, setSearch] = useState("");
  const { foodplaces, fetchPlaces } = usePlaceStore((state) => ({
    foodplaces: state.foodplaces,
    fetchPlaces: state.fetchPlaces,
  }));
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
  const handleChange = useCallback((value) => {
    setSearch(value.toString());
  }, []);
  useEffect(() => {
    fetchPlaces();
  }, [foodplaces]);
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
