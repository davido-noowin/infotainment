import React, { useState, useEffect, useRef } from "react";
import VolumeSlider from "./VolumeSlider";
import "./styles/SpotifyWebPlayback.css"
import skipBack from "../assets/uiButtons/SkipBack.png"
import skipForward from "../assets/uiButtons/SkipForward.png"
import pause from "../assets/uiButtons/pause.png"
import play from "../assets/uiButtons/play.png"

const track = {
    name: "",
    album: {
      images: [{ url: "" }],
    },
    artists: [{ name: "" }],
  };

export default function SpotifyWebPlayback(props) {
    const [isPaused, setPaused] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [sliderValue, setSliderValue] = useState(20);
    const [player, setPlayer] = useState(undefined);
    const [currentTrack, setTrack] = useState(track);
    const [tokenInfo, setTokenInfo] = useState({
        token: props.token,
        refreshToken: props.refreshToken,
        expiresAt: new Date().getTime() + props.expiresIn
    });

    const muteButton = useRef(null);
    const volumeSlider = useRef(null);

    return (
        <div className="spotify-container">
            <div className="music-player-sections">
                <div className="now-playing-side">
                    <p>Now Playing:</p>
                    <div className="song-info">
                        {currentTrack.album.images[0].url !== "" ? 
                        <img
                            src={currentTrack.album.images[0].url}
                            className="now-playing__cover"
                            alt=""
                        />
                        : null}

                        <div className="song-and-artist">
                            <h2>{currentTrack.name}</h2>
                            <h3>{currentTrack.artists[0].name}</h3>
                        </div>
                    </div>
                </div>
                <div className="media-controls">
                    <button>
                        <img src={skipBack} alt="previous track"/>
                    </button>
                    <button>
                        <img src={isPaused ? play : pause} alt={isPaused ? "PLAY" : "PAUSE"}/>
                    </button>
                    <button>
                    <img src={skipForward} alt="next track"/>
                    </button>
                </div>
                <div className="volume-controls">
                    <VolumeSlider 
                        refs={{ muteButton: muteButton, slider: volumeSlider }}
                        isMuted={isMuted}
                        value={sliderValue}
                    />
                </div>
            </div>
        </div>
    )
}