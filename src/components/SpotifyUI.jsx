import "./styles/SpotifyUI.css"
import closeUIButton from "../assets/uiButtons/closeUIButton.png";
import search from "../assets/uiButtons/Search.png";

export default function SpotifyUI(props) {
    return (
        <div className={`${props.spotifyUIIsOpen ? "" : "hide-spotify-ui"}`}>
            <div className={`${props.tokenInfo.token !== "" ? "shadow-spotify-bg" : ""}`}></div>
            <div className="spotify-ui-container">
                <header className="spotify-ui-header">
                    <button className="close-spotify-btn" onClick={() => props.toggleSpotifyUI(false)}>
                        <img src={closeUIButton} />
                    </button>
                    <form className="song-search">
                        <button><img src={search} alt="search"/></button>
                        <input className="search-field" type="search" placeholder="I want to listen to..." />
                    </form>
                </header>
            </div>
        </div>
    )
}