import React, { useState, useEffect } from "react";
import "./styles/SpotifyWebPlayback.css"

const track = {
    name: "",
    album: {
      images: [{ url: "" }],
    },
    artists: [{ name: "" }],
  };

export default function SpotifyWebPlayback(props) {
    return (
        <div className="spotify-container">
            <div className="music-player-sections">
                <div className="now-playing-side">
                    <p>Now Playing:</p>
                    <div className="title-and-author">

                    </div>
                </div>
                <div className="media-controls">
                    <button>
                        back
                    </button>
                    <button>
                        pause
                    </button>
                    <button>
                        skip
                    </button>
                </div>
                <div className="volume-controls">
                    <p>volume</p>
                </div>
            </div>
        </div>
    )
}