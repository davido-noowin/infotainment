import "./styles/SpotifyUI.css"
import closeUIButton from "../assets/uiButtons/closeUIButton.png";

export default function SpotifyUI(props) {
    return (
        <div className={`${props.spotifyUIIsOpen ? "" : "hide-spotify-ui"}`}>
            <div className={`${props.tokenInfo.token !== "" ? "shadow-spotify-bg" : ""}`}></div>
            <div className="spotify-ui-container">
                <button className="close-spotify-btn" onClick={() => props.toggleSpotifyUI(false)}>
                    <img src={closeUIButton} />
                </button>
                it works
            </div>
        </div>
    )
}