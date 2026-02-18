import { initializeApp, getApps } from 'firebase/app'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const firebaseConfig = config.public.firebase

  if (!getApps().length) {
    initializeApp(firebaseConfig)
  }
})
