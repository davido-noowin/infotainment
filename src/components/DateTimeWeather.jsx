import "./DateTimeWeather.css"
import drizzle from "../assets/weatherImages/CloudDrizzle.png"
import lightning from "../assets/weatherImages/CloudLightning.png"
import rain from "../assets/weatherImages/CloudRain.png"
import snow from "../assets/weatherImages/CloudSnow.png"
import sun from "../assets/weatherImages/Sun.png"
import wind from "../assets/weatherImages/Wind.png"

export default function DateTimeWeather() {
    const days = {
        0 : "SUNDAY",
        1 : "MONDAY",
        2 : "TUESDAY",
        3 : "WEDNESDAY",
        4 : "THURSDAY",
        5 : "FRIDAY",
        6 : "SATURDAY"
    }
    const date = new Date();
    console.log(date);

    return (
        <div className="date-time-weather-container">
            <div className="text-container">
                <h2>-{days[date.getDay()]}-</h2>
                <h3>11 MAR. 2025</h3>
                <h3>12:00 PM</h3>
            </div>
            <div className="weather-container">
                <img src={drizzle} />
                <h3>55°</h3>
            </div>
        </div>
    )
}