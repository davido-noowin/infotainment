import "./styles/MusicBar.css"
import hideMusicPlayer from "../assets/uiButtons/HideMusicPlayer.png"

export default function MusicBar(props) {
    return (
        <div className={`music-bar-container ${props.sideBarOpen ? "ui-open" : ""}`}>
            <h1>Login with Spotify</h1>
            <button 
                onClick={() => props.toggleMusicPlayer(false)}
                className="close-player-btn"
            >
                <img src={hideMusicPlayer} alt="close music player"/>
            </button>
        </div>
    )
}