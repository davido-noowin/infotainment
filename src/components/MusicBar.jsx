import "./styles/MusicBar.css";
import SpotifyLogin from "./SpotifyLogin";
import SpotifyWebPlayback from "./SpotifyWebPlayback";
import hideMusicPlayer from "../assets/uiButtons/HideMusicPlayer.png";
import SpotifyUI from "./SpotifyUI";
import handleError from "../handleError";
import { useState, useEffect } from "react";

export default function MusicBar(props) {
  const [tokenObject, setToken] = useState({
    token: "",
    refreshToken: "",
    expiresIn: 0,
  });
  const [player, setPlayer] = useState(undefined);
  // console.log("IN MUSIC PLAYER", tokenObject);

  useEffect(() => {
    async function getToken() {
      const response = await fetch("/auth/token").catch(handleError);
      if (response.ok) {
        const json = await response.json();
        // console.log(json);
        setToken({
          token: json.access_token,
          refreshToken: json.refresh_token,
          expiresIn: new Date().getTime() + (json.expires_in * 1000),
        });
      } else {
        return Promise.reject(response);
      }
    }

    getToken();
  }, []);

  return (
    <>
      <SpotifyUI 
        tokenInfo={tokenObject}
        player={player}
      />

      <div
        className={`music-bar-container ${props.sideBarOpen ? "ui-open" : ""} ${
          !props.musicPlayerIsOpen ? "hide-player" : "open-player"
        }`}
      >
        {tokenObject.token === "" ? (
          <SpotifyLogin />
        ) : (
          <SpotifyWebPlayback
            tokenInfo={tokenObject}
            updateToken={setToken}
            player={player}
            updatePlayer={setPlayer}
          />
        )}
        <button
          onClick={() => props.toggleMusicPlayer(false)}
          className="close-player-btn"
        >
          <img src={hideMusicPlayer} alt="close music player" />
        </button>
      </div>
    </>
  );
}
