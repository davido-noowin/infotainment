import { millisToMinutesAndSeconds } from "./SpotifyUIPlaylist";
import SpotifyUIPlaylist from "./SpotifyUIPlaylist";
import "./styles/SpotifyUISearch.css"

export default function SpotifyUISearch(props) {
    const tracks = props.searchResults.tracks;
    const albums = props.searchResults.albums;
    const playlists = props.searchResults.playlists;

    const searchTracks = tracks.items.map((track) => {
        return (
            <button key={track.id} className="search-track-btn">
                <div className="track-song-info">
                    <img className="track-cover" draggable="false" src={track.album.images[0].url} alt={track.album.name} />
                    <div className="song-and-artist">
                        <h3>{track.name}</h3>
                        <p>{track.artists[0].name}</p>
                    </div>
                </div>
                <span>{millisToMinutesAndSeconds(track.duration_ms)}</span>
            </button>
        )
    })

    const searchAlbums = albums.items.map((album) => {
        return (
            <button key={album.id} className="search-album-btn">
                <img draggable="false" src={album.images[0].url} alt={album.name} />
                <div className="album-name-and-artist">
                    <h3>{album.name}</h3>
                    <p>{album.artists[0].name} - {album.release_date.split("-"[0])}</p>
                </div>
            </button>
        )
    })

    return (
        <div className="search-container">
            <div className="song-search-container">
                <h1 className="search-labels">Songs</h1>
                {searchTracks}
            </div>
            <div className="album-search-container">
                <h1 className="search-labels">Albums</h1>
                {searchAlbums}
            </div>
            <div className="playlist-search-container">
                <h1 className="search-labels">Playlists</h1>
            </div>
        </div>
    )
}