import React, { useState, useEffect } from "react";

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
                </div>
                <div className="media-controls">

                </div>
                <div className="volume-controls">

                </div>
            </div>
        </div>
    )
}