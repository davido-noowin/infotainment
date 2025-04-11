import SpotifyUIPlaylist from "./SpotifyUIPlaylist";
import "./styles/SpotifyUISearch.css";
import handleError from "../handleError";
import { PlayerStateContext } from "./PlayerStateContext";
import { useState, useContext } from "react";

function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

export default function SpotifyUISearch(props) {
  const [playlistScreen, setPlaylistScreen] = useState(false);
  const [playlistID, setPlaylistID] = useState("");
  const [playlistType, setPlaylistType] = useState("playlist");
  const playerState = useContext(PlayerStateContext);
  const tracks = props.searchResults.tracks;
  const albums = props.searchResults.albums;
  const playlists = props.searchResults.playlists;

  function selectPlaylist(id, type) {
    setPlaylistType(type);
    setPlaylistScreen((prev) => !prev);
    setPlaylistID(id);
  }

  async function playTrack(trackURI) {
    await fetch(`https://api.spotify.com/v1/me/player/play`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${props.tokenInfo.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uris: [trackURI],
      }),
    }).catch(handleError);
  }

  const searchTracks = tracks.items
    .filter((element) => element)
    .map((track) => {
      return (
        <button
          key={track.id}
          className={`search-track-btn ${
            playerState.uri === track.uri ? "active-song" : ""
          }`}
          onClick={() => playTrack(track.uri)}
        >
          <div className="track-song-info">
            <img
              className="track-cover"
              draggable="false"
              src={track.album.images[0].url}
              alt={track.album.name}
            />
            <div className="song-and-artist-search">
              <h3>
                {track.name}{" "}
                {track.explicit && <span className="explicit-tag">E</span>}
              </h3>
              <p>{track.artists[0].name}</p>
            </div>
          </div>
          <span>{millisToMinutesAndSeconds(track.duration_ms)}</span>
        </button>
      );
    });

  const searchAlbums = albums.items
    .filter((element) => element)
    .map((album) => {
      return (
        <button
          key={album.id}
          className="search-album-btn"
          onClick={() => {
            selectPlaylist(album.id, "album");
          }}
        >
          <img
            className="cover-img"
            draggable="false"
            src={album.images[0].url}
            alt={album.name}
          />
          <div className="album-name-and-artist">
            <h3>{album.name}</h3>
            <p>{album.artists[0].name}</p>
            <p>{album.release_date.split("-")[0]}</p>
          </div>
        </button>
      );
    });

  const searchPlaylists = playlists.items
    .filter((element) => element)
    .map((playlist) => {
      return (
        <button
          key={playlist.id}
          className="search-album-btn"
          onClick={() => {
            selectPlaylist(playlist.id, "playlist");
          }}
        >
          <img
            className="cover-img"
            draggable="false"
            src={playlist.images[0].url}
            alt={playlist.name}
          />
          <div className="album-name-and-artist">
            <h3>{playlist.name}</h3>
            <p>By {playlist.owner.display_name}</p>
          </div>
        </button>
      );
    });

  return (
    <div>
      {playlistScreen ? (
        <SpotifyUIPlaylist
          type={playlistType}
          tokenInfo={props.tokenInfo}
          player={props.player}
          playlistID={playlistID}
          closePlaylist={setPlaylistScreen}
        />
      ) : (
        <div className="search-container">
          <div className="song-search-container">
            <h1 className="search-labels">Songs</h1>
            {searchTracks}
          </div>
          <div className="album-search-container">
            <h1 className="search-labels">Albums</h1>
            <div className="search-selection">{searchAlbums}</div>
          </div>
          <div className="playlist-search-container">
            <h1 className="search-labels">Playlists</h1>
            <div className="search-selection">{searchPlaylists}</div>
          </div>
        </div>
      )}
    </div>
  );
}
