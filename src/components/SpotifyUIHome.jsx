import "./styles/SpotifyUIHome.css"

export default function SpotifyUIHome(props) {
    const availablePlaylists = props.playlistsToDisplay.map((playlist) => {
        return (
            <button key={playlist.id} className="home-playlist-btn">
                <img draggable="false" src={playlist.images[0].url} alt={playlist.name} />
                <p>{playlist.name}</p>
            </button>
        )
    })

    return (
        <div className="spotify-home-container">
            <div className="home-header">
                <h1 className="spotify-home-welcome">Hello, {props.displayName.split(" ")[0]}</h1>
            </div>
            <div className="prev-tracks">
                {availablePlaylists}
            </div>
        </div>
    )
}