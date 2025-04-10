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
import { PlayerStateContext } from "./MusicBar";
import { useState, useEffect, useContext } from "react";

function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

const queryString =
  "?market=us&fields=images%2C+name%2Cowner%28display_name%29%2Ctracks%28next%2C+offset%2Climit%2Cprevious%2C+total%2Citems%28track%28album%28images%2Cname%29%2Cartists%28name%29%2C+duration_ms%2Cname%2Curi%2Cis_playable%29%29%29";
const track = {
  images: [{ url: null }],
  name: "",
  owner: { display_name: "" },
  tracks: {
    limit: 100,
    next: null,
    offset: 0,
    previous: null,
    total: 0,
    items: [
      {
        track: {
          album: {
            images: [{ url: null }],
            name: "",
          },
          artists: [{ name: "" }],
          duration_ms: 0,
          is_playable: true,
          name: "",
          uri: "",
        },
      },
    ],
  },
};

export default function SpotifyUIPlaylist(props) {
  const [playlist, setPlaylistItems] = useState(track);
  const [album, setAlbum] = useState(null);
  const [trackItems, setTrackItems] = useState([]);
  const playerState = useContext(PlayerStateContext);

  useEffect(() => {
    async function loadPlaylistOrAlbum(playlistURI) {
      var fetchString;
      if (props.type === "playlist") {
        fetchString = `https://api.spotify.com/v1/playlists/${playlistURI}${queryString}`;
      } else if (props.type === "album") {
        fetchString = `https://api.spotify.com/v1/albums/${playlistURI}?market=us`;
      } else {
        return;
      }

      const response = await fetch(fetchString, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${props.tokenInfo.token}`,
          "Content-Type": "application/json",
        },
      }).catch(handleError);
      if (response.ok) {
        const json = await response.json();
        // console.log(json);
        props.type === "playlist" ? setPlaylistItems(json) : setAlbum(json);
        selectTracks(json.tracks.items);
      }
    }

    loadPlaylistOrAlbum(props.playlistID);
  }, []);

  function closePlaylist() {
    props.closePlaylist((prev) => !prev);
  }

  function togglePlay() {
    props.player.togglePlay();
  }

  function selectTracks(trackItemsList) {
    var playlistItems;
    if (props.type === "album") {
      playlistItems = trackItemsList.map((song) => {
        return { track: song}
      })
    }
    else {
      playlistItems = trackItemsList;
    }
    setTrackItems(playlistItems);
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
      `https://api.spotify.com/v1/me/player/shuffle?state=${!playerState.shuffle}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${props.tokenInfo.token}`,
          "Content-Type": "application/json",
        },
      }
    ).catch(handleError);
  }
  
  let playlistItems;
  if (trackItems) {
    playlistItems = trackItems.map((song, index) => {
      return (
        <li
          key={index}
          className={`playlist-song-obj ${
            playerState.uri === song.track.uri ? "active-song" : ""
          }`}
        >
          <button
            className={!song.track.is_playable ? "disabled" : ""}
            onClick={() => {
              playSong(props.playlistID, index);
            }}
          >
            <div className="playlist-song-obj-group">
              <span className="playlist-song-number">
                {playerState.uri === song.track.uri ? (
                  <img className="active-song-speaker" src={volume} />
                ) : (
                  index + 1
                )}
              </span>
              <img
                className="playlist-song-img"
                draggable="false"
                src={props.type === "playlist" ? song.track.album.images[0].url : album.images[0].url}
                alt={props.type === "playlist" ? song.track.album.name : album.name}
              />
              <span
                className={`playlist-song-details track-name ${
                  playerState.uri === song.track.uri ? "active-song-details" : ""
                }`}
              >
                {song.track.name}
              </span>
              <span
                className={`playlist-song-details artist-name ${
                  playerState.uri === song.track.uri ? "active-song-details" : ""
                }`}
              >
                {song.track.artists[0].name}
              </span>
              <span
                className={`playlist-song-details album-name ${
                  playerState.uri === song.track.uri ? "active-song-details" : ""
                }`}
              >
                {props.type === "playlist" ? song.track.album.name : album.name}
              </span>
              <span
                className={`playlist-song-details time-name ${
                  playerState.uri === song.track.uri ? "active-song-details" : ""
                }`}
              >
                {millisToMinutesAndSeconds(song.track.duration_ms)}
              </span>
            </div>
          </button>
        </li>
      );
    });
  }

  return (
    <div className="spotify-playlist-container">
      <button className="close-playlist-btn" onClick={closePlaylist}>
        <img src={backArrow} alt="go back" />
      </button>
      <div className="main-container">
        <div className="playlist-title-section">
          <img
            className="playlist-img-cover"
            src={album !== null ? album.images[0].url : playlist.images[0].url}
            alt={album !== null ? album.name : playlist.name}
          />
          <div className="playlist-title-and-creator">
            <h1>{album !== null ? album.name : playlist.name}</h1>
            <p>
              {album !== null
                ? album.artists[0].name
                : playlist.owner.display_name}
            </p>
          </div>
        </div>
        <div className="playlist-btn-group">
          <div className="song-control-btn-group">
            <button className="song-control-btn" onClick={togglePlay}>
              <img src={playerState.paused ? play : pause} />
            </button>
            <button className="song-control-btn" onClick={toggleShuffle}>
              <img src={playerState.shuffle ? shuffle : disableShuffle} />
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
        <ul className="playlist-songs">
          {playlistItems}
        </ul>
      </div>
    </div>
  );
}
