import fs from 'node:fs'
import path from 'node:path'

const sourceDir = path.resolve('public/gallery')
const targetDir = path.resolve('public/gallery-origins')
const THUMBNAIL_FOLDER = '__thumbs'

if (!fs.existsSync(sourceDir)) {
  console.log(`Source gallery directory does not exist: ${sourceDir}`)
  process.exit(0)
}

fs.mkdirSync(targetDir, { recursive: true })

const eventDirs = fs.readdirSync(sourceDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory() && dirent.name !== THUMBNAIL_FOLDER)
  .sort((a, b) => a.name.localeCompare(b.name))

let movedCount = 0

for (const dirent of eventDirs) {
  const fromPath = path.join(sourceDir, dirent.name)
  const toPath = path.join(targetDir, dirent.name)

  if (fs.existsSync(toPath)) {
    console.warn(`Skipping ${dirent.name}; target already exists at ${toPath}`)
    continue
  }

  fs.renameSync(fromPath, toPath)
  movedCount += 1
}

console.log(`Moved ${movedCount} gallery event directories from ${sourceDir} to ${targetDir}`)
