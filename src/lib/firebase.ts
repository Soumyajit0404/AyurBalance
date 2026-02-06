
// This file is intended for server-side code and is not exposed to the client.
// For client-side Firebase initialization, use `lib/firebase-client.ts`.

import { initializeApp, getApps, getApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";

const serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
};

const firebaseConfig = {
  credential: cert(serviceAccount as any),
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
};

let app: ReturnType<typeof initializeApp> | undefined;
if (getApps().length === 0) {
  try {
    app = initializeApp(firebaseConfig);
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
} else {
  app = getApp();
}

const dbAdmin = app ? getFirestore(app) : (null as unknown as ReturnType<typeof getFirestore>);
const authAdmin = app ? getAuth(app) : (null as unknown as ReturnType<typeof getAuth>);
const storageAdmin = app ? getStorage(app).bucket() : (null as unknown as ReturnType<typeof getStorage>["bucket"]);

export { dbAdmin, authAdmin, storageAdmin };
