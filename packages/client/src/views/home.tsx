import { useCallback } from "react"
import { useDropzone } from 'react-dropzone'

import './home.scss'
import DragArea from "@/components/drag-area"

const Home = () => {

  return (
    <div className="container">
      <header className="header">
        <DragArea />
      </header>
      <main className="list">
        <ul>
          <li>1</li>
          <li>2</li>
          <li>3</li>
        </ul>
      </main>
    </div>
  )
}

export default Home
