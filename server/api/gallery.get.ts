import galleryData from '../../data/gallery.json'
import type { GalleryEvent } from '../../shared/gallery'

export default defineEventHandler(async () => {
  return galleryData as GalleryEvent[]
})
