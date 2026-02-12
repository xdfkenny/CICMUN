import fs from 'node:fs'
import path from 'node:path'

export default defineEventHandler(async (event) => {
  const galleryPath = path.resolve('public/Gallery')
  
  if (!fs.existsSync(galleryPath)) {
    return []
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

  return events
})
