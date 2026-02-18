import { getAuth, signInWithEmailAndPassword, signOut, type User, GoogleAuthProvider, signInWithPopup, signInAnonymously, onAuthStateChanged } from 'firebase/auth'
import { getApp } from 'firebase/app'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { useRoleOverrideStore } from '~/stores/roleOverride'
import { useDb } from '~/composables/useDb'

export type AuthRole = 'public' | 'delegate' | 'teacher' | 'staff' | 'admin' | 'super_admin'

const AUTH_ROLES: AuthRole[] = ['public', 'delegate', 'teacher', 'staff', 'admin', 'super_admin']

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
  const listenerAttached = useState<boolean>('auth:listenerAttached', () => false)

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

  const resolveRoleFromClaims = (claims: Record<string, unknown> | undefined) => {
    const claimRole = claims?.role
    return isAuthRole(claimRole) ? claimRole : null
  }

  const syncAuthState = async (firebaseUser: User | null) => {
    user.value = firebaseUser

    if (!firebaseUser) {
      role.value = 'public'
      viewAsRole.value = null
      applyEffectiveRole()
      ready.value = true
      return
    }

    if (firebaseUser.isAnonymous) {
      role.value = 'delegate'
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

    const nextRole: AuthRole = roleFromClaims || storedRole || 'teacher'
    role.value = nextRole
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
      user.value = credential.user
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
      user.value = credential.user
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
      user.value = credential.user
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
    setViewAsRole,
  }
}
