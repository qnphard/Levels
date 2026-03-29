import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { getFirestoreDb } from './firebase';
import { useOnboardingStore } from '../store/onboardingStore';

const USERS = 'users';

/** Auth can fire before zustand persist rehydrates; applying sign-in before hydrate lets AsyncStorage overwrite isComplete. */
function waitForOnboardingHydration(): Promise<void> {
  if (useOnboardingStore.persist.hasHydrated()) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const unsub = useOnboardingStore.persist.onFinishHydration(() => {
      unsub?.();
      resolve();
    });
  });
}

export async function ensureUserProfile(user: User): Promise<void> {
  const db = getFirestoreDb();
  const ref = doc(db, USERS, user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      email: user.email ?? null,
      displayName: user.displayName ?? null,
      photoURL: user.photoURL ?? null,
      createdAt: serverTimestamp(),
      hasCompletedFirstRunOnboarding: false,
    });
  }
}

export async function setFirstRunOnboardingComplete(
  uid: string,
  complete: boolean
): Promise<void> {
  const db = getFirestoreDb();
  await setDoc(
    doc(db, USERS, uid),
    { hasCompletedFirstRunOnboarding: complete },
    { merge: true }
  );
}

/** Hydrate local onboarding completion from Firestore (source of truth across devices). */
export async function syncOnboardingFromFirestore(uid: string): Promise<void> {
  try {
    const db = getFirestoreDb();
    const snap = await getDoc(doc(db, USERS, uid));
    if (snap.exists()) {
      const v = snap.data()?.hasCompletedFirstRunOnboarding;
      if (typeof v === 'boolean') {
        useOnboardingStore.setState({ isComplete: v });
      }
    }
  } catch {
    // offline / rules — ignore
  }
}

export async function onUserSignedIn(user: User): Promise<void> {
  await waitForOnboardingHydration();
  const prev = useOnboardingStore.getState().onboardingUserId;
  if (prev !== user.uid) {
    useOnboardingStore.setState({
      onboardingUserId: user.uid,
      isComplete: false,
      hasCompletedIntentionPrompt: false,
      intention: null,
      intentionPromptSnoozeDateLocal: null,
    });
  }
  await ensureUserProfile(user);
  await syncOnboardingFromFirestore(user.uid);
}
