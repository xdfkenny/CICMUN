import { getAuth, signInWithEmailAndPassword, signOut, type User, GoogleAuthProvider, signInWithPopup, signInAnonymously } from 'firebase/auth'
import { getApp } from 'firebase/app'
import { useRoleOverrideStore } from '~/stores/roleOverride'

export type AuthRole = 'public' | 'delegate' | 'teacher' | 'staff' | 'admin' | 'super_admin'

const AUTH_ROLES: AuthRole[] = ['public', 'delegate', 'teacher', 'staff', 'admin', 'super_admin']

const resolveRole = (email: string | null | undefined, staffEmails: string[], adminEmails: string[], superAdminEmails: string[]) => {
  if (!email) return 'public'
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

const isAuthRole = (value: unknown): value is AuthRole => {
  return typeof value === 'string' && AUTH_ROLES.includes(value as AuthRole)
}

export const useAuth = () => {
  const user = useState<User | null>('auth:user', () => null)
  const role = useState<AuthRole>('auth:role', () => 'public')
  const effectiveRole = useState<AuthRole>('auth:effectiveRole', () => 'public')
  const ready = useState<boolean>('auth:ready', () => false)
  const error = useState<string | null>('auth:error', () => null)
  const viewAsRole = useState<AuthRole | null>('auth:viewAsRole', () => null)
  const roleOverrideStore = useRoleOverrideStore()

  const config = useRuntimeConfig()
  const staffEmails = normalizeEmailList(config.public.staffEmails)
  const adminEmails = normalizeEmailList(config.public.adminEmails)
  const superAdminEmails = normalizeEmailList(config.public.superAdminEmails)

  const isAuthenticated = computed(() => !!user.value)
  const isStaff = computed(() => effectiveRole.value === 'staff')
  const isDelegate = computed(() => ['delegate', 'staff', 'admin', 'super_admin'].includes(effectiveRole.value))
  const isSuperAdmin = computed(() => effectiveRole.value === 'super_admin')
  const isRealSuperAdmin = computed(() => role.value === 'super_admin')

  const applyEffectiveRole = () => {
    if (roleOverrideStore.overrideRole) {
      effectiveRole.value = roleOverrideStore.overrideRole
      return
    }
    if (isRealSuperAdmin.value && viewAsRole.value) {
      effectiveRole.value = viewAsRole.value
      return
    }
    effectiveRole.value = role.value
  }

  watch(() => roleOverrideStore.overrideRole, () => {
    applyEffectiveRole()
  })

  const login = async (email: string, password: string) => {
    error.value = null
    if (!process.client) return

    try {
      const auth = getAuth(getApp())
      const credential = await signInWithEmailAndPassword(auth, email, password)
      user.value = credential.user
      role.value = resolveRole(auth.currentUser?.email, staffEmails, adminEmails, superAdminEmails)
      applyEffectiveRole()
    } catch (err: any) {
      error.value = err?.message || 'Login failed'
      throw err
    }
  }

  const loginWithGoogle = async () => {
    error.value = null
    if (!process.client) return

    try {
      const auth = getAuth(getApp())
      const provider = new GoogleAuthProvider()
      const credential = await signInWithPopup(auth, provider)
      user.value = credential.user
      role.value = resolveRole(auth.currentUser?.email, staffEmails, adminEmails, superAdminEmails)
      applyEffectiveRole()
    } catch (err: any) {
      error.value = err?.message || 'Google login failed'
      throw err
    }
  }

  const loginAnonymousStudent = async () => {
    error.value = null
    if (!process.client) return

    try {
      const auth = getAuth(getApp())
      const credential = await signInAnonymously(auth)
      user.value = credential.user
      role.value = 'delegate'
      applyEffectiveRole()
    } catch (err: any) {
      error.value = err?.message || 'Student login failed'
      throw err
    }
  }

  const logout = async () => {
    error.value = null
    if (!process.client) return

    const auth = getAuth(getApp())
    try {
      await signOut(auth)
    } catch (err: any) {
      error.value = err?.message || 'Logout failed'
      throw err
    } finally {
      user.value = null
      role.value = 'public'
      effectiveRole.value = 'public'
      viewAsRole.value = null
      if (process.client) {
        localStorage.removeItem('cicmun:viewAsRole')
      }
    }
  }

  const setViewAsRole = (next: AuthRole | null) => {
    viewAsRole.value = next
    if (process.client) {
      if (next) {
        localStorage.setItem('cicmun:viewAsRole', next)
      } else {
        localStorage.removeItem('cicmun:viewAsRole')
      }
    }
    applyEffectiveRole()
  }

  if (process.client) {
    const saved = localStorage.getItem('cicmun:viewAsRole')
    if (saved && isAuthRole(saved)) {
      viewAsRole.value = saved
    } else if (saved) {
      localStorage.removeItem('cicmun:viewAsRole')
    }
  }

  return {
    user,
    role,
    effectiveRole,
    ready,
    error,
    viewAsRole,
    isAuthenticated,
    isStaff,
    isDelegate,
    isSuperAdmin,
    isRealSuperAdmin,
    login,
    loginWithGoogle,
    loginAnonymousStudent,
    logout,
    setViewAsRole,
  }
}
