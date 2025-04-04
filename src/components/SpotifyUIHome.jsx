import "./styles/SpotifyUIHome.css"
import { useState, useEffect } from "react"
import handleError from "../handleError";


export default function SpotifyUIHome(props) {
    const [displayName, setDisplayName] = useState("");

    useEffect(() => {
        async function getUser() {
            const response = await fetch("https://api.spotify.com/v1/me", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${props.tokenInfo.token}`,
                    "Content-Type": "application/json",
                  }
            }).catch(handleError);
            if (response.ok) {
                const json = await response.json();
                console.log(json);
                setDisplayName(json.display_name);
            }
        }

        getUser();
    }, [])


    return (
        <div className="spotify-home-container">
            <h1 className="spotify-home-welcome">Hello, {displayName.split(" ")[0]}</h1>
        </div>
    )
}