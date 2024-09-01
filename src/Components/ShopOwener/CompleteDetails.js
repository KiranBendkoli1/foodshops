import React, { useEffect } from "react";
import { Card, Skeleton } from "antd";
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
  }, [id]);
  return (
    <div className={classes.background}>
      {isLoading ? (
        <Skeleton />
      ) : (
        <Card style={{ height: "auto" }}>
          <ImageCarousel
            images={data.images}
            width={"400px"}
            windth={"400px"}
          />

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
                    url: `${window.location.href}details/${id}`,
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
    </div>
  );
};

export default CompleteDetails;
