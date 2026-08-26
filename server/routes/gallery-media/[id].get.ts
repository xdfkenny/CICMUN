/**
 * Proxies gallery media hosted on Google Drive's CDN.
 *
 * Hotlinking lh3.googleusercontent.com directly from the browser triggers
 * per-IP rate limits (HTTP 429 with an HTML body), which browsers then block
 * as cross-origin (ORB). Serving the bytes from our own origin keeps the
 * response same-origin and lets the CDN/browser cache them aggressively.
 */

const ALLOWED_WIDTHS = new Set([480, 960])
const UPSTREAM_BASE = 'https://lh3.googleusercontent.com/d'

// Throttle concurrent upstream fetches: bursts of image requests otherwise risk
// tripping Drive CDN per-IP rate limits (HTTP 429).
const MAX_CONCURRENT_UPSTREAM = 6
let activeUpstreamFetches = 0
const waitingRequests: Array<() => void> = []

const acquireUpstreamSlot = async () => {
  if (activeUpstreamFetches < MAX_CONCURRENT_UPSTREAM) {
    activeUpstreamFetches += 1
    return
  }
  await new Promise<void>((resolve) => waitingRequests.push(resolve))
  activeUpstreamFetches += 1
}

const releaseUpstreamSlot = () => {
  activeUpstreamFetches -= 1
  waitingRequests.shift()?.()
}

export default defineEventHandler(async (event) => {
  const fileId = getRouterParam(event, 'id') ?? ''
  if (!/^[-\w]{20,}$/.test(fileId)) {
    throw createError({ statusCode: 400, message: 'Invalid gallery media id' })
  }

  const requestedWidth = Number(getQuery(event).w)
  const width = ALLOWED_WIDTHS.has(requestedWidth) ? requestedWidth : 960

  await acquireUpstreamSlot()
  let upstream: Response
  try {
    upstream = await fetch(`${UPSTREAM_BASE}/${fileId}=w${width}`, {
      redirect: 'follow',
      headers: { Accept: 'image/*' },
    })

    // Transient rate limiting upstream — retry once before giving up.
    if (upstream.status === 429) {
      await new Promise((resolve) => setTimeout(resolve, 1200))
      upstream = await fetch(`${UPSTREAM_BASE}/${fileId}=w${width}`, {
        redirect: 'follow',
        headers: { Accept: 'image/*' },
      })
    }
  } finally {
    releaseUpstreamSlot()
  }

  const contentType = upstream.headers.get('content-type') ?? ''
  if (!upstream.ok || !contentType.startsWith('image/') || !upstream.body) {
    throw createError({ statusCode: 502, message: 'Gallery media unavailable' })
  }

  setHeader(event, 'Content-Type', contentType)
  setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')
  setHeader(event, 'X-Content-Type-Options', 'nosniff')

  return Buffer.from(await upstream.arrayBuffer())
})
