import React from "react";
import markerIcon from "../../assets/icons/icons8-location-48.png";
import { Icon } from "leaflet";
import {
  MapContainer,
  LayersControl,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import { ResetCenterView } from "../UI/Leaflet";
import { useParams } from "react-router-dom";
import LocationMarker from "./LocationMarker";
const { BaseLayer } = LayersControl;

const MapComponent = (props) => {
  const { currentPosition, mywidth, myheight, address } = props;
  const { lat, lon,loc } = useParams();
  // console.log(lat, lon);
  let selectPosition = [lat, lon];
  if (lat === undefined) {
    selectPosition = currentPosition;
  }
  if (currentPosition && currentPosition.length === 0) {
    selectPosition = [19.997454, 73.789803];
  }
  const myIcon = new Icon({
    iconUrl: markerIcon,
    iconSize: [38, 38],
  });
  return (
    <>
    {/* <p>Destination: {address? address:loc}</p> */}
      <MapContainer
        center={selectPosition}
        zoom={15}
        scrollWheelZoom={true}
        style={{
          width: `${mywidth ? mywidth : "600px"}`,
          height: `${myheight ? myheight : "480px"}`,
        }}
      >
        <LayersControl>
          <BaseLayer name="Default" checked>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=dTbTzNly1lFDDfnVDyRH"
            />
          </BaseLayer>
          <BaseLayer name="Satellite">
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
          >
            <Popup>Destination: {address? address:loc}</Popup>
          </Marker>
        )}
        <LocationMarker />
        <ResetCenterView selectPosition={selectPosition} />
      </MapContainer>
    </>
  );
};

export default MapComponent;
