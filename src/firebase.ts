import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";

// Configured credentials supplied by the user
export const firebaseConfig = {
  apiKey: "AIzaSyDSafhkY3XbvZ6rI0rB8xtlhBd5z3AcuNc",
  authDomain: "dev-nazrul.firebaseapp.com",
  projectId: "dev-nazrul",
  storageBucket: "dev-nazrul.firebasestorage.app",
  messagingSenderId: "321592111233",
  appId: "1:321592111233:web:d068868f9bb2953efe9d80",
  measurementId: "G-FW7D7KJ0JB"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Strict Firestore Error Handling Wrapper required by verification tools
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
    },
    operationType,
    path
  };
  console.error("Firestore Hardened Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Proactive Connection Validation
async function testConnection() {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
    console.log("Firebase Connection Active!");
  } catch (error) {
    if (error instanceof Error && error.message.includes("offline")) {
      console.warn("Firestore reports client is offline. Verify configuration or network credentials.");
    }
  }
}
testConnection();
