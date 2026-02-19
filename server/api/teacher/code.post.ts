import { getAdminDb } from '../../utils/firebaseAdmin'
import { requireTeacherAccess } from '../../utils/teacherAuth'
import { generateTeacherCode } from '../../utils/teacherCodes'

export default defineEventHandler(async (event) => {
  const { uid } = await requireTeacherAccess(event)
  const db = getAdminDb()
  const generated = await generateTeacherCode(db, uid)
  return { code: generated.code }
})
