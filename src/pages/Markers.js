import React from "react";
import { Marker } from "react-map-gl";

const Markers = () => {
  const locations = [
    {
      name: "Loblaws",
      latitude: 53.5283,
      longitude: -113.5263,
    },
    {
      name: "No Frills",
      latitude: 53.5068,
      longitude: -113.4653,
    },
    {
      name: "Walmart",
      latitude: 53.4697,
      longitude: -113.4174,
    },
    {
      name: "Save-On-Foods",
      latitude: 53.5447,
      longitude: -113.4906,
    },
    {
      name: "T&T",
      latitude: 53.5386,
      longitude: -113.4861,
    },
    {
      name: "Real Canadian Superstore",
      latitude: 53.5542,
      longitude: -113.4978,
    },
  ];

  return (
    <>
      {locations.map((location, index) => (
        <Marker
          key={index}
          latitude={location.latitude}
          longitude={location.longitude}
        >
          <div className="marker">{location.name}</div>
        </Marker>
      ))}
    </>
  );
};

export default Markers;
