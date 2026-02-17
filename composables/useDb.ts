import { getFirestore } from 'firebase/firestore'
import { getApp } from 'firebase/app'

export const useDb = () => {
  return getFirestore(getApp())
}
