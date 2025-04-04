import "./styles/SpotifyUIMyPlaylists.css"
import playlists from "../assets/tempPlaylists"

export default function SpotifyUIMyPlaylists(props) {
    const myPlaylists = playlists.items.map((playlistObject) => {
        return (
            <button className="playlist-object">
                <img className="playlist-image" src={playlistObject.images[0].url} />
                <p className="playlist-title">{playlistObject.name}</p>
            </button>
        )
    })

    return (
        <div className="my-playlists-container">
            {myPlaylists}
        </div>
    )
}