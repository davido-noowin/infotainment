import { useState, useEffect, useRef } from "react"
import "./styles/UIBar.css"
import VideoSelect from "./VideoSelect"
import Canvas from "./Canvas"
import VolumeSlider from "./VolumeSlider"
import hamburgerButton from "../assets/uiButtons/hamburgerButton.png"
import closeUIButton from "../assets/uiButtons/closeUIButton.png"
import fullScreenButton from "../assets/uiButtons/FullScreenButton.png"
import shrinkScreenButton from "../assets/uiButtons/ShrinkScreenButton.png"
import musicPlayerButton from "../assets/uiButtons/MusicPlayerButton.png"
import spotifyButton from "../assets/uiButtons/spotify.png"
import fullScreenOpaqueButton from "../assets/uiButtons/FullScreenOpaqueButton.png"
import shrinkScreenOpaqueButton from "../assets/uiButtons/ShrinkScreenOpaqueButton.png"
import musicPlayerOpaqueButton from "../assets/uiButtons/MusicPlayerOpaqueButton.png"
import spotifyOpaqueButton from "../assets/uiButtons/SpotifyOpaque.png"


export default function UIBar( { handleFullscreen, sideBarOpen, handleSideBarChange } ) {
    const [videoIDFromSelector, setVideoIDFromSelector] = useState("LRmNqKw6Ly0");
    const [isMuted, setIsMuted] = useState(true);
    const [sliderValue, setSliderValue] = useState(35);

    const youtubePlayerScript = useRef(null);
    const muteButton = useRef(null);
    const volumeSlider = useRef(null);


    useEffect(() => {
        var script = document.createElement('script')
        script.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(script, firstScriptTag);

        window.onYouTubeIframeAPIReady = function() {
            globalThis.player = new window.YT.Player('player', {
                events: {
                    'onReady': onPlayerReady
                }
            });
        }

        function onPlayerReady() {
            console.log("i am ready")
            globalThis.player.setVolume(35);
        }

        function toggleMute() {
            // console.log(globalThis.player);
            // console.log(muteButton)
            if (globalThis.player) {
                globalThis.player.isMuted() ? globalThis.player.unMute() : globalThis.player.mute();
            }
        }

        function setVolume(event) {
            // console.log(player);
            if (globalThis.player) {  
                globalThis.player.setVolume(event.target.value);
            }
        }

        if (muteButton && muteButton.current) {
            muteButton.current.addEventListener('click', toggleMute)
        }

        if (volumeSlider && volumeSlider.current) {
            volumeSlider.current.addEventListener('change', setVolume)
        }

        return () => {
            if (script.current) {
                script.current.remove();
            }
            if (muteButton.current) {
                muteButton.current.removeEventListener('click', toggleMute)
            }
            if (volumeSlider.current) {
                volumeSlider.current.removeEventListener('onChange', setVolume)
            }
        }
    }, [sideBarOpen]);

    function getVideoIDFromSelector(event) {
        setVideoIDFromSelector(event.target.value);
        setIsMuted(true);
        setSliderValue(35);
    }

    function toggleMuteButton() {
        setIsMuted(prevIsMuted => !prevIsMuted);
    }

    function updateVolume(event) {
        setSliderValue(event.target.value);
    }

    
    return (
        <>
            {sideBarOpen ? 
                <div className="ui-bar">
                    <div className="ui-bar-header">
                        <h2>infotainment</h2>
                        <div className="button-array">
                            <button onClick={handleSideBarChange}>
                                <img src={closeUIButton}/>
                            </button>
                            {
                            handleFullscreen.active ? 
                            <button onClick={handleFullscreen.exit}>
                                <img src={shrinkScreenButton} />
                            </button>
                            :
                            <button onClick={handleFullscreen.enter}>
                                <img src={fullScreenButton} />
                            </button>
                            }
                            <button>
                                <img src={musicPlayerButton} />
                            </button>
                            <button>
                                <img src={spotifyButton} />
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
                            refs={{"muteButton": muteButton, "slider": volumeSlider}} 
                            isMuted={isMuted}
                            value={sliderValue} 
                            handleClick={toggleMuteButton} 
                            handleChange={updateVolume} 
                        />
                    </div>
                </div>
                :
                <div className="ui-bar-no-bg">
                    <div className="ui-bar-header-no-bg">
                        <div className="button-array">
                            <button onClick={handleSideBarChange}>
                                <img src={hamburgerButton}/>
                            </button>
                            {
                            handleFullscreen.active ? 
                            <button onClick={handleFullscreen.exit}>
                                <img src={shrinkScreenOpaqueButton} />
                            </button>
                            :
                            <button onClick={handleFullscreen.enter}>
                                <img src={fullScreenOpaqueButton} />
                            </button>
                            }
                            <button>
                                <img src={musicPlayerOpaqueButton} />
                            </button>
                            <button>
                                <img src={spotifyOpaqueButton} />
                            </button>
                        </div>
                    </div>
                </div>
            }
            <Canvas 
                id="player" 
                ref={youtubePlayerScript} 
                videoID={videoIDFromSelector} 
            />
        </>
         
    )
}