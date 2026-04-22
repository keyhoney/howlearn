import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

function readPublicEnv(key: string): string | undefined {
  // OpenNext/Workers 클라이언트 번들에서 process/env 객체가 없을 수 있으므로 안전 가드
  if (typeof process === "undefined" || !process?.env) return undefined;
  const value = process.env[key];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function getFirebaseConfig() {
  const apiKey = readPublicEnv("NEXT_PUBLIC_FIREBASE_API_KEY");
  const authDomain = readPublicEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN");
  const projectId = readPublicEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID");
  const storageBucket = readPublicEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET");
  const messagingSenderId = readPublicEnv("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID");
  const appId = readPublicEnv("NEXT_PUBLIC_FIREBASE_APP_ID");
  if (!apiKey || !authDomain || !projectId || !appId) return null;
  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket: storageBucket || undefined,
    messagingSenderId: messagingSenderId || undefined,
    appId,
  };
}

let app: FirebaseApp | null = null;
let firestore: Firestore | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === "undefined") return null;
  if (app) return app;
  const config = getFirebaseConfig();
  if (!config) return null;
  if (getApps().length > 0) {
    app = getApps()[0] as FirebaseApp;
    return app;
  }
  app = initializeApp(config);
  return app;
}

export function getFirestoreInstance(): Firestore | null {
  if (typeof window === "undefined") return null;
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;
  if (!firestore) firestore = getFirestore(firebaseApp);
  return firestore;
}

export function isFirebaseConfigured(): boolean {
  return getFirebaseConfig() !== null;
}
