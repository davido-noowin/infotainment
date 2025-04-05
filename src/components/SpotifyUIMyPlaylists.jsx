import "./styles/SpotifyUIMyPlaylists.css"
import SpotifyUIPlaylist from "./SpotifyUIPlaylist"
import handleError from "../handleError";
import { useState, useEffect } from "react"

const userPlaylists = {
    items: [{
        id: "",
        images: [{ url: null }],
        name: ""
    }]
}

export default function SpotifyUIMyPlaylists(props) {
    const [playlistScreen, setPlaylistScreen] = useState(false);
    const [playlistID, setPlaylistID] = useState("");
    const [playlists, setPlaylists] = useState(userPlaylists);

    useEffect(()=>{
        async function getUserPlaylists() {
            const response = await fetch(`https://api.spotify.com/v1/me/playlists?limit=50`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${props.tokenInfo.token}`,
                    "Content-Type": "application/json",
                }
            }).catch(handleError);
            if (response.ok) {
                const json = await response.json();
                // console.log(json);
                setPlaylists(json);
            }
        }
        getUserPlaylists();
    }, [])

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