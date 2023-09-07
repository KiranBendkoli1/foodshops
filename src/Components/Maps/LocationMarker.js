import React, { useEffect, useState } from "react";
import { Marker, Popup, useMapEvent } from "react-leaflet";
import yourLocation from "../../assets/icons/location_icon-icons.com_50109.png"
import { Icon } from "leaflet";
const LocationMarker = () => {
  const myIcon = new Icon({
    iconUrl: yourLocation,
    iconSize: [38, 38],
  });
  const [position, setPosition] = useState(null);
  const map = useMapEvent({
    click() {
      map.locate();
    },
    locationFound(e) {
      setPosition(e.latlng);
      console.log(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (location) =>
        setPosition([location.coords.latitude, location.coords.longitude]),
      (error) => console.log(error)
    );
  }, []);
  return position === null ? null : (
    <Marker position={position} icon={myIcon}>
      <Popup>You are here</Popup>
    </Marker>
  );
};

export default LocationMarker;
