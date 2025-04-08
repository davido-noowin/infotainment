import React, { useState, useEffect, useRef } from "react";
import VolumeSlider from "./VolumeSlider";
import handleError from "../handleError";
import "./styles/SpotifyWebPlayback.css";
import skipBack from "../assets/uiButtons/SkipBack.png";
import skipForward from "../assets/uiButtons/SkipForward.png";
import pause from "../assets/uiButtons/pause.png";
import play from "../assets/uiButtons/play.png";

const track = {
  name: "",
  album: {
    images: [{ url: "" }],
  },
  artists: [{ name: "" }],
};

export default function SpotifyWebPlayback(props) {
  const [isMuted, setIsMuted] = useState(false);
  const [sliderValue, setSliderValue] = useState(20);
  const [currentTrack, setTrack] = useState(track);

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
        getOAuthToken: async (cb) => {
          var OAuthToken = props.tokenInfo.token;
          
          // check if token has expired
          if (new Date().getTime() > props.tokenInfo.expiresIn) {
            console.log("token has expired my g, refreshing rn");
            const response = await fetch("/auth/refresh-token").catch(handleError);
            if (response.ok) {
              const json = await response.json();
              // console.log('RECEIVED REFRESH REQUEST')
              // console.log(json)
              // console.log(typeof(json.expires_in))
              props.updateToken((prev) => ({
                ...prev,
                token: json.access_token,
                refreshToken: json.refresh_token,
                expiresIn: new Date().getTime() + json.expires_in * 1000,
              }));
              console.log("new token:", json.access_token)
              OAuthToken = json.access_token
            } else {
              return Promise.reject(response);
            }
          }
          console.log("IN CALLBACK", OAuthToken)
          cb(OAuthToken);
        },
        volume: 0.2,
      });

      props.updatePlayer(player);

      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
        switchPlaybackDevice(device_id);
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.addListener("player_state_changed", (state) => {
        if (!state) {
          return;
        }

        setTrack(state.track_window.current_track);
        props.setPaused(state.paused);
        props.setShuffle(state.shuffle);
        props.setURI(state.track_window.current_track.uri);
      });

      player.connect();
    };
    async function switchPlaybackDevice(device_id) {
      // console.log("id", device_id, "token", props.token)
      const response = await fetch("https://api.spotify.com/v1/me/player", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${props.tokenInfo.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ device_ids: [device_id] }),
      }).catch(handleError);
      console.log(response);
    }

    return () => {
      if (script.current) {
        // removes the listeners from the player
        script.current.remove();
      }
    };
  }, []);

  function updateVolume(event) {
    if (props.player) {
      setSliderValue(event.target.value);
      props.player.setVolume(event.target.value / 100);
    }
  }

  function toggleMuteButton() {
    if (props.player) {
      setIsMuted((prevIsMuted) => {
        !prevIsMuted
          ? props.player.setVolume(0)
          : props.player.setVolume(sliderValue / 100);
        return !prevIsMuted;
      });
    }
  }

  return (
    <>
      <div className="spotify-container">
        <div className="music-player-sections">
          <div className="now-playing-side">
            <p>Now Playing:</p>
            <div className="song-info">
              {currentTrack.album.images[0].url !== "" ? (
                <img
                  src={currentTrack.album.images[0].url}
                  className="now-playing__cover"
                  alt={currentTrack.name}
                />
              ) : null}

              <div className="song-and-artist">
                <h2>{currentTrack.name}</h2>
                <h3>{currentTrack.artists[0].name}</h3>
              </div>
            </div>
          </div>
          <div className="media-controls">
            <button
              onClick={() => {
                props.player.previousTrack();
              }}
            >
              <img src={skipBack} alt="previous track" />
            </button>
            <button
              onClick={() => {
                props.player.togglePlay();
              }}
            >
              <img
                src={props.isPaused ? play : pause}
                alt={props.isPaused ? "PLAY" : "PAUSE"}
              />
            </button>
            <button
              onClick={() => {
                props.player.nextTrack();
              }}
            >
              <img src={skipForward} alt="next track" />
            </button>
          </div>
          <div className="volume-controls">
            <VolumeSlider
              refs={{ muteButton: muteButton, slider: volumeSlider }}
              component="MusicPlayer"
              isMuted={isMuted}
              value={sliderValue}
              handleClick={toggleMuteButton}
              handleChange={updateVolume}
            />
          </div>
        </div>
      </div>
    </>
  );
}