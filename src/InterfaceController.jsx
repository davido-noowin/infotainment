import DateTimeWeather from "./components/DateTimeWeather";
import UIBar from "./components/UIBar";
import MusicBar from "./components/MusicBar";
import SpotifyUI from "./components/SpotifyUI";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { useState } from "react";

export default function InterfaceController() {
  const handle = useFullScreenHandle();
  const [uiBarIsOpen, setUIBarIsOpen] = useState(true);
  const [musicPlayerIsOpen, setMusicPlayer] = useState(true);

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
        />
        <SpotifyUI />
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
