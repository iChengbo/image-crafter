import fs from 'fs'

export const isFile = (path: string) => {
  const stat = fs.lstatSync(path)
  return stat.isFile()
}