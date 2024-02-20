import { useCallback } from "react"
import { useDropzone } from "react-dropzone"

import "./index.scss"

const DragArea = () => {

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log(acceptedFiles)
    const data = acceptedFiles.map(file => ({
      path: file.path,
      size: file.size,
      name: file.name,
      type: file.type
    }))
    window.ipcRenderer.send('render-process-message', { type: 'image:drop', data })
  }, [])
  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  return (
    <section className="dragarea" {...getRootProps()}>
      <input {...getInputProps()} />
      <div>
        <h2>Drag files or folder here</h2>
        <p>support only JPG, PNG, GIF and SVG</p>
      </div>
    </section>
  )
}

export default DragArea