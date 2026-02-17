interface AuthMeta {
  required?: boolean
  roles?: string[]
}

export default defineNuxtRouteMiddleware((to) => {
  const authMeta = (to.meta.auth || {}) as AuthMeta

  if (!authMeta.required) {
    return
  }

  if (process.server) {
    return
  }

  const { isAuthenticated, effectiveRole, ready } = useAuth()

  if (!ready.value) {
    return new Promise<void | ReturnType<typeof navigateTo>>((resolve) => {
      const resolveWithRedirect = () => {
        if (!isAuthenticated.value) {
          return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
        }
        const allowedRoles = authMeta.roles || []
        if (allowedRoles.length && !allowedRoles.includes(effectiveRole.value)) {
          return navigateTo('/')
        }
        return
      }
      let settled = false
      let timeoutId: ReturnType<typeof setTimeout> | null = null
      let stop: (() => void) | null = null
      const finalize = (result?: void | ReturnType<typeof navigateTo>) => {
        if (settled) return
        settled = true
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
        stop?.()
        resolve(result)
      }
      stop = watch(ready, (val) => {
        if (!val) return
        finalize(resolveWithRedirect())
      }, { immediate: true })
      timeoutId = setTimeout(() => {
        finalize(resolveWithRedirect())
      }, 5000)
    })
  }

  if (!isAuthenticated.value) {
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }

  const allowedRoles = authMeta.roles || []
  if (allowedRoles.length && !allowedRoles.includes(effectiveRole.value)) {
    return navigateTo('/')
  }
})
