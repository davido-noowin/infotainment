import "./styles/MusicBar.css";
import SpotifyLogin from "./SpotifyLogin";
import SpotifyWebPlayback from "./SpotifyWebPlayback";
import hideMusicPlayer from "../assets/uiButtons/HideMusicPlayer.png";
import SpotifyUI from "./SpotifyUI";
import handleError from "../handleError";
import { useState, useEffect, createContext } from "react";

export const URIContext = createContext();

export default function MusicBar(props) {
  const [tokenObject, setToken] = useState({
    token: "",
    refreshToken: "",
    expiresIn: 0,
  });
  const [player, setPlayer] = useState(undefined);
  const [currentURI, setCurrentURI] = useState("");
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
          expiresIn: new Date().getTime() + json.expires_in * 1000,
        });
      } else {
        return Promise.reject(response);
      }
    }

    getToken();
  }, []);

  return (
    <>
      {tokenObject.token !== "" ? (
        <URIContext.Provider value={currentURI}>
          <SpotifyUI
            tokenInfo={tokenObject}
            player={player}
            toggleSpotifyUI={props.toggleSpotifyUI}
            spotifyUIIsOpen={props.spotifyUIIsOpen}
          />
        </URIContext.Provider>
      ) : null}

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
            setURI={setCurrentURI}
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
