import { useState } from 'react'
import Canvas from './components/Canvas'
import DateTimeWeather from './components/DateTimeWeather'
import UIBar from './components/UIBar'
import './App.css'

function App() {
  const [videoID, setVideoID] = useState("LRmNqKw6Ly0")
  return (
    <>
      <DateTimeWeather />
      <UIBar />
      <Canvas videoID={videoID} />
    </>
  )
}

export default App
