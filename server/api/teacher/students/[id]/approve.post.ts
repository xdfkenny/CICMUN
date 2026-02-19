import { FieldValue } from 'firebase-admin/firestore'
import { getAdminDb } from '../../../../utils/firebaseAdmin'
import { requireTeacherAccess } from '../../../../utils/teacherAuth'

export default defineEventHandler(async (event) => {
  const { uid, role } = await requireTeacherAccess(event)
  const studentId = getRouterParam(event, 'id')
  if (!studentId) {
    throw createError({ statusCode: 400, message: 'Missing student id' })
  }

  const db = getAdminDb()
  const studentRef = db.collection('students').doc(studentId)
  const studentSnap = await studentRef.get()
  if (!studentSnap.exists) {
    throw createError({ statusCode: 404, message: 'Student not found' })
  }

  const studentData = studentSnap.data() || {}
  if (role === 'teacher' && studentData.teacherId !== uid) {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  await studentRef.set({
    status: 'approved',
    updatedAt: FieldValue.serverTimestamp(),
  }, { merge: true })

  return { ok: true }
})
