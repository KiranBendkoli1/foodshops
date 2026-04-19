import React, { useState } from "react";
import markerIcon from "../../assets/icons/icons8-location-48.png";
import { SearchOutlined, InboxOutlined } from "@ant-design/icons";
import "leaflet/dist/leaflet.css";
import { MapContainer, LayersControl, TileLayer, Marker } from "react-leaflet";
import { Icon } from "leaflet";
import { ResetCenterView, NOMINATIM_BASE_URL } from "../UI/Leaflet";
import InfiniteScroll from "react-infinite-scroll-component";
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
  Skeleton,
  Divider,
  Upload,
  Spin,
} from "antd";
import { useNavigate } from "react-router-dom";
import { uploadFoodShopData } from "../../store/placesSlice";
import { useDispatch, useSelector } from "react-redux";
import classes from "./AddFoodPlace.module.css";
import Seo from "../SEO/Seo";

const { Dragger } = Upload;
const { BaseLayer } = LayersControl;

const AddFoodPlace = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [selectPosition, setSelectPositon] = useState([19.997454, 73.789803]);

  const myIcon = new Icon({
    iconUrl: markerIcon,
    iconSize: [38, 38],
  });
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const name = useSelector((state) => state.user.name);
  const email = useSelector((state) => state.user.email) || localStorage.getItem("email");
  const isLoading = useSelector((state) => state.places.isLoading);
  
  const [speciality, setSpeciality] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState([]);
  const [images, setImages] = useState();
  const [location, setLocation] = useState("");

  const onFinishHandler = () => {
    dispatch(
      uploadFoodShopData({
        email,
        speciality,
        description,
        selectPosition,
        location,
        images,
        type,
      })
    ).then(() => {
      navigate("/ownershome");
    });
  };

  const uploadProps = {
    name: "file",
    accept: "image/*",
    multiple: true,
    beforeUpload: () => false,
    onChange(info) {
      const images = info.fileList;
      const newImages = images.map((img) => img.originFileObj);
      setImages(newImages);
    },
  };

  if (isLoading) {
    return (
      <>
        <Seo
          title="Add your restaurant"
          description="Submit a new Food Shops listing."
          noindex
        />
        <div className={classes.loading}>
          <Spin size="large" />
        </div>
      </>
    );
  }

  return (
    <>
      <Seo
        title="Add your restaurant"
        description="Create a Food Shops listing with photos, location, and details."
        noindex
      />
    <div className={classes.pageContainer}>
      <header className={classes.header}>
        <h1 className={classes.title}>Register Your Restaurant</h1>
        <p className={classes.subtitle}>Fill in the details to join our community of culinary experts.</p>
      </header>

      <div className={classes.contentGrid}>
        <div className={classes.formSection}>
          <Card className={classes.formCard}>
            <Form layout="vertical" onFinish={onFinishHandler}>
              <Form.Item label="Speciality" name="speciality" rules={[{ required: true }]}>
                <Input 
                  placeholder="e.g. Authentic Italian Pasta" 
                  onChange={(e) => setSpeciality(e.target.value)}
                  className={classes.input}
                />
              </Form.Item>

              <Form.Item label="Search Location" name="locationSearch" rules={[{ required: true }]}>
                <div className={classes.searchWrapper}>
                  <Input
                    placeholder="Search for your address..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={classes.input}
                  />
                  <Button 
                    type="primary" 
                    icon={<SearchOutlined />} 
                    onClick={async () => {
                      const params = { q: search, format: "json", addressdetails: 1 };
                      const res = await axios(`${NOMINATIM_BASE_URL}${new URLSearchParams(params).toString()}`);
                      setData(res.data);
                    }}
                  />
                </div>
              </Form.Item>

              {data.length > 0 && (
                <div className={classes.resultsList}>
                  <List
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={(item) => (
                      <List.Item
                        className={classes.resultItem}
                        onClick={() => {
                          setLocation(item.display_name);
                          setSelectPositon([item.lat, item.lon]);
                          setData([]); // Close results
                        }}
                      >
                        <List.Item.Meta title={item.display_name} />
                      </List.Item>
                    )}
                  />
                </div>
              )}

              <Form.Item label="About Your Shop" name="description" rules={[{ required: true }]}>
                <Input.TextArea 
                  rows={4} 
                  placeholder="Tell customers what makes your place special..." 
                  onChange={(e) => setDescription(e.target.value)}
                  className={classes.input}
                />
              </Form.Item>

              <Form.Item label="Shop Category" name="type">
                <Checkbox.Group 
                  options={['Veg', 'Non Veg']} 
                  onChange={(checkedValues) => setType(checkedValues)}
                  className={classes.checkboxes}
                />
              </Form.Item>

              <div className={classes.uploadSection}>
                <label className={classes.uploadLabel}>Upload Gallery Photos</label>
                <Dragger {...uploadProps} className={classes.dragger}>
                  <p className="ant-upload-drag-icon"><InboxOutlined style={{ color: 'var(--primary-color)' }} /></p>
                  <p className="ant-upload-text">Click or drag photos to this area</p>
                  <p className="ant-upload-hint">Support for high-quality restaurant images</p>
                </Dragger>
              </div>

              <Button type="primary" htmlType="submit" block size="large" className={classes.submitBtn}>
                Launch Restaurant Profile
              </Button>
            </Form>
          </Card>
        </div>

        <div className={classes.mapSection}>
          <div className={classes.mapContainer}>
             <div className={classes.mapHeader}>
                <span className="material-symbols-outlined">map</span>
                <h3>Set Your Location</h3>
             </div>
             <div className={classes.mapWrapper}>
                <MapContainer
                  center={selectPosition}
                  zoom={13}
                  scrollWheelZoom={true}
                  style={{ width: "100%", height: "100%" }}
                >
                  <LayersControl>
                    <BaseLayer name="Light" checked>
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    </BaseLayer>
                    <BaseLayer name="Dark">
                      <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                    </BaseLayer>
                  </LayersControl>
                  <Marker position={selectPosition} icon={myIcon} />
                  <ResetCenterView selectPosition={selectPosition} />
                </MapContainer>
             </div>
             {location && (
               <div className={classes.selectedAddress}>
                 <strong>Selected:</strong> {location}
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default AddFoodPlace;
