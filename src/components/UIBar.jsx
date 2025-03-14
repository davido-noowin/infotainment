import { useState } from "react"
import "./UIBar.css"
import VideoSelect from "./VideoSelect"
import Canvas from "./Canvas"
import hamburgerButton from "../assets/uiButtons/hamburgerButton.png"
import closeUIButton from "../assets/uiButtons/closeUIButton.png"

export default function UIBar() {
    const [uiBarIsOpen, setUIBarIsOpen] = useState(true)
    const [videoIDFromSelector, setVideoIDFromSelector] = useState("LRmNqKw6Ly0")

    function toggleUIMenu() {
        setUIBarIsOpen(prevIsOpen => !prevIsOpen)
    }

    function getVideoIDFromSelector(event) {
        setVideoIDFromSelector(event.target.value)
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
            <Canvas videoID={videoIDFromSelector} />
        </>
         
    )
}