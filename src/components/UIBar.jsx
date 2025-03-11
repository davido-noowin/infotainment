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