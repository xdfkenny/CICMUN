import { initializeApp, getApps } from 'firebase/app'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import type { AuthRole } from '~/composables/useAuth'
import { useDb } from '~/composables/useDb'

const resolveRole = (
  email: string | null | undefined,
  staffEmails: string[],
  adminEmails: string[],
  superAdminEmails: string[]
) => {
  if (!email) return 'public' as AuthRole
  const normalized = email.trim().toLowerCase()
  if (superAdminEmails.map(entry => entry.trim().toLowerCase()).includes(normalized)) return 'super_admin'
  if (adminEmails.map(entry => entry.trim().toLowerCase()).includes(normalized)) return 'admin'
  if (staffEmails.map(entry => entry.trim().toLowerCase()).includes(normalized)) return 'staff'
  return 'teacher'
}

const normalizeEmailList = (value: unknown): string[] => {
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    return value
      .split(',')
      .map(entry => entry.trim())
      .filter(Boolean)
  }
  return []
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const firebaseConfig = config.public.firebase
  const staffEmails = normalizeEmailList(config.public.staffEmails)
  const adminEmails = normalizeEmailList(config.public.adminEmails)
  const superAdminEmails = normalizeEmailList(config.public.superAdminEmails)

  if (!getApps().length) {
    initializeApp(firebaseConfig)
  }

  const userState = useState('auth:user', () => null)
  const roleState = useState<AuthRole>('auth:role', () => 'public')
  const effectiveRoleState = useState<AuthRole>('auth:effectiveRole', () => 'public')
  const readyState = useState<boolean>('auth:ready', () => false)
  const viewAsRole = useState<AuthRole | null>('auth:viewAsRole', () => null)

  const auth = getAuth()
  const db = useDb()

  onAuthStateChanged(auth, async (user) => {
    userState.value = user
    roleState.value = resolveRole(user?.email, staffEmails, adminEmails, superAdminEmails)
    if (roleState.value === 'super_admin' && viewAsRole.value) {
      effectiveRoleState.value = viewAsRole.value
    } else {
      effectiveRoleState.value = roleState.value
    }

    if (user && user.email) {
      const userRef = doc(db, 'users', user.uid)
      try {
        const snap = await getDoc(userRef)
        if (snap.exists()) {
          const storedRole = snap.data()?.role as AuthRole | undefined
          if (storedRole && roleState.value !== 'super_admin') {
            roleState.value = storedRole
          }
        } else {
          await setDoc(userRef, {
            email: user.email,
            role: roleState.value,
            createdAt: serverTimestamp(),
            provider: user.providerData?.[0]?.providerId || 'password',
          }, { merge: true })
        }
      } catch (err) {
        console.error('Failed to sync user role', { uid: user.uid, email: user.email, error: err })
      }

      if (roleState.value === 'super_admin' && viewAsRole.value) {
        effectiveRoleState.value = viewAsRole.value
      } else {
        effectiveRoleState.value = roleState.value
      }
    }

    readyState.value = true
  })
})
