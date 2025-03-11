import { useState } from "react"
import "./Canvas.css"
import videoLinksArray from "../assets/videoLinks.json"

export default function Canvas() {
    const [video, setVideo] = useState(videoLinksArray[0])
    
    return (
        <main>
            <iframe 
                src= "https://www.youtube.com/embed/LRmNqKw6Ly0?start=600&autoplay=1&loop=1&color=white&controls=0&modestbranding=1&playsinline=1&rel=0&enablejsapi=1&playlist=LRmNqKw6Ly0"
                frameborder="0"
                className="canvas"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
            >
            </iframe>
        </main>

    )
}
