import React, { useEffect } from "react";
import { Card, Col, Row } from "antd";
import directionIcon from "../../assets/icons/traffic-sign.png";
import {
  LikeOutlined,
  CommentOutlined,
  DislikeOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { RWebShare } from "react-web-share";
import classes from "./HomePage.module.css";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getFoodShopById } from "../../store/placesSlice";
const DetailsPage = (props) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.places.isLoading);
  const data = useSelector((state) => state.places.foodplace);

  useEffect(() => {
    dispatch(getFoodShopById({ id }));
    console.log({ data });
  }, []);
  return (
    <>
      {isLoading ? (
        <Row align="middle" style={{height:"90vh"}}>
        <Col>
        <Skeleton />
        </Col>
      </Row>
      ) : (
        <Card className={classes.detailcard}>
          <Row>
            <Col xs={24} xl={12}>
              <div>
                <img src={data.image} height="260px" />
              </div>
            </Col>
            <Col xs={24} xl={12}>
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
                {data.selectPosition && (
            <p
              onClick={() => {
                navigate(`/gotomap/${data.selectPosition[0]}/${data.selectPosition[1]}/${data.location}`);
              }}
            >
              <img
                src={directionIcon}
                alt="icon"
                style={{ width: "14px", height: "14px" }}
              />
            </p>
          )}
              </div>
            </Col>
          </Row>
        </Card>
      )}
    </>
  );
};

export default DetailsPage;
