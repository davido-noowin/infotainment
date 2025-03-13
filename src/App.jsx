import { useState } from 'react'
import Canvas from './components/Canvas'
import DateTimeWeather from './components/DateTimeWeather'
import UIBar from './components/UIBar'
import './App.css'

function App() {

  return (
    <>
      <DateTimeWeather />
      <UIBar />
      <Canvas />
    </>
  )
}

export default App
