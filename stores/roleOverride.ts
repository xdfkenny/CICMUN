import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { AuthRole } from '~/composables/useAuth'

const STORAGE_KEY = 'cicmun:roleOverride'
const AUTH_ROLES: AuthRole[] = ['public', 'delegate', 'teacher', 'staff', 'admin', 'super_admin']

const isAuthRole = (value: unknown): value is AuthRole => {
  return typeof value === 'string' && AUTH_ROLES.includes(value as AuthRole)
}

export const useRoleOverrideStore = defineStore('roleOverride', () => {
  const overrideRole = ref<AuthRole | null>(null)

  const load = () => {
    if (!process.client) return
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && isAuthRole(saved)) {
      overrideRole.value = saved
      return
    }
    if (saved) {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  const persist = () => {
    if (!process.client) return
    if (overrideRole.value) {
      localStorage.setItem(STORAGE_KEY, overrideRole.value)
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  const setOverrideRole = (role: AuthRole | null) => {
    overrideRole.value = role
  }

  const clearOverrideRole = () => {
    overrideRole.value = null
  }

  if (process.client) {
    load()
  }

  watch(overrideRole, persist)

  return {
    overrideRole,
    setOverrideRole,
    clearOverrideRole,
    load,
  }
})
