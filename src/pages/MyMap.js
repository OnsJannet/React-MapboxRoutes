import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import { createRoot } from "react-dom/client";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
import { FlyToInterpolator } from "react-map-gl";

const MyMap = () => {
  const accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-113.5);
  const [lat, setLat] = useState(53.5);
  const [zoom, setZoom] = useState(12);
  const [waypoints, setWaypoints] = useState([]);
  const [markers, setMarkers] = useState([]);
  //Currently is 1.33 just put 1.5 to be safe
  const [fuelPrice, setFuelPrice] = useState(1.5);
  const [cost, setCost] = useState(0);

  const stores = [
    {
      name: "Wallmart",
      logoUrl: "https://www.logo.wine/a/logo/Walmart/Walmart-Logo.wine.svg",
      lngLat: [-113.491, 53.544],
      color: "#f00",
    },
    {
      name: "No Frills",
      logoUrl:
        "https://covid19centralca.files.wordpress.com/2021/03/76c64-1280px-no_frills_logo.svg_.png",
      lngLat: [-113.547, 53.55],
      color: "#0f0",
    },
    {
      name: "Real Canadian Superstore",
      logoUrl:
        "https://upload.wikimedia.org/wikipedia/en/thumb/b/bb/Real_Canadian_Superstore_logo.svg/440px-Real_Canadian_Superstore_logo.svg.png",
      lngLat: [-113.534, 53.544],
      color: "#00f",
    },
    {
      name: "Loblaws",
      logoUrl:
        "https://i0.wp.com/essentialbaking.com/wp-content/uploads/2021/06/loblaws-logo-png-transparent.png?ssl=1",
      lngLat: [-113.497, 53.522],
      color: "#ff0",
    },
    {
      name: "Save-On-Foods",
      logoUrl:
        "https://www.logo.wine/a/logo/Save-On-Foods/Save-On-Foods-Logo.wine.svg",
      lngLat: [-113.496, 53.511],
      color: "#0ff",
    },
    {
      name: "T&T Supermarket",
      logoUrl:
        "https://loranscholar.ca/wp-content/uploads/2019/02/TT_Supermarket_Logo.svg_.png",
      lngLat: [-113.568, 53.524],
      color: "#f0f",
    },
  ];

  const onMapClick = (event) => {
    const newWaypoint = {
      lngLat: [event.lngLat.lng, event.lngLat.lat],
    };
    setWaypoints((prevWaypoints) => {
      const updatedWaypoints = [...prevWaypoints, newWaypoint];
      console.log("waypoints", updatedWaypoints);
      return updatedWaypoints;
    });
  };

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      accessToken: accessToken,
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });

    const directions = new MapboxDirections({
      accessToken: accessToken,
      unit: "metric",
      profile: "mapbox/driving",
      waypoints: waypoints.map((waypoint) => ({
        coordinates: waypoint.lngLat,
      })),
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-left");
    map.current.addControl(directions, "top-left");

    const costElement = document.createElement("div");
    costElement.style.position = "absolute";
    costElement.style.top = "10px";
    costElement.style.right = "10px";
    costElement.style.backgroundColor = "black";
    costElement.style.color = "white";
    costElement.style.padding = "10px";
    costElement.style.borderRadius = "5px";
    costElement.style.fontSize = "16px";
    costElement.style.lineHeight = "1.5";
    costElement.style.width = "300px";
    map.current.getContainer().appendChild(costElement);

    // listen to the route event to get the distance and duration
    directions.on("route", (event) => {
      const route = event.route[0];
      // Update the cost when the directions finish calculating

      const distance = route.distance / 1000; // convert meters to kilometers
      const fuelConsumption = 10; // liters per 100 km
      const cost = distance * fuelConsumption * fuelPrice;
      setCost(cost.toFixed(2));

      // calculate shopping time
      const numLocations = route.legs.length;
      const numItems = 50; // assuming 50 items
      const shoppingTime = (numLocations * 10) + (numItems * 1);
      

      const durationInMinutes = route.duration / 60;

      // update the cost element
      costElement.innerHTML = `Cost of Driving: $${cost.toFixed(
        2
      )} <br> Total Driving in KM: $${distance.toFixed(
        2
      )} km <br> Drive Time: ${durationInMinutes.toFixed(
        0
      )} min <br> Shopping Time: ${shoppingTime.toFixed(0)} min`;

    });

    // add markers for each store
    stores.forEach((store) => {
      const marker = new mapboxgl.Marker({
        element: document.createElement("div"),
        anchor: "bottom",
      })
        .setLngLat(store.lngLat)
        .addTo(map.current);

      // add store logo to marker
      const root = createRoot(marker.getElement());
      root.render(<img src={store.logoUrl} alt={store.name} width="200" />);
    });

    // add markers for each waypoint
    const newMarkers = waypoints.map((waypoint) => {
      const marker = new mapboxgl.Marker({
        element: document.createElement("div"),
        anchor: "bottom",
      })
        .setLngLat(waypoint.lngLat)
        .addTo(map.current);
      return marker;
    });
    setMarkers(newMarkers);

    return () => {
      map.current.off("click", onMapClick);
      markers.forEach((marker) => marker.remove());
    };
  }, [lng, lat, zoom, waypoints, markers]);

  return (
    <>
      <div className="w-full md:w-auto ml-10">
        <div className="w-full md:w-auto mt-[80px] mb-[80px] ">
          <h1 className="text-5xl font-bold leading-16 mb-[32px]">
            How much does a ride to your destination will cost?
          </h1>
          <h1 className="text-[24px] font-normal leading-16">
            Plan your next grocery shopping trip with the price estimator.
          </h1>
        </div>

        <div className="">
          {/*<div className="w-full md:w-auto">
            <button onClick={() => setWaypoints([])}>Clear Waypoints</button>
  </div>*/}
          <div className="w-full" style={{ position: "relative" }}>
            <div
              ref={mapContainer}
              style={{
                width: "100%",
                height: "800px",
                borderRadius: "20px",
                marginBottom: "40px",
              }}
              className="map-container"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MyMap;
