import "./styles/SpotifyUI.css"
import closeUIButton from "../assets/uiButtons/closeUIButton.png";

export default function SpotifyUI() {
    return (
        <>
            <div className="spotify-ui-container">
                <button>
                    <img src={closeUIButton} />
                </button>
                it works
            </div>
        </>
    )
}