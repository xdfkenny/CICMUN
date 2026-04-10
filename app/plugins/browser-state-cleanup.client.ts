const CLEARABLE_KEYS = [
  'nuxt-color-mode',
]

const clearCookie = (name: string) => {
  const domains = [window.location.hostname, `.${window.location.hostname}`]
  const paths = ['/', '']

  for (const domain of domains) {
    for (const path of paths) {
      const segments = [
        `${encodeURIComponent(name)}=`,
        'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
        'Max-Age=0',
      ]

      if (path) segments.push(`Path=${path}`)
      if (domain) segments.push(`Domain=${domain}`)

      document.cookie = segments.join('; ')
    }
  }
}

export default defineNuxtPlugin(() => {
  for (const key of CLEARABLE_KEYS) {
    try {
      window.localStorage.removeItem(key)
    } catch {
      // Ignore browsers that block localStorage access.
    }

    try {
      window.sessionStorage.removeItem(key)
    } catch {
      // Ignore browsers that block sessionStorage access.
    }

    clearCookie(key)
  }
})
