import { createHash } from 'crypto'
import { getAdminAuth, getAdminDb } from '../../utils/firebaseAdmin'
import { requireAuth } from '../../utils/auth'

const ALLOWED_ROLES = ['delegate', 'teacher', 'staff', 'admin', 'super_admin'] as const
const hashIdentifier = (value: string) => createHash('sha256').update(value).digest('hex').slice(0, 12)

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const decoded = await requireAuth(event)

  const normalizeIdList = (value: unknown) => {
    if (Array.isArray(value)) return value
    if (typeof value === 'string') {
      return value.split(',').map(entry => entry.trim()).filter(Boolean)
    }
    return []
  }
  const superAdminIds = normalizeIdList(config.superAdminIds)

  if (!decoded.uid || !superAdminIds.includes(decoded.uid)) {
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
    const userRef = db.collection('users').doc(userRecord.uid)
    const previousSnap = await userRef.get()
    const previousData = previousSnap.exists ? previousSnap.data() : null

    await userRef.set({
      email,
      role,
      updatedAt: new Date().toISOString(),
    }, { merge: true })

    try {
      await auth.setCustomUserClaims(userRecord.uid, mergedClaims)
    } catch (err) {
      if (previousData) {
        await userRef.set(previousData)
      } else {
        await userRef.delete()
      }
      throw err
    }

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
    console.error('Failed to grant role', { emailHash: hashIdentifier(email), role, error: err })
    throw createError({ statusCode: 500, message: 'Unable to grant role' })
  }
})
