import "./styles/MusicBar.css"
import SpotifyLogin from "./SpotifyLogin"
import SpotifyWebPlayback from "./SpotifyWebPlayback"
import hideMusicPlayer from "../assets/uiButtons/HideMusicPlayer.png"
import { useState } from "react"

export default function MusicBar(props) {
    const [token, setToken] = useState("");
    return (
        <div className={`music-bar-container ${props.sideBarOpen ? "ui-open" : ""}`}>
            {token !== "" ? <SpotifyLogin /> : <SpotifyWebPlayback />}
            <button 
                onClick={() => props.toggleMusicPlayer(false)}
                className="close-player-btn"
            >
                <img src={hideMusicPlayer} alt="close music player"/>
            </button>
        </div>
    )
}