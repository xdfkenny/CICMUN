import admin from 'firebase-admin'

let app: admin.app.App | null = null

export const getAdminApp = () => {
  if (app) return app
  const config = useRuntimeConfig()
  const projectId = config.firebaseAdmin.projectId
  const clientEmail = config.firebaseAdmin.clientEmail
  const privateKey = config.firebaseAdmin.privateKey?.replace(/\\n/g, '\n')

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Firebase Admin SDK is not configured. Set runtimeConfig.firebaseAdmin.')
  }

  app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  })

  return app
}

export const getAdminAuth = () => getAdminApp().auth()
export const getAdminDb = () => getAdminApp().firestore()
