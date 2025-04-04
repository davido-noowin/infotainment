import "./styles/SpotifyUIMyPlaylists.css"
import SpotifyUIPlaylist from "./SpotifyUIPlaylist"
import playlists from "../assets/tempPlaylists"
import { useState } from "react"

export default function SpotifyUIMyPlaylists(props) {
    const [playlistScreen, setPlaylistScreen] = useState(false);
    const [playlistID, setPlaylistID] = useState("");

    function selectPlaylist(id) {
        setPlaylistScreen((prev) => !prev);
        setPlaylistID(id);
    }

    const myPlaylists = playlists.items.map((playlistObject) => {
        return (
            <button key={playlistObject.id} className="playlist-object" onClick={() => {
                selectPlaylist(playlistObject.id);
            }}>
                <img className="playlist-image" draggable="false" src={playlistObject.images[0].url} />
                <p className="playlist-title">{playlistObject.name}</p>
            </button>
        )
    })

    return (
        <div>
            {playlistScreen ? 
                <SpotifyUIPlaylist 
                    type="playlist"
                    tokenInfo={props.tokenInfo}
                    player={props.player}
                    playlistID={playlistID}
                    closePlaylist={setPlaylistScreen}
                /> 
                : 
                <div className="my-playlists-container">
                    {myPlaylists}
                </div>
            }
        </div>
    )
}