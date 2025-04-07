import SpotifyUIPlaylist from "./SpotifyUIPlaylist";
import "./styles/SpotifyUIHome.css"
import { useState } from "react"

export default function SpotifyUIHome(props) {
    const [playlistScreen, setPlaylistScreen] = useState(false);
    const [playlistID, setPlaylistID] = useState("")

    function selectPlaylist(id) {
        setPlaylistScreen((prev) => !prev);
        setPlaylistID(id);
    }

    const availablePlaylists = props.playlistsToDisplay.map((playlist) => {
        return (
            <button key={playlist.id} className="home-playlist-btn" onClick={() => {selectPlaylist(playlist.id)}}>
                <img className="home-playlist-img" draggable="false" src={playlist.images[0].url} alt={playlist.name} />
                <p>{playlist.name}</p>
            </button>
        )
    })

    return (
        <div className="spotify-home-container">
            {!playlistScreen && <div className="home-header">
                <h1 className="spotify-home-welcome">Hello, {props.displayName.split(" ")[0]}</h1>
            </div>}
            <div>
                {
                    playlistScreen ?
                    <SpotifyUIPlaylist 
                        type="playlist"
                        tokenInfo={props.tokenInfo}
                        player={props.player}
                        playlistID={playlistID}
                        closePlaylist={setPlaylistScreen}
                    />
                    :
                    <div className="prev-tracks">
                        {availablePlaylists}
                    </div>
                }
            </div>
        </div>
    )
}