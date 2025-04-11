import { useState, useEffect, useRef } from "react";
import "./styles/UIBar.css";
import VideoSelect from "./VideoSelect";
import Canvas from "./Canvas";
import VolumeSlider from "./VolumeSlider";
import hamburgerButton from "../assets/uiButtons/hamburgerButton.png";
import closeUIButton from "../assets/uiButtons/closeUIButton.png";
import fullScreenButton from "../assets/uiButtons/FullScreenButton.png";
import shrinkScreenButton from "../assets/uiButtons/ShrinkScreenButton.png";
import musicPlayerButton from "../assets/uiButtons/MusicPlayerButton.png";
import spotifyButton from "../assets/uiButtons/spotify.png";
import fullScreenOpaqueButton from "../assets/uiButtons/FullScreenOpaqueButton.png";
import shrinkScreenOpaqueButton from "../assets/uiButtons/ShrinkScreenOpaqueButton.png";
import musicPlayerOpaqueButton from "../assets/uiButtons/MusicPlayerOpaqueButton.png";
import spotifyOpaqueButton from "../assets/uiButtons/SpotifyOpaque.png";

export default function UIBar({
  handleFullscreen,
  sideBarOpen,
  handleSideBarChange,
  toggleMusicPlayer,
  toggleSpotifyUI,
  setZipcode,
}) {
  const [videoIDFromSelector, setVideoIDFromSelector] = useState("LRmNqKw6Ly0");
  const [isMuted, setIsMuted] = useState(true);
  const [sliderValue, setSliderValue] = useState(35);

  const youtubePlayerScript = useRef(null);
  const muteButton = useRef(null);
  const volumeSlider = useRef(null);

  useEffect(() => {
    var script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
    const currentMuteButton = muteButton.current;
    const currentVolumeSlider = volumeSlider.current;

    window.onYouTubeIframeAPIReady = function () {
      globalThis.player = new window.YT.Player("player", {
        events: {
          onReady: onPlayerReady,
        },
      });
    };

    function onPlayerReady() {
      globalThis.player.setVolume(35);
    }

    function toggleMute() {
      if (globalThis.player) {
        globalThis.player.isMuted()
          ? globalThis.player.unMute()
          : globalThis.player.mute();
      }
    }

    function setVolume(event) {
      if (globalThis.player) {
        globalThis.player.setVolume(event.target.value);
      }
    }

    if (muteButton && currentMuteButton) {
      currentMuteButton.addEventListener("click", toggleMute);
    }

    if (volumeSlider && currentVolumeSlider) {
      currentVolumeSlider.addEventListener("change", setVolume);
    }

    return () => {
      if (script.current) {
        script.current.remove();
      }
      if (currentMuteButton) {
        currentMuteButton.removeEventListener("click", toggleMute);
      }
      if (currentVolumeSlider) {
        currentVolumeSlider.removeEventListener("onChange", setVolume);
      }
    };
  }, [sideBarOpen]);

  function getVideoIDFromSelector(event) {
    setVideoIDFromSelector(event.target.value);
    setIsMuted(true);
    setSliderValue(35);
  }

  function toggleMuteButton() {
    setIsMuted((prevIsMuted) => !prevIsMuted);
  }

  function updateVolume(event) {
    setSliderValue(event.target.value);
  }

  function processZip(formData) {
    const zipcode = formData.get("zip");
    setZipcode(zipcode);
  }

  return (
    <>
      {sideBarOpen ? (
        <div className="ui-bar">
          <div className="ui-bar-header">
            <h2>infotainment</h2>
            <div className="button-array">
              <button onClick={handleSideBarChange}>
                <img src={closeUIButton} />
              </button>
              {handleFullscreen.active ? (
                <button onClick={handleFullscreen.exit}>
                  <img src={shrinkScreenButton} alt="exit full screen" />
                </button>
              ) : (
                <button onClick={handleFullscreen.enter}>
                  <img src={fullScreenButton} alt="enter full screen" />
                </button>
              )}
              <button onClick={() => toggleMusicPlayer(true)}>
                <img src={musicPlayerButton} alt="music player" />
              </button>
              <button onClick={() => toggleSpotifyUI(true)}>
                <img src={spotifyButton} alt="open spotify" />
              </button>
            </div>
          </div>
          <VideoSelect
            handleSelect={getVideoIDFromSelector}
            focusedVideoID={videoIDFromSelector}
          />
          <div className="volume-control">
            <h2>Ambient Noise</h2>
            <VolumeSlider
              refs={{ muteButton: muteButton, slider: volumeSlider }}
              component="UIBar"
              isMuted={isMuted}
              value={sliderValue}
              handleClick={toggleMuteButton}
              handleChange={updateVolume}
            />
          </div>
          <div className="weather-input">
            <h2>Zip Code for Weather</h2>
            <form id="zip-form" action={processZip}>
              <input
                id="zipcode-input"
                name="zip"
                type="text"
                autoComplete="off"
                placeholder="e.g. 90210"
              ></input>
              <button type="submit" className="zip-btn">
                Submit
              </button>
            </form>
          </div>
          <div className="video-src">
            <a
              href={`https://www.youtube.com/watch?v=${videoIDFromSelector}`}
              target="_blank"
            >
              <p>Video Source</p>
            </a>
          </div>
        </div>
      ) : (
        <div className="ui-bar-no-bg">
          <div className="ui-bar-header-no-bg">
            <div className="button-array">
              <button onClick={handleSideBarChange}>
                <img src={hamburgerButton} />
              </button>
              {handleFullscreen.active ? (
                <button onClick={handleFullscreen.exit}>
                  <img src={shrinkScreenOpaqueButton} alt="exit full screen" />
                </button>
              ) : (
                <button onClick={handleFullscreen.enter}>
                  <img src={fullScreenOpaqueButton} alt="enter full screen" />
                </button>
              )}
              <button onClick={() => toggleMusicPlayer(true)}>
                <img src={musicPlayerOpaqueButton} alt="music player" />
              </button>
              <button onClick={() => toggleSpotifyUI(true)}>
                <img src={spotifyOpaqueButton} alt="open spotify" />
              </button>
            </div>
          </div>
        </div>
      )}
      <Canvas
        id="player"
        ref={youtubePlayerScript}
        videoID={videoIDFromSelector}
      />
    </>
  );
}
