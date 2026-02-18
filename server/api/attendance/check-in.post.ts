import { FieldValue } from 'firebase-admin/firestore'
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

  let parsed: { uid?: string; qrToken?: string }
  try {
    parsed = JSON.parse(body.payload)
  } catch {
    throw createError({ statusCode: 400, message: 'Invalid payload' })
  }

  if (!parsed.uid || !parsed.qrToken) {
    throw createError({ statusCode: 400, message: 'Invalid payload' })
  }

  const db = getAdminDb()
  const studentRef = db.collection('students').doc(parsed.uid)
  const studentSnap = await studentRef.get()
  if (!studentSnap.exists) {
    throw createError({ statusCode: 404, message: 'Student not found' })
  }

  const studentData = studentSnap.data() || {}
  if (studentData.qrToken !== parsed.qrToken) {
    throw createError({ statusCode: 401, message: 'Invalid QR token' })
  }

  const dateKey = new Date().toISOString().slice(0, 10)
  const attendanceId = `${parsed.uid}_${dateKey}`
  const attendanceRef = db.collection('attendance').doc(attendanceId)
  const existing = await attendanceRef.get()
  if (existing.exists) {
    return { ok: true, duplicate: true }
  }

  await attendanceRef.set({
    studentId: parsed.uid,
    checkedInBy: decoded.uid,
    checkedInAt: FieldValue.serverTimestamp(),
    dateKey,
  })

  const userSnap = await db.collection('users').doc(parsed.uid).get()
  const email = userSnap.exists ? userSnap.data()?.email || null : null

  return { ok: true, email }
})
