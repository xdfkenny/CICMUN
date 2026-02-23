export interface GalleryImage {
  id: string
  src: string
  thumbnail: string
  srcSet?: string
  sizes?: string
  alt: string
  eventId: string
  eventName: string
  width: number | null
  height: number | null
}

export interface GalleryEvent {
  id: string
  name: string
  imageCount: number
  coverImage: string | null
  images: GalleryImage[]
}

export interface GalleryResponse {
  events: {
    id: string
    name: string
    imageCount: number
    coverImage: string | null
  }[]
  images: GalleryImage[]
  total: number
  page: number
  limit: number
}
