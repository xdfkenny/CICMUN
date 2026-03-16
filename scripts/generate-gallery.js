import fs from 'node:fs'
import path from 'node:path'

const IMAGE_EXTENSIONS = /\.(jpe?g|png|webp)$/i
const THUMBNAIL_FOLDER = '__thumbs'
const THUMBNAIL_WIDTHS = { small: 480, medium: 960 }
const THUMBNAIL_QUALITY = { small: 68, medium: 76 }

const publicDir = path.resolve('public')
const galleryPublicDir = path.resolve('public/gallery')
const defaultSourceDir = path.resolve('public/gallery-origins')
const dataDir = path.resolve('data')
const outputFile = path.join(dataDir, 'gallery.json')
const galleryOriginBaseUrl = (() => {
  const value = process.env.GALLERY_ORIGIN_BASE_URL?.trim()
  if (!value) return null
  return new URL(value.endsWith('/') ? value : `${value}/`)
})()
const configuredSourceDir = process.env.GALLERY_SOURCE_DIR?.trim()
  ? path.resolve(process.env.GALLERY_SOURCE_DIR)
  : null

const toSlug = (value) =>
  value
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')

const encodeUrlPath = (...segments) =>
  `/${segments.map(segment => encodeURIComponent(segment)).join('/')}`

const encodeOriginUrl = (...segments) =>
  new URL(segments.map(segment => encodeURIComponent(segment)).join('/'), galleryOriginBaseUrl).toString()

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

const getEventDirectories = (directory) => {
  if (!fs.existsSync(directory)) return []

  return fs.readdirSync(directory, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && dirent.name !== THUMBNAIL_FOLDER)
    .sort((a, b) => a.name.localeCompare(b.name))
}

const resolveSourceDirectory = () => {
  const candidates = [
    configuredSourceDir,
    defaultSourceDir,
    galleryPublicDir,
  ].filter(Boolean)

  for (const candidate of candidates) {
    if (getEventDirectories(candidate).length > 0) {
      return candidate
    }
  }

  return candidates[0] ?? galleryPublicDir
}

const getPublicPathSegments = (directory) => {
  const relativeToPublic = path.relative(publicDir, directory)
  if (!relativeToPublic || relativeToPublic.startsWith('..') || path.isAbsolute(relativeToPublic)) {
    return null
  }

  return relativeToPublic.split(path.sep).filter(Boolean)
}

const isRemoteUrl = (value) => {
  if (typeof value !== 'string') return false

  try {
    const parsed = new URL(value)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

const isLocalPublicAssetPath = (value) =>
  typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') && !value.includes('..')

const hasPublicAsset = (value) => {
  if (!isLocalPublicAssetPath(value)) return false

  const [pathname] = value.split('?')
  const filePath = path.join(publicDir, decodeURIComponent(pathname.replace(/^\//, '')))
  return fs.existsSync(filePath)
}

const isDeployableAssetReference = (value) =>
  !value || isRemoteUrl(value) || hasPublicAsset(value)

const hasDeployableSrcSet = (value) => {
  if (!value) return true
  if (typeof value !== 'string') return false

  return value.split(',').every((candidate) => {
    const [url] = candidate.trim().split(/\s+/, 1)
    return isDeployableAssetReference(url)
  })
}

const loadExistingDeployableGalleryMetadata = () => {
  if (!fs.existsSync(outputFile)) return null

  try {
    const parsed = JSON.parse(fs.readFileSync(outputFile, 'utf8'))
    if (!Array.isArray(parsed)) return null

    const isValid = parsed.every((event) =>
      event
      && typeof event === 'object'
      && isDeployableAssetReference(event.coverImage)
      && Array.isArray(event.images)
      && event.images.every((image) =>
        image
        && typeof image === 'object'
        && isDeployableAssetReference(image.src)
        && isDeployableAssetReference(image.thumbnail)
        && hasDeployableSrcSet(image.srcSet),
      ),
    )

    return isValid ? parsed : null
  } catch {
    return null
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
  const outputPath = path.join(galleryPublicDir, outputRelativePath)

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

  return encodeUrlPath('gallery', THUMBNAIL_FOLDER, eventName, outputFilename)
}

ensureDir(dataDir)

if (!fs.existsSync(galleryPublicDir)) {
  console.log('Gallery directory not found — creating empty gallery directory')
  ensureDir(galleryPublicDir)
}

const sourceDir = resolveSourceDirectory()
const sourcePublicSegments = getPublicPathSegments(sourceDir)
const sharpLib = await loadSharp()
if (galleryOriginBaseUrl) {
  console.log(`Using external gallery origin for originals: ${galleryOriginBaseUrl.toString()}`)
}

const eventDirs = getEventDirectories(sourceDir)

if (!eventDirs.length) {
  const existingMetadata = loadExistingDeployableGalleryMetadata()
  if (existingMetadata) {
    console.log(`No gallery originals found in ${sourceDir}. Preserving deployable metadata at ${outputFile}`)
    process.exit(0)
  }

  fs.writeFileSync(outputFile, JSON.stringify([], null, 2))
  console.log(`No gallery originals found in ${sourceDir}. Wrote empty gallery metadata to ${outputFile}`)
  process.exit(0)
}

if (!galleryOriginBaseUrl && !sourcePublicSegments) {
  throw new Error(
    `Gallery source directory ${sourceDir} is not publicly reachable. Set GALLERY_ORIGIN_BASE_URL or use a source directory under ./public.`,
  )
}

const events = []

for (const dirent of eventDirs) {
  const eventName = dirent.name
  const eventId = toSlug(eventName)
  const eventPath = path.join(sourceDir, eventName)

  const imageFiles = fs.readdirSync(eventPath)
    .filter(file => IMAGE_EXTENSIONS.test(file))
    .sort((a, b) => a.localeCompare(b))

  const images = []

  for (const [index, filename] of imageFiles.entries()) {
    const sourcePath = path.join(eventPath, filename)
    const sourceStat = fs.statSync(sourcePath)
    const fullSrc = galleryOriginBaseUrl
      ? encodeOriginUrl(eventName, filename)
      : encodeUrlPath(...sourcePublicSegments, eventName, filename)

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

    let thumbWidth = width
    let thumbHeight = height

    if (width && height) {
      if (width > THUMBNAIL_WIDTHS.medium) {
        const ratio = height / width
        thumbWidth = THUMBNAIL_WIDTHS.medium
        thumbHeight = Math.round(thumbWidth * ratio)
      }
    }

    const thumbnail = thumbnailMedium || fullSrc
    const deliverySrc = galleryOriginBaseUrl
      ? fullSrc
      : thumbnail
    const deliverySrcSet = galleryOriginBaseUrl
      ? (
          thumbnailSmall
            ? `${thumbnailSmall} ${THUMBNAIL_WIDTHS.small}w, ${thumbnail} ${THUMBNAIL_WIDTHS.medium}w, ${fullSrc} ${Math.max(THUMBNAIL_WIDTHS.medium + 1, width || 1600)}w`
            : undefined
        )
      : (
          thumbnailSmall
            ? `${thumbnailSmall} ${THUMBNAIL_WIDTHS.small}w, ${thumbnail} ${THUMBNAIL_WIDTHS.medium}w`
            : undefined
        )

    images.push({
      id: `${eventId}-${index + 1}`,
      src: deliverySrc,
      thumbnail,
      srcSet: deliverySrcSet,
      sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
      alt: `${eventName} photo ${index + 1}`,
      eventId,
      eventName,
      width: thumbWidth,
      height: thumbHeight,
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
