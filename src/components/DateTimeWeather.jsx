import { useState, useEffect } from "react"
import { fetchWeatherApi } from 'openmeteo';
import "./DateTimeWeather.css"
import weatherDescriptions from "../assets/weatherDescriptions.json"
import drizzle from "../assets/weatherImages/CloudDrizzle.png"
import lightning from "../assets/weatherImages/CloudLightning.png"
import rain from "../assets/weatherImages/CloudRain.png"
import snow from "../assets/weatherImages/CloudSnow.png"
import sun from "../assets/weatherImages/Sun.png"
import wind from "../assets/weatherImages/Wind.png"

const weatherParams = {
    "latitude": 33.7873,
    "longitude": -117.9231,
    "hourly": "temperature_2m",
    "daily": "weather_code",
    "temperature_unit": "fahrenheit",
    "wind_speed_unit": "mph",
    "precipitation_unit": "inch",
    "timezone": "America/Los_Angeles",
    "forecast_days": 1,
    "models": "gfs_seamless"
};
const weatherURL = "https://api.open-meteo.com/v1/forecast";
const weatherResponses = await fetchWeatherApi(weatherURL, weatherParams);
const weatherResponse = weatherResponses[0];
const daily = weatherResponse.daily();
const hourly = weatherResponse.hourly();


export default function DateTimeWeather() {
    const days = [
        "SUNDAY",
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY"
    ]

    const months = [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC"
    ]

    const [date, setDate ] = useState(new Date());
    useEffect(() => {
        var timer = setInterval(() => setDate(new Date()), 1000);

        return function cleanup() {
            clearInterval(timer);
        }
    });

    const hours = date.getHours()
    const isDayTime = hours > 6 && hours < 20;
    let dayOrNight = isDayTime ? "day" : "night";
    const weatherCode = daily.variables(0).valuesArray()[0].toString();
    const temperature = Math.round(hourly.variables(0).valuesArray()[hours])

    return (
        <div className="date-time-weather-container">
            <div className="text-container">
                <h2>-{days[date.getDay()]}-</h2>
                <h3>{date.getDate()} {months[date.getMonth()]}. {date.getFullYear()}</h3>
                <h3>{date.toLocaleTimeString("en-US", {hour: 'numeric', minute: 'numeric', hour12: true})}</h3>
            </div>
            <div className="weather-container">
                <img src={weatherDescriptions[weatherCode][dayOrNight]["image"]} />
                <h3>{temperature}°</h3>
            </div>
        </div>
    )
}