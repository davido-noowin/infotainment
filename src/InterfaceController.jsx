import DateTimeWeather from "./components/DateTimeWeather";
import UIBar from "./components/UIBar";
import MusicBar from "./components/MusicBar";
import SpotifyUI from "./components/SpotifyUI";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { useState, useEffect } from "react";
import handleError from "./handleError";

export default function InterfaceController() {
  const handle = useFullScreenHandle();
  const [uiBarIsOpen, setUIBarIsOpen] = useState(true);
  const [musicPlayerIsOpen, setMusicPlayer] = useState(true);
  const [token, setToken] = useState({
    token: "",
    refreshToken: "",
    expiresIn: 0
  });
  
    useEffect(() => {
      async function getToken() {
        const response = await fetch("/auth/token").catch(handleError);
        if (response.ok) {
          const json = await response.json();
          // console.log(json);
          setToken({
            token: json.access_token,
            refreshToken: json.refreshToken,
            expiresIn: json.expiresIn * 1000
          })
        } else {
          return Promise.reject(response);
        }
      }
  
      getToken();
    }, []);

  function toggleSideBar() {
    setUIBarIsOpen((prev) => !prev);
  }

  function toggleMusicPlayer(bool) {
    setMusicPlayer(bool);
  }

  return (
    <>
      <FullScreen handle={handle}>
        <DateTimeWeather />
        <MusicBar
          musicPlayerIsOpen={musicPlayerIsOpen}
          sideBarOpen={uiBarIsOpen}
          toggleMusicPlayer={toggleMusicPlayer}
          tokenObject={token}
        />
        <SpotifyUI 
          tokenObject={token}  
        />
        <UIBar
          handleFullscreen={handle}
          sideBarOpen={uiBarIsOpen}
          handleSideBarChange={toggleSideBar}
          toggleMusicPlayer={toggleMusicPlayer}
        />
      </FullScreen>
    </>
  );
}
