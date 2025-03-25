import React, { useState, useEffect, useRef } from "react";
import VolumeSlider from "./VolumeSlider";
import handleError from "../handleError";
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

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
    
        document.body.appendChild(script);
        
    
        window.onSpotifyWebPlaybackSDKReady = () => {
            var player = new window.Spotify.Player({
            name: "infotainment",
            getOAuthToken: (cb) => {
              cb(tokenInfo.token);
            },
            volume: 0.2,
          });
    
          setPlayer(player);
    
          player.addListener("ready", ({ device_id }) => {
            console.log("Ready with Device ID", device_id);
            switchPlaybackDevice(device_id);
          });
    
          player.addListener("not_ready", ({ device_id }) => {
            console.log("Device ID has gone offline", device_id);
          });
    
          player.addListener('player_state_changed', ( state => {
            if (!state) {
                return;
            }
            
            // check if token has expired
            if (tokenInfo.token !== '' && new Date().getTime() > tokenInfo.expiresAt) {
              console.log('token has expired my g, refreshing rn')
              getRefreshToken()
            }
    
            setTrack(state.track_window.current_track);
            setPaused(state.paused);
        
        
            player.getCurrentState().then( state => { 
                (!state)? setActive(false) : setActive(true) 
            });
        
        }));
    
        player.connect();
        };
        async function switchPlaybackDevice(device_id) {
          // console.log("id", device_id, "token", props.token)
          const response = await fetch("https://api.spotify.com/v1/me/player", {
            method: "PUT",
            headers: {
              "Authorization": `Bearer ${tokenInfo.token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ device_ids: [device_id] }),
          })
            .catch(handleError);
          console.log(response);
        }
    
        async function getRefreshToken() {
          const response = await fetch('/auth/refresh-token')
            .catch(handleError);
          if (response.ok) {
            setTokenInfo((prev) => ({
              ...prev,
              token: response.access_token,
              refreshToken: response.refresh_token,
              expiresAt: new Date().getTime() + props.expiresIn
            }))
          }
          else {
            return Promise.reject(response);
          }
        }
    
        return () => {
          if (script.current) {
            // removes the listeners from the player 
            script.current.remove();
          }
        }
    }, []);

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
                            alt={currentTrack.name}
                        />
                        : null}

                        <div className="song-and-artist">
                            <h2>{currentTrack.name}</h2>
                            <h3>{currentTrack.artists[0].name}</h3>
                        </div>
                    </div>
                </div>
                <div className="media-controls">
                    <button
                        onClick={() => {
                            player.previousTrack().then(() => {
                              console.log('Set to previous track!');
                            });
                          }}
                    >
                        <img src={skipBack} alt="previous track"/>
                    </button>
                    <button
                        onClick={() => {
                            player.togglePlay().then(() => {
                              console.log('toggled play')
                            });
                          }}
                    >
                        <img src={isPaused ? play : pause} alt={isPaused ? "PLAY" : "PAUSE"}/>
                    </button>
                    <button
                        onClick={() => {
                            player.nextTrack().then(() => {
                              console.log('Skipped to next track!');
                            });
                          }}
                    >
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