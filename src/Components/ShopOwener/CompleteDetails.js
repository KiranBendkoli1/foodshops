import React, { useEffect, useState } from "react";
import { Card, Col, Row, Spin } from "antd";
import {
  LikeOutlined,
  CommentOutlined,
  DislikeOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { RWebShare } from "react-web-share";
import classes from "../Home/HomePage.module.css";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getFoodShopById } from "../../store/placesSlice";
import ImageCarousel from "../UI/ImageCarousel";
const CompleteDetails = (props) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.places.isLoading);
  const data = useSelector((state) => state.places.foodplace);

  useEffect(() => {
    dispatch(getFoodShopById({ id }));
    // console.log({ data });
  }, [dispatch]);
  return (
    <>
      {isLoading ? (
        <div className="" style={{ height: "100%", windth: "100%" }}>
          <Spin />
        </div>
      ) : (
        <Card style={{ height: "auto" }}>
          <ImageCarousel images={data.images} />

          <div>
            <h2 className={classes.shopname}>{data?.title || ""}</h2>
            <p>Speciality: {data.speciality}</p>
            <p>{data.description}</p>
            <p>Contact No: {data.contact}</p>
            <p>Address: {data.location}</p>
            <div className={classes.useractions}>
              <p>
                {" "}
                {data.likes} <LikeOutlined />
              </p>
              <p>
                {data.dislikes} <DislikeOutlined />{" "}
              </p>
              <p>
                <Link to={`/comments/${id}`}>
                  {data.comments?.length} <CommentOutlined />
                </Link>
              </p>
              <p>
                <RWebShare
                  data={{
                    text: `details of ${data.title}`,
                    url: `http://localhost:3000/details/${id}`,
                    title: data.title,
                  }}
                >
                  <ShareAltOutlined />
                </RWebShare>
              </p>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default CompleteDetails;
