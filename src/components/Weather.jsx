import { useState, useEffect } from "react"
import { fetchWeatherApi } from 'openmeteo';
import "./styles/DateTimeWeather.css"
import weatherDescriptions from "../assets/weatherDescriptions.js"

const weatherURL = "https://api.open-meteo.com/v1/forecast";

function isDayOrNight() {
    const date = new Date();
    const hours = date.getHours();
    const isDayTime = hours > 6 && hours < 20;
    return isDayTime ? "day" : "night";
}

export default function Weather(props) {
    const weatherParams = {
        "latitude": props.latitude,
        "longitude": props.longitude,
        "hourly": "temperature_2m",
        "daily": "weather_code",
        "temperature_unit": "fahrenheit",
        "wind_speed_unit": "mph",
        "precipitation_unit": "inch",
        "timezone": "America/Los_Angeles",
        "forecast_days": 1,
        "models": "gfs_seamless"
    };

    const [weatherResponse, setWeatherResponse] = useState(null);

    useEffect(() => {
        fetchWeatherApi(weatherURL, weatherParams)
            .then((data) => setWeatherResponse(data[0]));
    }, [])

    let dayOrNight = isDayOrNight();
    let weatherCode = ""
    let temperature = 0
    if (weatherResponse !== null) {
        const daily = weatherResponse.daily();
        const hourly = weatherResponse.hourly();
        weatherCode = daily.variables(0).valuesArray()[0].toString();
        temperature = Math.round(hourly.variables(0).valuesArray()[new Date().getHours()]);
    }
    

    return (
        <div className="weather-container">
            { 
            weatherResponse != null ? 
            <div className="weather-container">
                <img src={weatherDescriptions[weatherCode][dayOrNight]["image"]} />
                <h3>{temperature}° F</h3>
            </div>
            :
            null
            }
        </div>
    )
}