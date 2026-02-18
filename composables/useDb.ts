import { getFirestore } from 'firebase/firestore'
import { getApp } from 'firebase/app'

export const useDb = () => {
  if (process.server) return null as any
  const { getApps, initializeApp } = require('firebase/app')
  if (!getApps().length) {
    const config = useRuntimeConfig()
    initializeApp(config.public.firebase)
  }
  return getFirestore(getApp())
}
