import { FieldValue } from 'firebase-admin/firestore'
import type admin from 'firebase-admin'
import { randomBytes } from 'node:crypto'

const CODE_TTL_MS = 1000 * 60 * 60 * 24 * 30

const toMillis = (value: any) => {
  if (!value) return 0
  if (typeof value === 'number') return value
  if (value instanceof Date) return value.getTime()
  if (typeof value.toMillis === 'function') return value.toMillis()
  if (typeof value.seconds === 'number') return value.seconds * 1000
  if (typeof value === 'string') {
    const parsed = Date.parse(value)
    return Number.isNaN(parsed) ? 0 : parsed
  }
  return 0
}

const isExpired = (value: any) => {
  if (!value) return false
  const expiresAt = toMillis(value)
  return expiresAt > 0 && expiresAt <= Date.now()
}

export const getLatestValidTeacherCode = (docs: admin.firestore.QueryDocumentSnapshot[]) => {
  if (!docs.length) return null
  const sorted = docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .sort((a: any, b: any) => toMillis(b.createdAt) - toMillis(a.createdAt))
  const latest = sorted[0]
  if (!latest) return null
  if (isExpired(latest.expiresAt)) return null
  return {
    code: latest.code || latest.id,
    expiresAt: latest.expiresAt || null,
    createdAt: latest.createdAt || null,
  }
}

const CODE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const makeCode = () => {
  const bytes = randomBytes(6)
  let result = ''
  for (let i = 0; i < 6; i += 1) {
    result += CODE_CHARS[bytes[i] % CODE_CHARS.length]
  }
  return result
}

export const generateTeacherCode = async (db: admin.firestore.Firestore, uid: string) => {
  let attempts = 0
  while (attempts < 5) {
    const code = makeCode()
    const docRef = db.collection('registrationCodes').doc(code)
    const payload = {
      teacherId: uid,
      createdAt: FieldValue.serverTimestamp(),
      expiresAt: new Date(Date.now() + CODE_TTL_MS).toISOString(),
      code,
    }
    try {
      await docRef.create(payload)
      return { code, expiresAt: payload.expiresAt }
    } catch (err: any) {
      const errorCode = err?.code || err?.errorInfo?.code
      if (errorCode === 6 || errorCode === 'already-exists') {
        attempts += 1
        continue
      }
      throw err
    }
  }
  throw new Error('Unable to generate a unique code.')
}
