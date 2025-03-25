import "./styles/MusicBar.css"
import SpotifyLogin from "./SpotifyLogin"
import hideMusicPlayer from "../assets/uiButtons/HideMusicPlayer.png"

export default function MusicBar(props) {
    return (
        <div className={`music-bar-container ${props.sideBarOpen ? "ui-open" : ""}`}>
            <SpotifyLogin />
            <button 
                onClick={() => props.toggleMusicPlayer(false)}
                className="close-player-btn"
            >
                <img src={hideMusicPlayer} alt="close music player"/>
            </button>
        </div>
    )
}