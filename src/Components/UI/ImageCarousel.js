import React from "react";
import { Carousel, Image } from "antd";

const ImageCarousel = (props) => {

  return (
    <div style={{ width: "400px", height: "auto", alignItems:"center"}}>
      <Carousel autoplay autoplaySpeed={1000}>
        {props.images ? (
          props.images.map((image) => <Image src={image}  width={"400px"} height={"300px"}/>)
        ) : (
          <p>No Image</p>
        )}
      </Carousel>
    </div>
  );
};

export default ImageCarousel;
