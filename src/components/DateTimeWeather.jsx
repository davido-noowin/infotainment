import Weather from "./Weather.jsx";
import DateTime from "./DateTime.jsx";
import "./DateTimeWeather.css"

export default function DateTimeWeather() {
    return (
        <div className="date-time-weather-container">
            <DateTime />
            <Weather latitude={33.787} longitude={-117.923} />
        </div>
    )
}