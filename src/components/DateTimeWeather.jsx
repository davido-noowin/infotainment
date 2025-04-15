import Weather from "./Weather.jsx";
import DateTime from "./DateTime.jsx";
import "./styles/DateTimeWeather.css";
import { useState, useEffect } from "react";

export default function DateTimeWeather({ zipcode }) {
  const [geoPosition, setGeoPosition] = useState({ latitude: 0, longitude: 0 });
  const [isValidZip, setIsValidZip] = useState(false);

  useEffect(() => {
    async function getZipcode(zip) {
      if (isNaN(zip)) {
        // console.log(zip, "exiting...")
        return;
      }
      const response = await fetch(`https://www.zippopotam.us/us/${zip}`);
      if (response.ok) {
        const json = await response.json();
        // console.log(json)
        setGeoPosition({
          longitude: parseFloat(json.places[0].longitude),
          latitude: parseFloat(json.places[0].latitude),
        });
        setIsValidZip(true);
      }
    }

    getZipcode(zipcode);
  }, [zipcode]);

  return (
    <div className="date-time-weather-container">
      <DateTime />
      {isValidZip && <Weather geoPosition={geoPosition} />}
    </div>
  );
}
