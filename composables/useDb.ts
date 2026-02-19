import { getFirestore } from 'firebase/firestore'
import { getApp, getApps, initializeApp } from 'firebase/app'

export const useDb = () => {
  if (process.server) return null as any
  if (!getApps().length) {
    const config = useRuntimeConfig()
    initializeApp(config.public.firebase)
  }
  return getFirestore(getApp())
}
