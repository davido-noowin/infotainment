import { useState } from "react"
import "./Canvas.css"
import videoLinksArray from "../assets/videoLinks.json"

export default function Canvas() {
    const [video, setVideo] = useState(videoLinksArray[0])
    
    return (
        <main seamless="seamless">
            <iframe 
                src= "https://www.youtube.com/embed/3DD4pgL5bS4?start=777&autoplay=1&loop=1&color=white&controls=0&modestbranding=1&playsinline=1&rel=0&enablejsapi=1&playlist=3DD4pgL5bS4"
                frameborder="0"
                className="canvas"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowfullscreen
            >
            </iframe>
        </main>
    )
}
