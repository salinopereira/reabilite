import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

let app: App | null = null;
let adminDb: Firestore | null = null;
let adminAuth: Auth | null = null;

if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    if (getApps().length === 0) {
        try {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
            app = initializeApp({
                credential: cert(serviceAccount),
            });
            console.log('Firebase Admin SDK initialized');
        } catch (error) {
            console.error('Firebase Admin Initialization Error:', error);
        }
    } else {
        app = getApps()[0];
    }

    if (app) {
        adminDb = getFirestore(app);
        adminAuth = getAuth(app);
    }
}

export { app, adminDb, adminAuth };
