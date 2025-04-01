import "./styles/MusicBar.css";
import SpotifyLogin from "./SpotifyLogin";
import SpotifyWebPlayback from "./SpotifyWebPlayback";
import hideMusicPlayer from "../assets/uiButtons/HideMusicPlayer.png";

export default function MusicBar(props) {
  return (
    <div
      className={`music-bar-container ${props.sideBarOpen ? "ui-open" : ""} ${
        !props.musicPlayerIsOpen ? "hide-player" : "open-player"
      }`}
    >
      {props.tokenObject.token === "" ? (
        <SpotifyLogin />
      ) : (
        <SpotifyWebPlayback
          token={props.tokenObject.token}
          refreshToken={props.tokenObject.refreshToken}
          expiresIn={props.tokenObject.expiresIn}
        />
      )}
      <button
        onClick={() => props.toggleMusicPlayer(false)}
        className="close-player-btn"
      >
        <img src={hideMusicPlayer} alt="close music player" />
      </button>
    </div>
  );
}
