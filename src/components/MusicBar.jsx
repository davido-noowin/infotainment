import "./styles/MusicBar.css";
import SpotifyLogin from "./SpotifyLogin";
import SpotifyWebPlayback from "./SpotifyWebPlayback";
import hideMusicPlayer from "../assets/uiButtons/HideMusicPlayer.png";
import handleError from "../handleError";
import { useState, useEffect } from "react";

export default function MusicBar(props) {
  const [tokenObject, setToken] = useState({
    token: "",
    refreshToken: "",
    expiresIn: 0,
  });
  console.log(tokenObject);

  useEffect(() => {
    async function getToken() {
      const response = await fetch("/auth/token").catch(handleError);
      if (response.ok) {
        const json = await response.json();
        // console.log(json);
        setToken({
          token: json.access_token,
          refreshToken: json.refresh_token,
          expiresIn: json.expires_in * 1000,
        });
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
      {tokenObject.token === "" ? (
        <SpotifyLogin />
      ) : (
        <SpotifyWebPlayback
          token={tokenObject.token}
          refreshToken={tokenObject.refreshToken}
          expiresIn={tokenObject.expiresIn}
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
