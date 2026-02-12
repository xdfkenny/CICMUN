import fs from 'node:fs'
import path from 'node:path'

const galleryPath = path.resolve('public/Gallery')
const dataDir = path.resolve('data')
const outputFile = path.join(dataDir, 'gallery.json')

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir)
}

if (!fs.existsSync(galleryPath)) {
  console.log('Gallery directory not found')
  fs.writeFileSync(outputFile, JSON.stringify([], null, 2))
  process.exit(0)
}

const events = fs.readdirSync(galleryPath, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => {
    const eventName = dirent.name
    const eventPath = path.join(galleryPath, eventName)
    const images = fs.readdirSync(eventPath)
      .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
      .map(file => `/Gallery/${eventName}/${file}`)
    
    return {
      id: eventName.toLowerCase().replace(/\s+/g, '-'),
      name: eventName,
      images: images
    }
  })

fs.writeFileSync(outputFile, JSON.stringify(events, null, 2))
console.log(`Gallery metadata generated successfully at ${outputFile}`)
