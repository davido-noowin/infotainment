import { useState, useEffect } from "react"
import "./styles/DateTimeWeather.css"

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

export default function DateTime() {
    const [date, setDate ] = useState(new Date());
    useEffect(() => {
        var timer = setInterval(() => setDate(new Date()), 1000);

        return function cleanup() {
            clearInterval(timer);
        }
    });
    return (
        <div className="text-container">
            <h2>- {days[date.getDay()]} -</h2>
            <h3>{date.getDate()} {months[date.getMonth()]}. {date.getFullYear()}</h3>
            <h3>{date.toLocaleTimeString("en-US", {hour: 'numeric', minute: 'numeric', hour12: true})}</h3>
        </div>
    )
}