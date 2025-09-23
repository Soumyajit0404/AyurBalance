// This file is intended for server-side code and is not exposed to the client.
// For client-side Firebase initialization, use `lib/firebase-client.ts`.

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";
// It's assumed you have your service account key file in the root directory
// and it's added to .gitignore.
import serviceAccount from "../../serviceAccountKey.json";

const firebaseConfig = {
  credential: initializeApp(serviceAccount),
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
};

let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const dbAdmin = getFirestore(app);
const authAdmin = getAuth(app);
const storageAdmin = getStorage(app).bucket();

export { dbAdmin, authAdmin, storageAdmin };
