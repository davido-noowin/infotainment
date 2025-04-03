import "./styles/SpotifyUI.css"
import closeUIButton from "../assets/uiButtons/closeUIButton.png";
import search from "../assets/uiButtons/Search.png";

export default function SpotifyUI(props) {
    function searchSong(formData) {
        const query = formData.get("query")
        console.log("you searched for", query)
    }

    return (
        <div className={`${props.spotifyUIIsOpen ? "" : "hide-spotify-ui"}`}>
            <div className={`${props.tokenInfo.token !== "" ? "shadow-spotify-bg" : ""}`}></div>
            <div className="spotify-ui-container">
                <header className="spotify-ui-header">
                    <button className="close-spotify-btn" onClick={() => props.toggleSpotifyUI(false)}>
                        <img src={closeUIButton} />
                    </button>
                    <form action={searchSong} className="song-search" autoComplete="off">
                        <button type="submit"><img src={search} alt="search"/></button>
                        <input name="query" id="search-field" type="search" placeholder="I want to listen to..." />
                    </form>
                    <div className="header-bar"></div>
                    <div className="header-titles">
                        <button className="spotify-title-btn">Home</button>
                        <button className="spotify-title-btn">Browse</button>
                        <button className="spotify-title-btn">My Playlists</button>
                    </div>
                </header>
            </div>
        </div>
    )
}