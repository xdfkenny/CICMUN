import { getAdminDb } from '../../utils/firebaseAdmin'
import { requireTeacherAccess } from '../../utils/teacherAuth'
import { generateTeacherCode, getLatestValidTeacherCode } from '../../utils/teacherCodes'

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

export default defineEventHandler(async (event) => {
  const { uid } = await requireTeacherAccess(event)
  const db = getAdminDb()

  let schoolName: string | null = null
  let delegationName: string | null = null
  try {
    const registrationsSnap = await db.collection('registrations').where('uid', '==', uid).get()
    if (!registrationsSnap.empty) {
      const latest = registrationsSnap.docs
        .map(doc => doc.data())
        .sort((a: any, b: any) => toMillis(b.createdAt) - toMillis(a.createdAt))[0]
      schoolName = latest?.school || null
      delegationName = latest?.delegationName || null
    }
  } catch {
    schoolName = null
  }

  if (!schoolName || !delegationName) {
    try {
      const userSnap = await db.collection('users').doc(uid).get()
      if (userSnap.exists) {
        const data = userSnap.data() || {}
        schoolName = schoolName || data.school || null
        delegationName = delegationName || data.delegationName || null
      }
    } catch {
      // ignore fallback errors
    }
  }

  const codesSnap = await db.collection('registrationCodes').where('teacherId', '==', uid).get()
  let codeData = getLatestValidTeacherCode(codesSnap.docs)
  if (!codeData) {
    const generated = await generateTeacherCode(db, uid)
    codeData = { code: generated.code, expiresAt: generated.expiresAt, createdAt: null }
  }

  const studentsSnap = await db.collection('students').where('teacherId', '==', uid).get()
  const allStudents = studentsSnap.docs.map(doc => {
    const data = doc.data() || {}
    return {
      id: doc.id,
      name: data.name || 'Unnamed student',
      committeeId: data.committeeId || null,
      status: data.status || 'approved',
    }
  })

  const students = allStudents.filter(student => student.status === 'approved')
  const pendingStudents = allStudents.filter(student => student.status === 'pending')

  return {
    schoolName,
    delegationName,
    code: codeData?.code || null,
    students,
    pendingStudents,
  }
})
