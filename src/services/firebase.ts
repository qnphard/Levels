import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import * as firebaseAuth from 'firebase/auth';
import type { Auth, Persistence } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseConfig, isFirebaseConfigured } from '../config/firebaseConfig';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

function getFirebaseApp(): FirebaseApp {
  if (!isFirebaseConfigured()) {
    throw new Error(
      'Firebase is not configured. Set EXPO_PUBLIC_FIREBASE_* in .env (see .env.example).'
    );
  }
  if (!app) {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  }
  return app;
}

export function getFirebaseAuth(): Auth {
  if (auth) return auth;
  const firebaseApp = getFirebaseApp();
  const getRnPersistence = (firebaseAuth as { getReactNativePersistence?: (s: typeof AsyncStorage) => Persistence })
    .getReactNativePersistence;

  try {
    if (typeof getRnPersistence === 'function') {
      auth = firebaseAuth.initializeAuth(firebaseApp, {
        persistence: getRnPersistence(AsyncStorage),
      });
    } else {
      auth = firebaseAuth.getAuth(firebaseApp);
    }
  } catch (e: unknown) {
    const err = e as { code?: string };
    if (err?.code === 'auth/already-initialized') {
      auth = firebaseAuth.getAuth(firebaseApp);
    } else {
      throw e;
    }
  }
  return auth!;
}

/**
 * Call before email/password or Google credential sign-in.
 * When `staySignedIn` is false, the session is not persisted across app restarts (in-memory only).
 */
export async function setAuthPersistenceForNextSignIn(
  auth: Auth,
  staySignedIn: boolean
): Promise<void> {
  const getRnPersistence = (
    firebaseAuth as { getReactNativePersistence?: (s: typeof AsyncStorage) => Persistence }
  ).getReactNativePersistence;

  if (staySignedIn) {
    if (typeof getRnPersistence === 'function') {
      await firebaseAuth.setPersistence(auth, getRnPersistence(AsyncStorage));
    }
    return;
  }
  await firebaseAuth.setPersistence(auth, firebaseAuth.inMemoryPersistence);
}

export function getFirestoreDb(): Firestore {
  if (!db) {
    db = getFirestore(getFirebaseApp());
  }
  return db;
}

export { getFirebaseApp };
