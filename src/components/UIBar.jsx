import { useState } from "react"
import "./UIBar.css"
import hamburgerButton from "../assets/uiButtons/hamburgerButton.png"
import closeUIButton from "../assets/uiButtons/closeUIButton.png"

export default function UIBar() {
    const [uiBarIsOpen, setUIBarIsOpen] = useState(true)

    function toggleUIMenu() {
        setUIBarIsOpen(prevIsOpen => !prevIsOpen)
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
                    <div className="video-selector">
                        <select name="video">
                            <option value="" disabled>--Please choose a video--</option>
                            <option value="0">Rainy Day New York Cafe</option>
                            <option value="1">River Stream</option>
                            <option value="2">By the Fireplace</option>
                            <option value="3">Minecraft Rainy Campfire</option>
                            <option value="4">Winter Cabin</option>
                            <option value="5">New York Stroll</option>
                            <option value="6">Swiss Rain</option>
                            <option value="7">Beach Sunrise</option>
                            <option value="8">Minecraft Forest Stream</option>
                        </select>
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
            
        </>
         
    )
}