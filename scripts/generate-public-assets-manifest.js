import fs from 'node:fs'
import path from 'node:path'

const publicDir = path.resolve('public')
const dataDir = path.resolve('data')
const outputFile = path.join(dataDir, 'public-assets.json')
const OMITTED_SUFFIXES = new Set(['.br', '.gz'])

const ensureDir = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true })
  }
}

const encodePublicPath = (relativePath) =>
  `/${relativePath.split(path.sep).filter(Boolean).map((segment) => encodeURIComponent(segment)).join('/')}`

const listPublicFiles = (directory, parent = '') => {
  if (!fs.existsSync(directory)) return []

  return fs.readdirSync(directory, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((dirent) => {
      const relativePath = path.join(parent, dirent.name)
      const absolutePath = path.join(directory, dirent.name)

      if (dirent.isDirectory()) {
        return listPublicFiles(absolutePath, relativePath)
      }

      if (OMITTED_SUFFIXES.has(path.extname(dirent.name))) {
        return []
      }

      return [encodePublicPath(relativePath)]
    })
}

ensureDir(dataDir)

const publicAssets = listPublicFiles(publicDir)
fs.writeFileSync(outputFile, `${JSON.stringify(publicAssets, null, 2)}\n`)

console.log(`Generated public asset manifest with ${publicAssets.length} entries at ${outputFile}`)
