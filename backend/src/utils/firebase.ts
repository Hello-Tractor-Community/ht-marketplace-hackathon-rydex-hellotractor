import { initializeApp, cert } from "firebase-admin/app";

const firebaseApp = initializeApp({
  credential: cert({
    clientEmail: process.env.FB_CLIENT_EMAIL,
    privateKey: process.env.FB_PRIVATE_KEY,
    projectId: process.env.FB_PROJECT_ID,
  }),
  storageBucket: process.env.FB_STORAGE_BUCKET,
});

export default firebaseApp;
