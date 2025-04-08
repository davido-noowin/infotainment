import DateTimeWeather from "./components/DateTimeWeather";
import UIBar from "./components/UIBar";
import MusicBar from "./components/MusicBar";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { useState } from "react";

export default function InterfaceController() {
  const handle = useFullScreenHandle();
  const [uiBarIsOpen, setUIBarIsOpen] = useState(true);
  const [musicPlayerIsOpen, setMusicPlayer] = useState(true);
  const [spotifyUIIsOpen, setSpotifyUI] = useState(false);
  const [zipcode, setZipcode] = useState(null);

  function toggleSideBar() {
    setUIBarIsOpen((prev) => !prev);
  }

  function toggleMusicPlayer(bool) {
    setMusicPlayer(bool);
  }

  function toggleSpotifyUI(bool) {
    setSpotifyUI(bool);
  }

  return (
    <>
      <FullScreen handle={handle}>
        <DateTimeWeather zipcode={zipcode}/>
        <MusicBar
          musicPlayerIsOpen={musicPlayerIsOpen}
          sideBarOpen={uiBarIsOpen}
          spotifyUIIsOpen={spotifyUIIsOpen}
          toggleMusicPlayer={toggleMusicPlayer}
          toggleSpotifyUI={toggleSpotifyUI}
        />
        <UIBar
          handleFullscreen={handle}
          sideBarOpen={uiBarIsOpen}
          handleSideBarChange={toggleSideBar}
          toggleMusicPlayer={toggleMusicPlayer}
          toggleSpotifyUI={toggleSpotifyUI}
          setZipcode={setZipcode}
        />
      </FullScreen>
    </>
  );
}
