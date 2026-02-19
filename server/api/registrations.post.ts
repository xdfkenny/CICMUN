import { FieldValue } from 'firebase-admin/firestore'
import { getAdminDb } from '../utils/firebaseAdmin'
import { requireAuth } from '../utils/auth'

const isNonEmptyString = (value: unknown) =>
  typeof value === 'string' && value.trim().length > 0

const normalizeString = (value: unknown) =>
  typeof value === 'string' ? value.trim() : ''

export default defineEventHandler(async (event) => {
  const decoded = await requireAuth(event)
  if (!decoded.uid) {
    throw createError({ statusCode: 401, message: 'Missing user id' })
  }

  const signInProvider = decoded.firebase?.sign_in_provider
  if (signInProvider === 'anonymous') {
    throw createError({ statusCode: 403, message: 'Anonymous users cannot register delegations' })
  }

  const body = await readBody<any>(event)
  const delegationName = normalizeString(body?.delegationName)
  const eventName = normalizeString(body?.event)
  const committees = normalizeString(body?.committees)
  const participants = normalizeString(body?.participants)
  const supervisorName = normalizeString(body?.supervisorName)
  const supervisorEmail = normalizeString(body?.supervisorEmail)
  const supervisorPhone = normalizeString(body?.supervisorPhone)
  const school = normalizeString(body?.school)
  const delegationMode = normalizeString(body?.delegationMode)

  if (!isNonEmptyString(delegationName) || delegationName.length > 120) {
    throw createError({ statusCode: 400, message: 'Invalid delegation name' })
  }
  if (!['SAMUN', 'JMUN'].includes(eventName)) {
    throw createError({ statusCode: 400, message: 'Invalid event' })
  }
  if (!isNonEmptyString(committees)) {
    throw createError({ statusCode: 400, message: 'Invalid committees' })
  }
  if (!isNonEmptyString(participants)) {
    throw createError({ statusCode: 400, message: 'Invalid participants' })
  }
  if (!isNonEmptyString(supervisorName)) {
    throw createError({ statusCode: 400, message: 'Invalid supervisor name' })
  }
  if (!isNonEmptyString(supervisorEmail)) {
    throw createError({ statusCode: 400, message: 'Invalid supervisor email' })
  }
  if (!isNonEmptyString(supervisorPhone) || supervisorPhone.length > 30) {
    throw createError({ statusCode: 400, message: 'Invalid supervisor phone' })
  }
  if (!isNonEmptyString(school)) {
    throw createError({ statusCode: 400, message: 'Invalid school name' })
  }
  if (!['existing', 'new'].includes(delegationMode)) {
    throw createError({ statusCode: 400, message: 'Invalid delegation mode' })
  }

  const db = getAdminDb()
  const registrationRef = await db.collection('registrations').add({
    delegationName,
    event: eventName,
    committees,
    participants,
    supervisorName,
    supervisorEmail,
    supervisorPhone,
    school,
    delegationMode,
    uid: decoded.uid,
    createdAt: FieldValue.serverTimestamp(),
    status: 'pending',
  })

  await db.collection('users').doc(decoded.uid).set({
    email: decoded.email || supervisorEmail || null,
    role: 'teacher',
    delegationName,
    school,
    event: eventName,
    updatedAt: FieldValue.serverTimestamp(),
    lastRegistrationId: registrationRef.id,
  }, { merge: true })

  return { ok: true, id: registrationRef.id }
})
