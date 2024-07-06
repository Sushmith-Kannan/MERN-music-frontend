import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import MusicPlayer from './pages/player'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <MusicPlayer/>
    </>
  )
}

export default App
