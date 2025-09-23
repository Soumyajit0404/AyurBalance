import admin from 'firebase-admin';

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

if (!admin.apps.length) {
  try {
    // Check if essential service account details are present
    if (serviceAccount.project_id) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as any),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
    } else {
        console.warn("Firebase admin initialization skipped: project_id is missing. Please set NEXT_PUBLIC_FIREBASE_PROJECT_ID environment variable.");
    }
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

let dbAdmin: admin.firestore.Firestore, 
    authAdmin: admin.auth.Auth, 
    storageAdmin: admin.storage.Bucket;

// Only export services if the app was initialized
if (admin.apps.length > 0) {
    dbAdmin = admin.firestore();
    authAdmin = admin.auth();
    storageAdmin = admin.storage().bucket();
} else {
    // Provide dummy objects to prevent app from crashing on import if initialization failed
    dbAdmin = {} as admin.firestore.Firestore;
    authAdmin = {} as admin.auth.Auth;
    storageAdmin = {} as admin.storage.Bucket;
}


export { dbAdmin, authAdmin, storageAdmin };
