import backArrow from "../assets/uiButtons/goBack.png";
import pause from "../assets/uiButtons/pause.png";
import play from "../assets/uiButtons/play.png";
import shuffle from "../assets/uiButtons/Shuffle.png";
import disableShuffle from "../assets/uiButtons/DisableShuffle.png";
import leftArrow from "../assets/uiButtons/ArrowLeft.png";
import rightArrow from "../assets/uiButtons/ArrowRight.png";
import volume from "../assets/uiButtons/Volume.png";
import "./styles/SpotifyUIPlaylist.css";
import handleError from "../handleError";
import { useState, useEffect } from "react";

function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

const queryString =
  "?market=us&fields=name%2Cowner%28display_name%29%2Cimages%2Ctracks.items%28track%28name%2C+artists%2C+album%28images%2C+name%29%2C+duration_ms%2Curi%29";
const track = {
  images: [{ url: null }],
  name: "",
  owner: { display_name: "" },
  tracks: {
    items: [
      {
        track: {
          album: {
            images: [{ url: null }],
            name: "",
          },
          artists: [{ name: "" }],
          duration_ms: 0,
          name: "",
          uri: "",
        },
      },
    ],
  },
};

export default function SpotifyUIPlaylist(props) {
  const [isShuffled, setShuffle] = useState(false);
  const [isPaused, setPaused] = useState(false);
  const [playlist, setPlaylistItems] = useState(track);
  const [currentURI, setCurrentURI] = useState("");

  useEffect(() => {
    props.player.getCurrentState().then((res) => {
      setShuffle(res.shuffle);
      setPaused(res.paused);
    });

    props.player.addListener("player_state_changed", (state) => {
      if (!state) {
        return;
      }
      console.log(state.track_window.current_track.uri);
      setCurrentURI(state.track_window.current_track.uri);
    });

    async function loadPlaylist(playlistURI) {
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistURI}${queryString}`,
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
        setPlaylistItems(json);
      }
    }
    loadPlaylist(props.playlistID);
  }, []);

  function closePlaylist() {
    props.closePlaylist((prev) => !prev);
  }

  function togglePlay() {
    props.player.togglePlay();
    setPaused((prev) => !prev);
  }

  async function playSong(URI, index) {
    await fetch(`https://api.spotify.com/v1/me/player/play`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${props.tokenInfo.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        context_uri: `spotify:${props.type}:${URI}`,
        offset: {
          position: index,
        },
        position_ms: 0,
      }),
    }).catch(handleError);
  }

  async function toggleShuffle() {
    await fetch(
      `https://api.spotify.com/v1/me/player/shuffle?state=${!isShuffled}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${props.tokenInfo.token}`,
          "Content-Type": "application/json",
        },
      }
    ).catch(handleError);
    setShuffle((prev) => !prev);
  }

  const playlistItems = playlist.tracks.items.map((song, index) => {
    return (
      <li
        key={index}
        className={`playlist-song-obj ${
          currentURI === song.track.uri ? "active-song" : ""
        }`}
      >
        <button
          onClick={() => {
            playSong(props.playlistID, index);
          }}
        >
          <div className="playlist-song-obj-group">
            <span className="playlist-song-number">
              {currentURI === song.track.uri ? <img className="active-song-speaker" src={volume} /> : index + 1}
            </span>
            <img
              className="playlist-song-img"
              draggable="false"
              src={song.track.album.images[0].url}
              alt={song.track.album.name}
            />
            <span
              className={`playlist-song-details track-name ${
                currentURI === song.track.uri ? "active-song-details" : ""
              }`}
            >
              {song.track.name}
            </span>
            <span
              className={`playlist-song-details artist-name ${
                currentURI === song.track.uri ? "active-song-details" : ""
              }`}
            >
              {song.track.artists[0].name}
            </span>
            <span
              className={`playlist-song-details album-name ${
                currentURI === song.track.uri ? "active-song-details" : ""
              }`}
            >
              {song.track.album.name}
            </span>
            <span
              className={`playlist-song-details time-name ${
                currentURI === song.track.uri ? "active-song-details" : ""
              }`}
            >
              {millisToMinutesAndSeconds(song.track.duration_ms)}
            </span>
          </div>
        </button>
      </li>
    );
  });

  return (
    <div className="spotify-playlist-container">
      <button className="close-playlist-btn" onClick={closePlaylist}>
        <img src={backArrow} alt="go back" />
      </button>
      <div className="main-container">
        <div className="playlist-title-section">
          <img
            className="playlist-img-cover"
            src={playlist.images[0].url}
            alt={playlist.name}
          />
          <div className="playlist-title-and-creator">
            <h1>{playlist.name}</h1>
            <p>{playlist.owner.display_name}</p>
          </div>
        </div>
        <div className="playlist-btn-group">
          <div className="song-control-btn-group">
            <button className="song-control-btn" onClick={togglePlay}>
              <img src={isPaused ? play : pause} />
            </button>
            <button className="song-control-btn" onClick={toggleShuffle}>
              <img src={isShuffled ? shuffle : disableShuffle} />
            </button>
          </div>
          <div className="pagination-btn-group">
            <button className="pagination-btn">
              <img src={leftArrow} />
            </button>
            <p className="pagination-page">1</p>
            <button className="pagination-btn">
              <img src={rightArrow} />
            </button>
          </div>
        </div>
        <div className="playlist-label-group">
          <p className="playlist-label song-label">Song</p>
          <p className="playlist-label artist-label">Artist</p>
          <p className="playlist-label album-label">Album</p>
          <p className="playlist-label time-label">Time</p>
        </div>
        <div className="playlist-label-linebreak"></div>
        <ul className="playlist-songs">{playlistItems}</ul>
      </div>
    </div>
  );
}
