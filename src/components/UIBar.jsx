import { useState, useEffect, useRef } from "react"
import "./styles/UIBar.css"
import VideoSelect from "./VideoSelect"
import Canvas from "./Canvas"
import VolumeSlider from "./VolumeSlider"
import hamburgerButton from "../assets/uiButtons/hamburgerButton.png"
import closeUIButton from "../assets/uiButtons/closeUIButton.png"


export default function UIBar() {
    const [uiBarIsOpen, setUIBarIsOpen] = useState(true);
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
    }, [uiBarIsOpen]);
    

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
                        <div className="button-array">
                            <button onClick={toggleUIMenu}>
                                <img src={closeUIButton}/>
                            </button>
                            <button>
                                
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
                        <button onClick={toggleUIMenu}>
                            <img src={hamburgerButton}/>
                        </button>
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