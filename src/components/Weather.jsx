import { fetchWeatherApi } from 'openmeteo';
import "./DateTimeWeather.css"
import weatherDescriptions from "../assets/weatherDescriptions.js"

const weatherURL = "https://api.open-meteo.com/v1/forecast";
const weatherParams = {
    "latitude": 33.787,
    "longitude": -117.923,
    "hourly": "temperature_2m",
    "daily": "weather_code",
    "temperature_unit": "fahrenheit",
    "wind_speed_unit": "mph",
    "precipitation_unit": "inch",
    "timezone": "America/Los_Angeles",
    "forecast_days": 1,
    "models": "gfs_seamless"
};

const weatherResponse = await fetchWeatherApi(weatherURL, weatherParams);
const daily = weatherResponse[0].daily();
const hourly = weatherResponse[0].hourly();

export default function Weather(props) {
    const date = new Date();
    const hours = date.getHours();
    const isDayTime = hours > 6 && hours < 20;
    let dayOrNight = isDayTime ? "day" : "night";
    const weatherCode = daily.variables(0).valuesArray()[0].toString();
    const temperature = Math.round(hourly.variables(0).valuesArray()[hours]);

    return (
        <div className="weather-container">
            <img src={weatherDescriptions[weatherCode][dayOrNight]["image"]} />
            <h3>{temperature}° F</h3>
        </div>
    )
}