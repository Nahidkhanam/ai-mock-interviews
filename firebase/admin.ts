import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function initFirebaseAdmin() {
  const apps = getApps();

  // TEMPORARY DEBUG LOGGING — remove after fixing
  console.log("DEBUG projectId present:", !!process.env.FIREBASE_PROJECT_ID);
  console.log("DEBUG projectId value:", process.env.FIREBASE_PROJECT_ID);
  console.log("DEBUG clientEmail present:", !!process.env.FIREBASE_CLIENT_EMAIL);
  console.log("DEBUG clientEmail value:", process.env.FIREBASE_CLIENT_EMAIL);
  console.log("DEBUG privateKey present:", !!process.env.FIREBASE_PRIVATE_KEY);
  console.log("DEBUG privateKey length:", process.env.FIREBASE_PRIVATE_KEY?.length);
  console.log("DEBUG privateKey starts with:", process.env.FIREBASE_PRIVATE_KEY?.substring(0, 30));
  console.log("DEBUG privateKey ends with:", process.env.FIREBASE_PRIVATE_KEY?.substring(process.env.FIREBASE_PRIVATE_KEY.length - 30));
  console.log("DEBUG privateKey contains literal \\n:", process.env.FIREBASE_PRIVATE_KEY?.includes("\\n"));

  if (!apps.length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  }

  return {
    auth: getAuth(),
    db: getFirestore(),
  };
}

export const { auth, db } = initFirebaseAdmin();