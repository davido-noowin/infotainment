import backArrow from "../assets/uiButtons/goBack.png"
import "./styles/SpotifyUIPlaylist.css"

export default function SpotifyUIPlaylist(props) {
    function closePlaylist() {
        props.closePlaylist((prev) => !prev)
    }

    return (
        <div className="spotify-playlist-container">
            <button className="close-playlist-btn" onClick={closePlaylist}>
                <img src={backArrow} alt="go back" />
            </button>
            <div className="main-container">
                <div className="playlist-title-section">
                    <img className="playlist-img-cover" src={""} alt=""/>
                    <div className="playlist-title-and-creator">
                        <h1>the new wave</h1>
                        <p>David Nguyen</p>
                    </div>
                    <div className="playlist-btn-group">

                    </div>
                </div>
            </div>
        </div>
    )
}