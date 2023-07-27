import { useState } from "react";
import { GoogleMap, Marker, Autocomplete } from "@react-google-maps/api";
import { Card,  Input, Button } from "antd";
import { HomeOutlined } from "@ant-design/icons";
const SimpleMap = () => {
  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const center = { lat: 19.997454, lng: 73.789803 };
  return (
    <>
      <Card>
        <div>
          <Autocomplete>
            <Input placeholder="Origin" />
          </Autocomplete>
          <Autocomplete>
            <Input placeholder="Destination" />
          </Autocomplete>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </div>

        <HomeOutlined onClick={() => map && map.panTo(center)} />
      </Card>

      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          verticalAlign: "center",
        }}
      >
        <GoogleMap
          mapContainerStyle={{ height: "500px", width: "650px" }}
          center={center}
          zoom={11}
          options={{
            streetViewControl: true,
            mapTypeControl: true,
          }}
          onLoad={(map) => setMap(map)}
        >
          <Marker position={center} />
        </GoogleMap>
      </div>
    </>
  );
};

export default SimpleMap;
