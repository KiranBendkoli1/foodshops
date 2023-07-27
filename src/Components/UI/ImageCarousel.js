import React from "react";
import { Carousel, Image } from "antd";

const ImageCarousel = (props) => {

  return (
    <div style={{ width: `${props.width}`, height: "auto", alignItems:"center"}}>
      <Carousel autoplay autoplaySpeed={1000}>
        {props.images ? (
          props.images.map((image) => <Image src={image}  width={`${props.width}`} height={`${props.height?props.height:300}`}/>)
        ) : (
          <p>No Image</p>
        )}
      </Carousel>
    </div>
  );
};

export default ImageCarousel;
