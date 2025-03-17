import "./styles/VolumeSlider.css";
import volume from "../assets/uiButtons/Volume.png"
import noVolume from "../assets/uiButtons/NoVolume.png"

export default function VolumeSlider(props) {
  return (
    <div className="sound-button-and-slider-container">
      <button ref={props.refs.muteButton} onClick={props.handleClick}>
        <img src={props.isMuted ? noVolume : volume} />
      </button>
      <div className="slide-container">
        <input
          ref={props.refs.slider}
          id="volume"
          type="range"
          min="0"
          max="100"
          value={props.value}
          onChange={props.handleChange}
        />
      </div>
    </div>
  );
}
