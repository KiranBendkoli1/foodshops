import React, { useEffect, useState } from "react";
import markerIcon from "../../assets/icons/icons8-location-48.png";
import { SearchOutlined } from "@ant-design/icons";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon, latLng } from "leaflet";
import { Input, List, Avatar, Col, Row, Button } from "antd";
import axios from "axios";

export const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";

export function ResetCenterView(props) {
  const { selectPositon } = props;
  const map = useMap();
  useEffect(() => {
    if (selectPositon) {
      map.setView(latLng(selectPositon[0], selectPositon[1]), map.getZoom(), {
        animate: true,
      });
    }
  }, [selectPositon]);
}

const Leaflet = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [selectPositon, setSelectPositon] = useState([19.997454, 73.789803]);

  const myIcon = new Icon({
    iconUrl: markerIcon,
    iconSize: [38, 38],
  });

  // const handleSearch = async(event) => {
  //   setSearch(event.target.value);
  //   const params = {
  //     q: event.target.value,
  //     format: "json",
  //     addressdetails: 1,
  //     polygon_geojson: 1,
  //   };

  //   const queryString = new URLSearchParams(params).toString();
  //   console.log(queryString);
  //   const requestOptions = {
  //     method: "GET",
  //     redirect: "follow",
  //   };
  //   const res = await axios(`${NOMINATIM_BASE_URL}${queryString}`);
  //   setData(res.data);
  // };

  return (
    <Row style={{ width: "100%" }}>
      <Col span={12}>
        <div style={{ display: "flex" }}>
          <Input
            onChange={(event) => setSearch(event.target.value)}
            value={search}
          />{" "}
          <Button
            onClick={async () => {
              const params = {
                q: search,
                format: "json",
                addressdetails: 1,
                polygon_geojson: 1,
              };

              const queryString = new URLSearchParams(params).toString();
              console.log(queryString);
              const requestOptions = {
                method: "GET",
                redirect: "follow",
              };
              const res = await axios(`${NOMINATIM_BASE_URL}${queryString}`);
              console.log(res.data);
              setData(res.data);
            }}
          >
            <SearchOutlined style={{ padding: "5px" }} />
          </Button>
        </div>
        <div>
          <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={(item, index) => (
              <List.Item
                key={item.place_id}
                onClick={() => {
                  setSelectPositon([item.lat, item.lon]);
                }}
              >
                <List.Item.Meta
                  avatar={<Avatar src={item.icon} />}
                  title={item.display_name}
                />
              </List.Item>
            )}
          />
        </div>
      </Col>
      {console.log(selectPositon)}
      <Col
        span={12}
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <MapContainer
          center={selectPositon}
          zoom={13}
          scrollWheelZoom={true}
          style={{ width: "500px", height: "500px" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=dTbTzNly1lFDDfnVDyRH"
          />
          {selectPositon !== null && (
            <Marker
              position={
                selectPositon
                // [19.997454, 73.789803]
              }
              icon={myIcon}
            ></Marker>
          )}
      <ResetCenterView selectPositon={selectPositon}/>
        </MapContainer>
      </Col>
    </Row>

  );
};

export default Leaflet;
