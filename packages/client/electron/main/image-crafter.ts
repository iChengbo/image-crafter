import { BrowserWindow } from "electron"
import Queue from "queue"
import path from 'path'

import { isFile } from "./utils"
import sharp from "sharp"

// const MIN_FOLDER = 'minified'
// const MIN_SUFFIX = '.min'
const MIME_TYPE_ENUM = {
  jpg: 'image/jpeg',
  png: 'image/png',
  svg: 'image/svg+xml',
  gif: 'image/gif',
  folder: ''
}

export class ImageCrafter {
  #queue: Queue
  #context: BrowserWindow
  files: File[]

  constructor(files: File[] = [], context: BrowserWindow) {
    this.#queue = new Queue({ results: [], concurrency: 10 })
    this.#context = context
    
    this.files = files
  }

  public start () {
    const timeStart = new Date()

    this.#context.webContents.send('optimization-start')

    this._optimize(this.files)
    this.#queue.addEventListener('end', () => {
      const timeEnd = new Date()
      const timeSpent = `${(timeEnd.valueOf() - timeStart.valueOf()) / 1000}s`

      this.#context.webContents.send('optimization-complete')
      this.#context.webContents.send('job-time', timeSpent)
    })
  }

  private _optimize (files: File[]) {
    files.forEach(async file => {
      if (!Object.values(MIME_TYPE_ENUM).includes(file.type)) {
        return
      }

      if (isFile(file.path)) {
        let { name, ext, dir } = path.parse(file.path)
        console.log(name, ext, dir)

        const output = `${dir}/crafter/${name}${ext}`

        this.#queue.push(() => this._processFile(file, output))
      }
    })
  }

  private async _processFile (file: File, output: string) {
    switch (file.type) {
      case MIME_TYPE_ENUM.jpg:
        await sharp(file.path).toFormat('jpeg', { quality: 70 }).toFile(output)
        break;
      default:
        break;
    }
    // return new Promise((resolve, reject) => {
    //   switch (file.type) {
    //     case MIME_TYPE_ENUM.jpg:
    //       sharp(file.path).toFormat('jpeg', { quality: 70 }).toFile(output).then(resolve).catch(reject)
    //       break;
    //     default:
    //       break;
    //   }
    // })
  }

  private _sendToRenderer (file: File, originalSize: number, compressedSize: number) {
    this.#context.webContents.send('image-compressed', {
      name: file.name,
      path: file.path,
      originalSize,
      compressedSize,
      compressionPercentage: Number(
        Math.abs(
          compressedSize * (100 / originalSize) - 100
        ).toFixed(2)
      )
    })
  }
}