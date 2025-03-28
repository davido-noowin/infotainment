import "./styles/MusicBar.css";
import SpotifyLogin from "./SpotifyLogin";
import SpotifyWebPlayback from "./SpotifyWebPlayback";
import hideMusicPlayer from "../assets/uiButtons/HideMusicPlayer.png";
import handleError from "../handleError";
import { useState, useEffect } from "react";

export default function MusicBar(props) {
  const [token, setToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [expiresIn, setExpiresIn] = useState(0);

  useEffect(() => {
    async function getToken() {
      const response = await fetch("/auth/token").catch(handleError);
      if (response.ok) {
        const json = await response.json();
        // console.log(json);
        setToken(json.access_token);
        setRefreshToken(json.refresh_token);
        setExpiresIn(json.expires_in * 1000);
      } else {
        return Promise.reject(response);
      }
    }

    getToken();
  }, []);

  return (
    <div
      className={`music-bar-container ${props.sideBarOpen ? "ui-open" : ""} ${
        !props.musicPlayerIsOpen ? "hide-player" : "open-player"
      }`}
    >
      {token === "" ? (
        <SpotifyLogin />
      ) : (
        <SpotifyWebPlayback
          token={token}
          refreshToken={refreshToken}
          expiresIn={expiresIn}
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
