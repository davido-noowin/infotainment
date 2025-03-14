import { useState, useEffect, useRef } from "react"
import "./styles/UIBar.css"
import VideoSelect from "./VideoSelect"
import Canvas from "./Canvas"
import hamburgerButton from "../assets/uiButtons/hamburgerButton.png"
import closeUIButton from "../assets/uiButtons/closeUIButton.png"
import volume from "../assets/uiButtons/Volume.png"
import noVolume from "../assets/uiButtons/NoVolume.png"

export default function UIBar() {
    const [uiBarIsOpen, setUIBarIsOpen] = useState(true);
    const [videoIDFromSelector, setVideoIDFromSelector] = useState("LRmNqKw6Ly0");
    const [isMuted, setIsMuted] = useState(true);
    const [sliderValue, setSliderValue] = useState(35);

    const youtubePlayerScript = useRef(null);
    const muteButton = useRef(null);
    const volumeSlider = useRef(null);

    let player;

    useEffect(() => {
        var script = document.createElement('script')
        script.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(script, firstScriptTag);

        window.onYouTubeIframeAPIReady = function() {
            player = new window.YT.Player('player', {
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        }

        function onPlayerReady() {
            player.setVolume(35);
        }

        function onPlayerStateChange() {
            console.log("my state changed");
        }

        function toggleMute() {
            // console.log(player);
            player.isMuted() ? player.unMute() : player.mute();
        }

        function setVolume(event) {
            // console.log(player);
            if (player) {  
                player.setVolume(event.target.value);
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
    }, [])
    

    function toggleUIMenu() {
        setUIBarIsOpen(prevIsOpen => !prevIsOpen);
    }

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
            {uiBarIsOpen ? 
                <div className="ui-bar">
                    <div className="ui-bar-header">
                        <h2>infotainment</h2>
                        <button onClick={toggleUIMenu}>
                            <img src={closeUIButton}/>
                        </button>
                    </div>
                    <VideoSelect handleSelect={getVideoIDFromSelector} focusedVideoID={videoIDFromSelector}/>
                    <div className="volume-control">
                        <h2>Ambient Noise</h2>
                        <div className="sound-button-and-slider-container">
                            <button ref={muteButton} onClick={toggleMuteButton}>
                                <img src={isMuted ? noVolume : volume}/>
                            </button>
                            <div className="slide-container">
                                <input 
                                    ref={volumeSlider}
                                    id="volume" 
                                    type="range" 
                                    min="0" 
                                    max="100" 
                                    value={sliderValue} 
                                    onChange={updateVolume}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                :
                <div className="ui-bar-no-bg">
                    <div className="ui-bar-header-no-bg">
                        <button onClick={toggleUIMenu}>
                            <img src={hamburgerButton}/>
                        </button>
                    </div>
                </div>
            }
            <Canvas id="player" ref={youtubePlayerScript} videoID={videoIDFromSelector} />
        </>
         
    )
}