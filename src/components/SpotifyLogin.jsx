import "./styles/SpotifyLogin.css";

export default function SpotifyLogin() {
  return (
    <div className="spotify-login-btn-container">
      <a className="spotify-login-btn" href="/auth/login">
        Login with Spotify
      </a>
    </div>
  );
}
