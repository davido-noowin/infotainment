import { useState, useEffect } from "react"
import "./DateTimeWeather.css"
import drizzle from "../assets/weatherImages/CloudDrizzle.png"
import lightning from "../assets/weatherImages/CloudLightning.png"
import rain from "../assets/weatherImages/CloudRain.png"
import snow from "../assets/weatherImages/CloudSnow.png"
import sun from "../assets/weatherImages/Sun.png"
import wind from "../assets/weatherImages/Wind.png"

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

    console.log(date);

    return (
        <div className="date-time-weather-container">
            <div className="text-container">
                <h2>-{days[date.getDay()]}-</h2>
                <h3>{date.getDay()} {months[date.getMonth()]}. {date.getFullYear()}</h3>
                <h3>{date.toLocaleTimeString("en-US", {hour: 'numeric', minute: 'numeric', hour12: true})}</h3>
            </div>
            <div className="weather-container">
                <img src={drizzle} />
                <h3>55°</h3>
            </div>
        </div>
    )
}