import { initializeApp, getApps } from 'firebase/app'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const firebaseConfig = config.public.firebase
  const requiredKeys = ['apiKey', 'authDomain', 'projectId'] as const
  const missingKeys = requiredKeys.filter(key => !firebaseConfig?.[key])

  if (missingKeys.length) {
    console.error(`[CICMUN] Firebase config missing required keys: ${missingKeys.join(', ')}`)
    return
  }

  if (!getApps().length) {
    initializeApp(firebaseConfig)
  }
})
