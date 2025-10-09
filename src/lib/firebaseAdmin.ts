import admin from 'firebase-admin';

let adminDb: admin.firestore.Firestore | null = null;
let adminAuth: admin.auth.Auth | null = null;

if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  if (admin.apps.length === 0) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('Firebase Admin SDK initialized');
      adminDb = admin.firestore();
      adminAuth = admin.auth();
    } catch (error) {
      console.error('Firebase Admin Initialization Error:', error);
    }
  } else {
    adminDb = admin.firestore();
    adminAuth = admin.auth();
  }
}

export { adminDb, adminAuth };
