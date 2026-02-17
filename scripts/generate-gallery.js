import fs from 'node:fs'
import path from 'node:path'

const IMAGE_EXTENSIONS = /\.(jpe?g|png|webp)$/i
const THUMBNAIL_FOLDER = '__thumbs'
const THUMBNAIL_WIDTHS = { small: 480, medium: 960 }
const THUMBNAIL_QUALITY = { small: 68, medium: 76 }

const galleryPath = path.resolve('public/Gallery')
const dataDir = path.resolve('data')
const outputFile = path.join(dataDir, 'gallery.json')

const toSlug = (value) =>
  value
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')

const encodeUrlPath = (...segments) =>
  `/${segments.map(segment => encodeURIComponent(segment)).join('/')}`

const sanitizeFileStem = (filename) =>
  path.parse(filename).name
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase() || 'image'

const ensureDir = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true })
  }
}

const loadSharp = async () => {
  try {
    const mod = await import('sharp')
    return mod.default || mod
  } catch {
    console.warn('sharp not found. Falling back to original files (no pre-generated thumbnails).')
    return null
  }
}

const createThumbnail = async ({ sharpLib, sourcePath, eventName, filename, stat, width, quality, suffix = '' }) => {
  if (!sharpLib) return null

  const fileStem = sanitizeFileStem(filename)
  const cacheTag = `${stat.size}-${Math.trunc(stat.mtimeMs)}`
  const outputFilename = `${fileStem}-${cacheTag}${suffix}.webp`
  const outputRelativePath = path.join(THUMBNAIL_FOLDER, eventName, outputFilename)
  const outputPath = path.join(galleryPath, outputRelativePath)

  ensureDir(path.dirname(outputPath))

  const shouldGenerate = !fs.existsSync(outputPath) || fs.statSync(outputPath).mtimeMs < stat.mtimeMs

  if (shouldGenerate) {
    await sharpLib(sourcePath)
      .rotate()
      .resize({
        width,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality })
      .toFile(outputPath)
  }

  return encodeUrlPath('Gallery', THUMBNAIL_FOLDER, eventName, outputFilename)
}

ensureDir(dataDir)

if (!fs.existsSync(galleryPath)) {
  console.log('Gallery directory not found')
  fs.writeFileSync(outputFile, JSON.stringify([], null, 2))
  process.exit(0)
}

const sharpLib = await loadSharp()
const dirEntries = fs.readdirSync(galleryPath, { withFileTypes: true })

const eventDirs = dirEntries
  .filter(dirent => dirent.isDirectory() && dirent.name !== THUMBNAIL_FOLDER)
  .sort((a, b) => a.name.localeCompare(b.name))

const events = []

for (const dirent of eventDirs) {
  const eventName = dirent.name
  const eventId = toSlug(eventName)
  const eventPath = path.join(galleryPath, eventName)

  const imageFiles = fs.readdirSync(eventPath)
    .filter(file => IMAGE_EXTENSIONS.test(file))
    .sort((a, b) => a.localeCompare(b))

  const images = []

  for (const [index, filename] of imageFiles.entries()) {
    const sourcePath = path.join(eventPath, filename)
    const sourceStat = fs.statSync(sourcePath)
    const fullSrc = encodeUrlPath('Gallery', eventName, filename)

    let width = null
    let height = null
    let thumbnailSmall = null
    let thumbnailMedium = null

    if (sharpLib) {
      try {
        const metadata = await sharpLib(sourcePath).metadata()
        width = metadata.width ?? null
        height = metadata.height ?? null

        thumbnailSmall = await createThumbnail({
          sharpLib,
          sourcePath,
          eventName,
          filename,
          stat: sourceStat,
          width: THUMBNAIL_WIDTHS.small,
          quality: THUMBNAIL_QUALITY.small,
          suffix: '-sm',
        })

        thumbnailMedium = await createThumbnail({
          sharpLib,
          sourcePath,
          eventName,
          filename,
          stat: sourceStat,
          width: THUMBNAIL_WIDTHS.medium,
          quality: THUMBNAIL_QUALITY.medium,
        })
      } catch (error) {
        console.warn(`Could not process ${filename} in ${eventName}: ${error.message}`)
      }
    }

    const thumbnail = thumbnailMedium || fullSrc

    images.push({
      id: `${eventId}-${index + 1}`,
      src: fullSrc,
      thumbnail,
      srcSet: thumbnailSmall
        ? `${thumbnailSmall} ${THUMBNAIL_WIDTHS.small}w, ${thumbnail} ${THUMBNAIL_WIDTHS.medium}w, ${fullSrc} ${Math.max(THUMBNAIL_WIDTHS.medium + 1, width || 1600)}w`
        : undefined,
      sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
      alt: `${eventName} photo ${index + 1}`,
      eventId,
      eventName,
      width,
      height,
    })
  }

  events.push({
    id: eventId,
    name: eventName,
    imageCount: images.length,
    coverImage: images[0]?.thumbnail || null,
    images,
  })
}

fs.writeFileSync(outputFile, JSON.stringify(events, null, 2))
console.log(`Gallery metadata generated successfully at ${outputFile}`)
