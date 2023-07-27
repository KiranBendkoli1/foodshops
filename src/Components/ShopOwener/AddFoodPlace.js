import React, { useState } from "react";
import markerIcon from "../../assets/icons/icons8-location-48.png";
import { SearchOutlined } from "@ant-design/icons";
import "leaflet/dist/leaflet.css";
import { MapContainer,LayersControl, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon, latLng } from "leaflet";
import { ResetCenterView, NOMINATIM_BASE_URL } from "../UI/Leaflet";
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from "axios";
import {
  Card,
  Input,
  Form,
  Button,
  List,
  Avatar,
  Checkbox,
  Row,
  Col,
  // InfiniteScroll,
  Skeleton,
  Divider,
  Upload,
  message,
  Spin,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import classes from "../Home/HomePage.module.css";
import { uploadFoodShopData } from "../../store/placesSlice";
import { useDispatch, useSelector } from "react-redux";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../config/firebase";

const { Dragger } = Upload;
const {BaseLayer} = LayersControl;
const AddFoodPlace = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [selectPosition, setSelectPositon] = useState([19.997454, 73.789803]);

  const myIcon = new Icon({
    iconUrl: markerIcon,
    iconSize: [38, 38],
  });
  // const user = auth.currentUser.email;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const name = useSelector((state) => state.user.name);
  const tcontact = useSelector((state) => state.user.contact);
  const isLoading = useSelector((state) => state.places.isLoading);
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
      uploadFoodShopData({ speciality, description,selectPosition, location, images, type })
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
      const newImages = images.map((img) => img.originFileObj);
      setImages(newImages);
      console.log({ images });
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <div className={classes.centerdiv}>
      {isLoading ? (
        <Spin />
      ) : (
        <Col>
        <Row style={{display:'flex', justifyContent:"center", textAlign:"center"}}>
          <h2 className={classes.myheader} style={{textAlign:"center"}}>
                Add Detail Information of {title}
              </h2>
        </Row>
        <Row>
           
          <Col span={12}>
            <Card
              bordered={true}
              style={{ width: "500px", boxShadow: "3px 2px 2px #aaaaaa" }}
            >
             
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
                  const res = await axios(
                    `${NOMINATIM_BASE_URL}${queryString}`
                  );
                  console.log(res.data);
                  setData(res.data);
                }}
              >
                <SearchOutlined style={{ padding: "5px" }} />
              </Button>
            </div>
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
                  name="type"
                  valuePropName="checked"
                >
                  <Checkbox
                    onChange={(e) =>
                      setType([...type, e.target.checked && "Veg"])
                    }
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
                <Dragger
                  {...props}
                  style={{
                    width: "100%",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag file to this area to upload
                  </p>
                  <p className="ant-upload-hint">
                    Support for a single or bulk upload
                  </p>
                </Dragger>
                <Form.Item className={classes.button}>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
          <Col span={12}>
           
            <div
              id="scrollableDiv"
              style={{
                height: 140,
                overflow: "auto",
                padding: "0 16px",
                border: "1px solid rgba(140, 140, 140, 0.35)",
              }}
            >
              <InfiniteScroll
                dataLength={3}
               
                loader={
                  <Skeleton
                    avatar
                    paragraph={{
                      rows: 1,
                    }}
                    active
                  />
                }
                endMessage={<Divider ></Divider>}
                scrollableTarget="scrollableDiv"
              >
                <List
                  itemLayout="horizontal"
                  dataSource={data}
                  renderItem={(item, index) => (
                    <List.Item
                      key={item.place_id}
                      onClick={() => {
                        console.log({item})
                        setLocation(item.display_name)
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
              </InfiniteScroll>
              {console.log(selectPosition)}
            </div>
            <MapContainer
              center={selectPosition}
              zoom={13}
              scrollWheelZoom={true}
              style={{ width: "500px", height: "300px" }}
            >
             <LayersControl>
             <BaseLayer name="Default" checked>
             <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=dTbTzNly1lFDDfnVDyRH"
              />
             </BaseLayer>
             <BaseLayer name="Satellite" >
             <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=dTbTzNly1lFDDfnVDyRH"
              />
             </BaseLayer>
             <BaseLayer name="Streets" checked>
             <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=dTbTzNly1lFDDfnVDyRH"
              />
             </BaseLayer>
             </LayersControl>
              {selectPosition !== null && (
                <Marker
                  position={
                    selectPosition
                    // [19.997454, 73.789803]
                  }
                  icon={myIcon}
                ></Marker>
              )}
              <ResetCenterView selectPosition={selectPosition} />
            </MapContainer>
          </Col>
        </Row>
        </Col>
      )}
    </div>
  );
};

export default AddFoodPlace;
