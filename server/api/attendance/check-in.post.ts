import { FieldValue } from 'firebase-admin/firestore'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { requireAuth } from '../../utils/auth'
import { getAdminDb } from '../../utils/firebaseAdmin'

export default defineEventHandler(async (event) => {
  const decoded = await requireAuth(event)
  const role = (decoded as any).role
  const config = useRuntimeConfig()
  const normalizeIdList = (value: unknown) => {
    if (Array.isArray(value)) return value
    if (typeof value === 'string') {
      return value.split(',').map(entry => entry.trim()).filter(Boolean)
    }
    return []
  }
  const allowedIds = [
    ...normalizeIdList(config.superAdminIds),
    ...normalizeIdList(config.adminIds),
    ...normalizeIdList(config.staffIds),
  ]

  if (!['staff', 'admin', 'super_admin'].includes(role)) {
    if (!decoded.uid || !allowedIds.includes(decoded.uid)) {
      throw createError({ statusCode: 403, message: 'Forbidden' })
    }
  }
  const body = await readBody<{ payload?: string }>(event)
  if (!body || !body.payload) {
    throw createError({ statusCode: 400, message: 'Missing payload' })
  }

  let parsed: { uid?: string; qrToken?: string; ts?: string; sig?: string }
  try {
    parsed = JSON.parse(body.payload)
  } catch {
    throw createError({ statusCode: 400, message: 'Invalid payload' })
  }

  if (!parsed.uid) {
    throw createError({ statusCode: 400, message: 'Invalid payload' })
  }

  const usesSignature = !!parsed.ts && !!parsed.sig
  if (!usesSignature && !parsed.qrToken) {
    throw createError({ statusCode: 400, message: 'Invalid payload' })
  }

  if (usesSignature) {
    const secret = config.checkInSecret
    if (!secret) {
      throw createError({ statusCode: 500, message: 'Check-in signature is not configured' })
    }
    const tsMs = Date.parse(parsed.ts as string)
    if (!Number.isFinite(tsMs)) {
      throw createError({ statusCode: 400, message: 'Invalid timestamp' })
    }
    const now = Date.now()
    const MAX_SKEW_MS = 2 * 60 * 1000
    if (Math.abs(now - tsMs) > MAX_SKEW_MS) {
      throw createError({ statusCode: 401, message: 'QR signature expired' })
    }
    const expected = createHmac('sha256', secret)
      .update(`${parsed.uid}|${parsed.ts}`)
      .digest('base64url')
    const expectedBuf = Buffer.from(expected)
    const providedBuf = Buffer.from(parsed.sig as string)
    if (expectedBuf.length !== providedBuf.length || !timingSafeEqual(expectedBuf, providedBuf)) {
      throw createError({ statusCode: 401, message: 'Invalid QR signature' })
    }
  }

  const db = getAdminDb()
  const studentRef = db.collection('students').doc(parsed.uid)
  const studentSnap = await studentRef.get()
  if (!studentSnap.exists) {
    throw createError({ statusCode: 404, message: 'Student not found' })
  }

  const studentData = studentSnap.data() || {}
  if (!usesSignature && studentData.qrToken !== parsed.qrToken) {
    throw createError({ statusCode: 401, message: 'Invalid QR token' })
  }

  const dateKey = new Date().toISOString().slice(0, 10)
  const attendanceId = `${parsed.uid}_${dateKey}`
  const attendanceRef = db.collection('attendance').doc(attendanceId)
  try {
    await attendanceRef.create({
      studentId: parsed.uid,
      checkedInBy: decoded.uid,
      checkedInAt: FieldValue.serverTimestamp(),
      dateKey,
    })
  } catch (err: any) {
    const errorCode = err?.code || err?.errorInfo?.code
    if (errorCode === 6 || errorCode === 'already-exists') {
      return { ok: true, duplicate: true }
    }
    throw err
  }

  const userSnap = await db.collection('users').doc(parsed.uid).get()
  const email = userSnap.exists ? userSnap.data()?.email || null : null

  return { ok: true, email }
})
