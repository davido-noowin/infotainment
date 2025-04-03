import "./styles/SpotifyUI.css"
import closeUIButton from "../assets/uiButtons/closeUIButton.png";
import search from "../assets/uiButtons/Search.png";
import SpotifyUIHome from "./SpotifyUIHome";
import SpotifyUIBrowse from "./SpotifyUIBrowse";
import SpotifyUIMyPlaylists from "./SpotifyUIMyPlaylists";
import { useState } from "react"

export default function SpotifyUI(props) {
    const [activeScreen, setActiveScreen] = useState('home');

    function searchSong(formData) {
        const query = formData.get("query")
        console.log("you searched for", query)
    }

    function navigateScreens(screen) {
        setActiveScreen(screen);
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
                        <button className="spotify-title-btn" onClick={() => {navigateScreens('home')}}>Home</button>
                        <button className="spotify-title-btn" onClick={() => {navigateScreens('browse')}}>Browse</button>
                        <button className="spotify-title-btn" onClick={() => {navigateScreens('my playlists')}}>My Playlists</button>
                    </div>
                </header>
                {(() => {
                    if (activeScreen === 'home') {
                        return (<SpotifyUIHome player={props.player} />)
                    }

                    else if (activeScreen === 'browse') {
                        return (<SpotifyUIBrowse player={props.player} />)
                    }

                    else if (activeScreen === 'my playlists') {
                        return (<SpotifyUIMyPlaylists player={props.player} />)
                    }

                    else {
                        return null;
                    }
                })()}
            </div>
        </div>
    )
}