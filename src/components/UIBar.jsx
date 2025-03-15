import { useState, useEffect, useRef } from "react"
import "./UIBar.css"
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
    const [sliderValue, setSliderValue] = useState(40);

    const youtubePlayerScript = useRef(null);
    const muteButton = useRef(null);
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
            player.setVolume(40);
        }

        function onPlayerStateChange() {
            console.log("my state changed");
        }

        function mute() {
            //console.log(player);
            player.isMuted() ? player.unMute() : player.mute();
        }

        if (muteButton && muteButton.current) {
            muteButton.current.addEventListener('click', mute)
        }

        return () => {
            if (script.current) {
                script.current.remove();
            }
            if (muteButton.current) {
                muteButton.current.removeEventListener('click', mute)
            }
        }
    }, [])
    

    function toggleUIMenu() {
        setUIBarIsOpen(prevIsOpen => !prevIsOpen);
    }

    function getVideoIDFromSelector(event) {
        setVideoIDFromSelector(event.target.value);
        setIsMuted(true);
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
                        <button ref={muteButton} onClick={toggleMuteButton}>
                            <h2>Ambient Noise</h2>
                            <img src={isMuted ? noVolume : volume}/>
                        </button>
                        <div className="slide-container">
                            <input 
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