import "./styles/MusicBar.css"
import hideMusicPlayer from "../assets/uiButtons/HideMusicPlayer.png"

export default function MusicBar(props) {
    return (
        <div className={`music-bar-container ${props.sideBarOpen ? "ui-open" : ""}`}>
            <h1>Music Bar works</h1>
            <button onClick={() => props.toggleMusicPlayer(false)}>
                close
            </button>
        </div>
    )
}