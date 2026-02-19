import { getAuth, signInWithEmailAndPassword, signOut, type User, GoogleAuthProvider, signInWithPopup, signInAnonymously, onAuthStateChanged } from 'firebase/auth'
import { getApp } from 'firebase/app'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { useRoleOverrideStore } from '~/stores/roleOverride'
import { useDb } from '~/composables/useDb'

export type AuthRole = 'public' | 'delegate' | 'teacher' | 'staff' | 'admin' | 'super_admin'
export type AuthUser = {
  uid: string
  email: string | null
  displayName: string | null
  isAnonymous: boolean
}

const AUTH_ROLES: AuthRole[] = ['public', 'delegate', 'teacher', 'staff', 'admin', 'super_admin']

const isAuthRole = (value: unknown): value is AuthRole => {
  return typeof value === 'string' && AUTH_ROLES.includes(value as AuthRole)
}

export const useAuth = () => {
  const authCookie = useCookie<{ uid: string, role: AuthRole, email?: string | null } | null>('auth-session', {
    maxAge: 60 * 60 * 24 * 7, // 1 week
    sameSite: 'lax',
  })

  const user = useState<AuthUser | null>('auth:user', () => null)
  const role = useState<AuthRole>('auth:role', () => authCookie.value?.role || 'public')
  const effectiveRole = useState<AuthRole>('auth:effectiveRole', () => authCookie.value?.role || 'public')
  const ready = useState<boolean>('auth:ready', () => !!authCookie.value) // Ready if cookie exists
  const error = useState<string | null>('auth:error', () => null)
  const viewAsRole = useState<AuthRole | null>('auth:viewAsRole', () => null)
  const roleOverrideStore = useRoleOverrideStore()
  const listenerAttached = useState<boolean>('auth:listenerAttached', () => false)

  const isAuthenticated = computed(() => !!authCookie.value || !!user.value)
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

  // Also watch role changes to update cookie
  watch(role, (newRole) => {
    if (authCookie.value) {
      authCookie.value.role = newRole
    }
  })

  const resolveRoleFromClaims = (claims: Record<string, unknown> | undefined) => {
    const claimRole = claims?.role
    return isAuthRole(claimRole) ? claimRole : null
  }

  const syncAuthState = async (firebaseUser: User | null) => {
    user.value = firebaseUser
      ? {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          isAnonymous: firebaseUser.isAnonymous,
        }
      : null

    if (!firebaseUser) {
      role.value = 'public'
      viewAsRole.value = null
      authCookie.value = null
      applyEffectiveRole()
      ready.value = true
      return
    }

    // Default basic cookie update
    const currentCookie = authCookie.value || { uid: firebaseUser.uid, role: 'public' as AuthRole, email: firebaseUser.email }
    currentCookie.uid = firebaseUser.uid
    currentCookie.email = firebaseUser.email

    if (firebaseUser.isAnonymous) {
      role.value = 'delegate'
      currentCookie.role = 'delegate'
      authCookie.value = currentCookie
      applyEffectiveRole()
      ready.value = true
      return
    }

    let roleFromClaims: AuthRole | null = null
    try {
      const tokenResult = await firebaseUser.getIdTokenResult()
      roleFromClaims = resolveRoleFromClaims(tokenResult?.claims as Record<string, unknown>)
    } catch {
      // ignore token errors, fall back to Firestore role
    }

    let storedRole: AuthRole | null = null
    let snap: Awaited<ReturnType<typeof getDoc>> | null = null
    try {
      const db = useDb()
      const userRef = doc(db, 'users', firebaseUser.uid)
      snap = await getDoc(userRef)
      if (snap.exists()) {
        const candidate = snap.data()?.role
        if (isAuthRole(candidate)) {
          storedRole = candidate
        }
      }
    } catch {
      // ignore Firestore read errors
    }

    const nextRole: AuthRole = roleFromClaims || storedRole || 'public'
    role.value = nextRole
    currentCookie.role = nextRole
    authCookie.value = currentCookie

    applyEffectiveRole()

    if (firebaseUser.email) {
      try {
        const db = useDb()
        const userRef = doc(db, 'users', firebaseUser.uid)
        if (!snap || !snap.exists()) {
          await setDoc(userRef, {
            email: firebaseUser.email,
            role: nextRole,
            createdAt: serverTimestamp(),
            provider: firebaseUser.providerData?.[0]?.providerId || 'password',
          }, { merge: true })
        } else if (roleFromClaims && storedRole !== roleFromClaims) {
          await setDoc(userRef, {
            role: roleFromClaims,
            updatedAt: serverTimestamp(),
          }, { merge: true })
        }
      } catch {
        // ignore Firestore write errors
      }
    }

    ready.value = true
  }

  const login = async (email: string, password: string) => {
    error.value = null
    if (!process.client) return

    try {
      const auth = getAuth(getApp())
      const credential = await signInWithEmailAndPassword(auth, email, password)
      // syncAuthState will be called by onAuthStateChanged, but we call it here to ensure immediate feedback
      await syncAuthState(credential.user)
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
      await syncAuthState(credential.user)
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
      await syncAuthState(credential.user)
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
      authCookie.value = null
      effectiveRole.value = 'public'
      viewAsRole.value = null
      if (process.client) {
        localStorage.removeItem('cicmun:viewAsRole')
      }
    }
  }

  const refreshAuthState = async () => {
    if (!process.client) return
    const auth = getAuth(getApp())
    const currentUser = auth.currentUser
    if (!currentUser) return
    try {
      await currentUser.getIdToken(true)
    } catch {
      // ignore token refresh errors
    }
    await syncAuthState(currentUser)
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
      applyEffectiveRole()
    } else if (saved) {
      localStorage.removeItem('cicmun:viewAsRole')
    }
  }

  if (process.client && !listenerAttached.value) {
    listenerAttached.value = true
    const auth = getAuth(getApp())
    onAuthStateChanged(auth, (firebaseUser) => {
      void syncAuthState(firebaseUser)
    })
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
    refreshAuthState,
    setViewAsRole,
  }
}
