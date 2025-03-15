import { useState, useEffect, useRef } from "react"
import "./UIBar.css"
import VideoSelect from "./VideoSelect"
import Canvas from "./Canvas"
import hamburgerButton from "../assets/uiButtons/hamburgerButton.png"
import closeUIButton from "../assets/uiButtons/closeUIButton.png"

export default function UIBar() {
    const [uiBarIsOpen, setUIBarIsOpen] = useState(true);
    const [videoIDFromSelector, setVideoIDFromSelector] = useState("LRmNqKw6Ly0");
    const [isMuted, setIsMuted] = useState(true);

    const youtubePlayerScript = useRef(null);
    const muteButton = useRef(null);
    let player;

    useEffect(() => {
        var script = document.createElement('script')
        script.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
        

        window.onYouTubeIframeAPIReady = function() {
            console.log("ready!")
            player = new window.YT.Player('player', {
                events: {
                    'onStateChange': onPlayerStateChange
                }
            });
        }

        function onPlayerStateChange() {
            console.log("my state changed")
        }

        function mute(event) {
            console.log(player);

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
        setUIBarIsOpen(prevIsOpen => !prevIsOpen)
    }

    function getVideoIDFromSelector(event) {
        setVideoIDFromSelector(event.target.value)
    }

    function toggleMuteButton() {
        setIsMuted(prevIsMuted => !prevIsMuted)
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
                    <button ref={muteButton} onClick={toggleMuteButton}>{isMuted ? "unmute" : "mute"}</button>
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