import { useState } from 'react'
import Canvas from './components/Canvas'
import DateTimeWeather from './components/DateTimeWeather'
import './App.css'

function App() {

  return (
    <>
      <DateTimeWeather />
      <Canvas />
    </>
  )
}

export default App
