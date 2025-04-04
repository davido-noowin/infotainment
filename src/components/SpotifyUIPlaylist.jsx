import backArrow from "../assets/uiButtons/goBack.png"
import pause from "../assets/uiButtons/pause.png";
import play from "../assets/uiButtons/play.png";
import shuffle from "../assets/uiButtons/Shuffle.png";
import disableShuffle from "../assets/uiButtons/DisableShuffle.png";
import leftArrow from "../assets/uiButtons/ArrowLeft.png"
import rightArrow from "../assets/uiButtons/ArrowRight.png"
import "./styles/SpotifyUIPlaylist.css"
import handleError from "../handleError";
import { useState, useEffect } from "react"

export default function SpotifyUIPlaylist(props) {
    const [isShuffled, setShuffle] = useState(false)

    useEffect(() =>{
        props.player.getCurrentState()
            .then(res => setShuffle(res.shuffle));
    }, [])

    function closePlaylist() {
        props.closePlaylist((prev) => !prev)
    }

    async function toggleShuffle() {
        await fetch(`https://api.spotify.com/v1/me/player/shuffle?state=${!isShuffled}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${props.tokenInfo.token}`,
                "Content-Type": "application/json",
              }
        }).catch(handleError);
        setShuffle((prev) => !prev);
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
                </div>
                <div className="playlist-btn-group">
                    <div className="song-control-btn-group">
                        <button className="song-control-btn">
                            <img src={play}/>
                        </button>
                        <button className="song-control-btn" onClick={toggleShuffle}>
                            <img src={isShuffled ? shuffle : disableShuffle}/>
                        </button>
                    </div>
                    <div className="pagination-btn-group">
                        <button className="pagination-btn">
                            <img src={leftArrow} />
                        </button>
                        <p className="pagination-page">1</p>
                        <button className="pagination-btn">
                            <img src={rightArrow} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}