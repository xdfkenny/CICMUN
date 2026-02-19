import { getAdminDb } from './firebaseAdmin'
import { requireAuth } from './auth'

const TEACHER_ROLES = new Set(['teacher', 'staff', 'admin', 'super_admin'])

const normalizeIdList = (value: unknown) => {
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    return value.split(',').map(entry => entry.trim()).filter(Boolean)
  }
  return []
}

export const requireTeacherAccess = async (event: any) => {
  const decoded = await requireAuth(event)
  if (!decoded.uid) {
    throw createError({ statusCode: 401, message: 'Missing user id' })
  }

  const roleClaim = (decoded as any).role
  if (roleClaim && TEACHER_ROLES.has(roleClaim)) {
    return { uid: decoded.uid, role: roleClaim, decoded }
  }

  const config = useRuntimeConfig()
  const allowedIds = [
    ...normalizeIdList(config.superAdminIds),
    ...normalizeIdList(config.adminIds),
    ...normalizeIdList(config.staffIds),
  ]
  if (allowedIds.includes(decoded.uid)) {
    return { uid: decoded.uid, role: 'staff', decoded }
  }

  const signInProvider = decoded.firebase?.sign_in_provider
  if (signInProvider === 'anonymous') {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  const db = getAdminDb()
  const userSnap = await db.collection('users').doc(decoded.uid).get()
  const storedRole = userSnap.exists ? userSnap.data()?.role : null
  if (storedRole && TEACHER_ROLES.has(storedRole)) {
    return { uid: decoded.uid, role: storedRole, decoded }
  }

  return { uid: decoded.uid, role: 'teacher', decoded }
}
