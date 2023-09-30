import './App.css'
import Experience from './components/Experience'
import { Canvas } from '@react-three/fiber'

function App() {

  return (
    <Canvas shadows
    >
      <Experience />
    </Canvas>
  )
}

export default App
