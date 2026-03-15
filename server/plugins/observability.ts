import { getRequestHeader, getRequestURL, removeResponseHeader, setResponseHeader } from 'h3'

interface RequestLogContext {
  requestId: string
  startedAt: number
}

const CONTEXT_KEY = 'observability'

export default defineNitroPlugin((nitroApp) => {
  const originalCaptureError = nitroApp.captureError

  nitroApp.captureError = (error, context) => {
    const event = context.event
    const requestContext = (event?.context as Record<string, unknown> | undefined)?.[CONTEXT_KEY] as RequestLogContext | undefined

    console.error(JSON.stringify({
      level: 'error',
      type: 'request_error',
      timestamp: new Date().toISOString(),
      requestId: requestContext?.requestId ?? null,
      method: event?.method ?? null,
      path: event ? getRequestURL(event).pathname : null,
      errorName: error.name,
      message: error.message,
    }))

    return originalCaptureError(error, context)
  }

  nitroApp.hooks.hook('request', (event) => {
    const requestId = getRequestHeader(event, 'x-request-id') || crypto.randomUUID()
    ;(event.context as Record<string, unknown>)[CONTEXT_KEY] = {
      requestId,
      startedAt: performance.now(),
    }

    removeResponseHeader(event, 'x-powered-by')
    setResponseHeader(event, 'x-request-id', requestId)
  })

  nitroApp.hooks.hook('beforeResponse', (event) => {
    removeResponseHeader(event, 'x-powered-by')
  })

  nitroApp.hooks.hook('afterResponse', (event, response) => {
    removeResponseHeader(event, 'x-powered-by')

    const requestContext = (event.context as Record<string, unknown>)[CONTEXT_KEY] as RequestLogContext | undefined
    const durationMs = requestContext ? Math.round((performance.now() - requestContext.startedAt) * 100) / 100 : null

    console.info(JSON.stringify({
      level: 'info',
      type: 'request_complete',
      timestamp: new Date().toISOString(),
      requestId: requestContext?.requestId ?? null,
      method: event.method,
      path: getRequestURL(event).pathname,
      statusCode: response.status || event.node.res.statusCode || 200,
      durationMs,
    }))
  })
})
