import "./styles/SpotifyUI.css";
import closeUIButton from "../assets/uiButtons/closeUIButton.png";
import search from "../assets/uiButtons/Search.png";
import SpotifyUIHome from "./SpotifyUIHome";
import SpotifyUIMyPlaylists from "./SpotifyUIMyPlaylists";
import SpotifyUISearch from "./SpotifyUISearch";
import handleError from "../handleError";
import { useState, useEffect, useCallback } from "react";

const playlistInfo = [
  {
    images: [{ url: null }],
    name: "",
    id: "",
  },
];

async function fetchPlaylists(token) {
  try {
    const response = await fetch(
      "https://api.spotify.com/v1/me/player/recently-played?limit=50",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const json = await response.json();
    // console.log(json.items)
    const filteredPlaylists = new Set();
    json.items
      .filter((track) => track.context)
      .forEach((track) => {
        if (track.context.type === "playlist") {
          filteredPlaylists.add(track.context.uri.split(":")[2]);
        }
      });
    return Array.from(filteredPlaylists);
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function fetchPlaylistDetails(token, id) {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${id}?fields=name%2Cimages%28url%29%2C+id`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const json = await response.json();
    return json;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export default function SpotifyUI(props) {
  const [activeScreen, setActiveScreen] = useState("home");
  const [playlistsToDisplay, setPlaylistsToDisplay] = useState(playlistInfo);
  const [displayName, setDisplayName] = useState("");
  const [searchResults, setSearchResults] = useState(undefined);

  const loadSpotify = useCallback(() => {
    async function getUser() {
      const response = await fetch("https://api.spotify.com/v1/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${props.tokenInfo.token}`,
          "Content-Type": "application/json",
        },
      }).catch(handleError);
      if (response.ok) {
        const json = await response.json();
        // console.log(json);
        setDisplayName(json.display_name);
      }
    }

    async function aggregrateTracks(token) {
      const results = [];
      fetchPlaylists(token).then((data) => {
        data.forEach((track) => {
          fetchPlaylistDetails(token, track).then((data) => results.push(data));
        });
      });
      // console.log(results);
      setPlaylistsToDisplay(results);
    }

    aggregrateTracks(props.tokenInfo.token);
    getUser();
  }, [props.tokenInfo.token]);

  useEffect(() => {
    loadSpotify();
  }, [loadSpotify]);

  function navigateScreens(screen) {
    setActiveScreen(screen);
  }

  async function searchSong(formData) {
    navigateScreens("searching");
    const query = formData.get("query");
    // console.log("you searched for", query);
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${query}&type=track%2Calbum%2Cplaylist&market=us&limit=8`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${props.tokenInfo.token}`,
          "Content-Type": "application/json",
        },
      }
    ).catch(handleError);
    if (response.ok) {
      const json = await response.json();
      // console.log(json);
      setSearchResults(json);
    }
  }

  return (
    <div className={`${props.spotifyUIIsOpen ? "" : "hide-spotify-ui"}`}>
      <div
        className={`${props.tokenInfo.token !== "" ? "shadow-spotify-bg" : ""}`}
      ></div>
      <div className="spotify-ui-container">
        <header className="spotify-ui-header">
          <button
            className="close-spotify-btn"
            onClick={() => props.toggleSpotifyUI(false)}
          >
            <img src={closeUIButton} />
          </button>
          <form action={searchSong} className="song-search" autoComplete="off">
            <button type="submit">
              <img src={search} alt="search" />
            </button>
            <input
              name="query"
              id="search-field"
              type="search"
              placeholder="I want to listen to..."
            />
          </form>
          <div className="header-bar"></div>
          <div className="header-titles">
            <button
              className={`spotify-title-btn ${
                activeScreen === "home" ? "active-title" : ""
              }`}
              onClick={() => {
                navigateScreens("home");
              }}
            >
              Home
            </button>
            <button
              className={`spotify-title-btn ${
                activeScreen === "my playlists" ? "active-title" : ""
              }`}
              onClick={() => {
                navigateScreens("my playlists");
              }}
            >
              My Playlists
            </button>
          </div>
        </header>
        {(() => {
          if (activeScreen === "home") {
            return (
              <SpotifyUIHome
                player={props.player}
                tokenInfo={props.tokenInfo}
                playlistsToDisplay={playlistsToDisplay.slice(0, 6)}
                displayName={displayName}
              />
            );
          } else if (activeScreen === "my playlists") {
            return (
              <SpotifyUIMyPlaylists
                player={props.player}
                tokenInfo={props.tokenInfo}
              />
            );
          } else if (activeScreen === "searching") {
            return (
              <SpotifyUISearch
                player={props.player}
                tokenInfo={props.tokenInfo}
                searchResults={searchResults}
              />
            );
          } else {
            return null;
          }
        })()}
      </div>
    </div>
  );
}
