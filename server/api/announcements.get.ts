import announcements from '~/data/announcements.json'
import { getBearerToken } from '../utils/auth'
import { getAdminAuth } from '../utils/firebaseAdmin'

export default defineEventHandler(async (event) => {
  const token = getBearerToken(event)
  let role: string | null = null
  if (token) {
    try {
      const decoded = await getAdminAuth().verifyIdToken(token)
      role = (decoded as any)?.role || null
    } catch {
      role = null
    }
  }

  const isDelegate = !!role && ['delegate', 'staff', 'admin', 'super_admin'].includes(role)
  const isStaff = !!role && ['staff', 'admin', 'super_admin'].includes(role)
  const now = Date.now()

  return announcements.filter((item: any) => {
    const audience = item.audience || 'public'
    if (audience === 'delegate' && !isDelegate) return false
    if (audience === 'staff' && !isStaff) return false
    const start = item.startsAt ? new Date(item.startsAt) : null
    const end = item.endsAt ? new Date(item.endsAt) : null
    const startValid = start ? !Number.isNaN(start.getTime()) : false
    const endValid = end ? !Number.isNaN(end.getTime()) : false
    if (start && !startValid) return false
    if (end && !endValid) return false
    if (startValid && start!.getTime() > now) return false
    if (endValid && end!.getTime() < now) return false
    return true
  })
})
