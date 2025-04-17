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
import { PlayerStateContext } from "./PlayerStateContext";
import { useState, useEffect, useContext, useCallback } from "react";

function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

const queryString =
  "?market=us&fields=images%2C+name%2Cowner%28display_name%29%2Ctracks%28next%2C+offset%2Climit%2Cprevious%2C+total%2Citems%28is_local%2Ctrack%28album%28images%2Cname%29%2Cartists%28name%29%2C+duration_ms%2Cname%2Curi%2Cis_playable%29%29%29";
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
        is_local: false,
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
  const [totalTracks, setTotalTracks] = useState(0);
  const [pageLimit, setPageLimit] = useState(100);
  const [offset, setOffset] = useState(0);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [page, setPage] = useState(1);
  const playerState = useContext(PlayerStateContext);

  const selectTracks = useCallback((trackItemsList) => {
    var playlistItems;
    if (props.type === "album") {
      playlistItems = trackItemsList.map((song) => {
        return { track: song };
      });
    } else {
      playlistItems = trackItemsList;
    }
    setTrackItems(playlistItems);
  }, [props.type])

  const loadPlaylistPage = useCallback(() => {
    async function loadPlaylistOrAlbum(playlistURI) {
      var fetchString;
      if (props.type === "playlist") {
        fetchString = `https://api.spotify.com/v1/playlists/${playlistURI}${queryString}`;
        setPageLimit(100);
      } else if (props.type === "album") {
        fetchString = `https://api.spotify.com/v1/albums/${playlistURI}?market=us`;
        setPageLimit(50);
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
        setTotalTracks(json.tracks.total);
        setNextPage(json.tracks.next);
        setPreviousPage(json.tracks.prev);
        selectTracks(json.tracks.items);
      }
    }

    loadPlaylistOrAlbum(props.playlistID);
  }, [props.playlistID, props.tokenInfo.token, props.type, selectTracks]);

  useEffect(()=> {
    loadPlaylistPage()
  }, [loadPlaylistPage]);

  function closePlaylist() {
    props.closePlaylist((prev) => !prev);
  }

  function togglePlay() {
    props.player.togglePlay();
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

  async function fetchTrackContent(fetchString) {
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
      setNextPage(json.next);
      setPreviousPage(json.previous);
      selectTracks(json.items);
    }
  }

  async function getNextPage() {
    setOffset((prev) => prev + pageLimit);
    setPage((prev) => prev + 1);
    const playlistOrAlbum =
      props.type === "playlist"
        ? `https://api.spotify.com/v1/playlists/${props.playlistID}`
        : `https://api.spotify.com/v1/albums/${album.id}`;
    const urlWithQuery =
      playlistOrAlbum +
      `/tracks?market=us&limit=${pageLimit}&offset=${offset + pageLimit}`;
    fetchTrackContent(urlWithQuery);
  }

  async function getPreviousPage() {
    setOffset((prev) => prev - pageLimit);
    setPage((prev) => prev - 1);
    const playlistOrAlbum =
      props.type === "playlist"
        ? `https://api.spotify.com/v1/playlists/${props.playlistID}`
        : `https://api.spotify.com/v1/albums/${album.id}`;
    const urlWithQuery =
      playlistOrAlbum +
      `/tracks?market=us&limit=${pageLimit}&offset=${offset - pageLimit}`;
    fetchTrackContent(urlWithQuery);
  }

  let playlistItems;
  if (trackItems) {
    playlistItems = trackItems
      .filter((elem) => !elem.is_local)
      .map((song, index) => {
      return (
        <li
          key={index + offset}
          className={`playlist-song-obj ${
            playerState.uri === song.track.uri ? "active-song" : ""
          }`}
        >
          <button
            className={!song.track.is_playable ? "disabled" : ""}
            onClick={() => {
              playSong(props.playlistID, index + offset);
            }}
          >
            <div className="playlist-song-obj-group">
              <span className="playlist-song-number">
                {playerState.uri === song.track.uri ? (
                  <img className="active-song-speaker" src={volume} />
                ) : (
                  index + 1 + offset
                )}
              </span>
              <img
                className="playlist-song-img"
                draggable="false"
                src={
                  props.type === "playlist"
                    ? song.track.album.images[0].url
                    : album.images[0].url
                }
                alt={
                  props.type === "playlist" ? song.track.album.name : album.name
                }
              />
              <span
                className={`playlist-song-details track-name ${
                  playerState.uri === song.track.uri
                    ? "active-song-details"
                    : ""
                }`}
              >
                {song.track.name}
              </span>
              <span
                className={`playlist-song-details artist-name ${
                  playerState.uri === song.track.uri
                    ? "active-song-details"
                    : ""
                }`}
              >
                {song.track.artists[0].name}
              </span>
              <span
                className={`playlist-song-details album-name ${
                  playerState.uri === song.track.uri
                    ? "active-song-details"
                    : ""
                }`}
              >
                {props.type === "playlist" ? song.track.album.name : album.name}
              </span>
              <span
                className={`playlist-song-details time-name ${
                  playerState.uri === song.track.uri
                    ? "active-song-details"
                    : ""
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
            <span className="track-count">{totalTracks} Songs</span>
          </div>
          {totalTracks > pageLimit && (
            <div className="pagination-btn-group">
              <button
                className={`pagination-btn ${
                  previousPage ? "" : "hide-pagination-btn"
                }`}
                onClick={getPreviousPage}
              >
                <img src={leftArrow} />
              </button>
              <p className="pagination-page">{page}</p>
              <button
                className={`pagination-btn ${
                  nextPage ? "" : "hide-pagination-btn"
                }`}
                onClick={getNextPage}
              >
                <img src={rightArrow} />
              </button>
            </div>
          )}
        </div>
        <div className="playlist-label-group">
          <p className="playlist-label song-label">Song</p>
          <p className="playlist-label artist-label">Artist</p>
          <p className="playlist-label album-label">Album</p>
          <p className="playlist-label time-label">Time</p>
        </div>
        <div className="playlist-label-linebreak"></div>
        <ul className="playlist-songs">{playlistItems}</ul>
        {totalTracks > pageLimit && (
          <div className="pagination-bottom-screen">
            <div className="pagination-btn-group">
              <button
                className={`pagination-btn ${
                  previousPage ? "" : "hide-pagination-btn"
                }`}
                onClick={getPreviousPage}
              >
                <img src={leftArrow} />
              </button>
              <p className="pagination-page">{page}</p>
              <button
                className={`pagination-btn ${
                  nextPage ? "" : "hide-pagination-btn"
                }`}
                onClick={getNextPage}
              >
                <img src={rightArrow} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
