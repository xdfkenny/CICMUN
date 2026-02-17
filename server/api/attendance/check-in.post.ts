import { requireAuth } from '../../utils/auth'
import { getAdminDb } from '../../utils/firebaseAdmin'

export default defineEventHandler(async (event) => {
  const decoded = await requireAuth(event)
  const role = (decoded as any).role
  const config = useRuntimeConfig()
  const allowedEmails = [
    ...(config.public.superAdminEmails || []),
    ...(config.public.adminEmails || []),
    ...(config.public.staffEmails || []),
  ].map((email: string) => email.toLowerCase())

  if (!['staff', 'admin', 'super_admin'].includes(role)) {
    if (!decoded.email || !allowedEmails.includes(decoded.email.toLowerCase())) {
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

  await db.collection('attendance').add({
    studentId: parsed.uid,
    checkedInBy: decoded.uid,
    checkedInAt: new Date().toISOString(),
  })

  return { ok: true }
})
