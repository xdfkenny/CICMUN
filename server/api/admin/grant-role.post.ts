import { getAdminAuth, getAdminDb } from '../../utils/firebaseAdmin'
import { requireAuth } from '../../utils/auth'

const ALLOWED_ROLES = ['delegate', 'teacher', 'staff', 'admin', 'super_admin'] as const

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const decoded = await requireAuth(event)

  const superAdminEmails = (config.superAdminEmails || config.public.superAdminEmails || []).map((email: string) => email.toLowerCase())
  const requesterEmail = decoded.email?.toLowerCase()

  if (!requesterEmail || !superAdminEmails.includes(requesterEmail)) {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  const body = await readBody<{ email?: string; role?: string }>(event)
  const email = body.email?.toLowerCase()
  const role = body.role

  if (!email || !role) {
    throw createError({ statusCode: 400, message: 'Missing email or role' })
  }

  if (!ALLOWED_ROLES.includes(role as typeof ALLOWED_ROLES[number])) {
    throw createError({ statusCode: 400, message: 'Invalid role' })
  }

  const auth = getAdminAuth()
  const db = getAdminDb()

  try {
    const userRecord = await auth.getUserByEmail(email)
    const existingClaims = userRecord.customClaims || {}
    const mergedClaims = { ...existingClaims, role }
    await auth.setCustomUserClaims(userRecord.uid, mergedClaims)

    await db.collection('users').doc(userRecord.uid).set({
      email,
      role,
      updatedAt: new Date().toISOString(),
    }, { merge: true })

    return { ok: true }
  } catch (err: any) {
    const errorCode = err?.code || err?.errorInfo?.code
    if (errorCode === 'auth/user-not-found') {
      await db.collection('roleRequests').doc(email).set({
        email,
        role,
        createdAt: new Date().toISOString(),
      }, { merge: true })
      return { ok: true, pending: true }
    }
    console.error('Failed to grant role', { email, role, error: err })
    throw createError({ statusCode: 500, message: 'Unable to grant role' })
  }
})
