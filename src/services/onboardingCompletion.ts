import { useOnboardingStore } from '../store/onboardingStore';
import { isFirebaseConfigured } from '../config/firebaseConfig';
import { getFirebaseAuth } from './firebase';
import { setFirstRunOnboardingComplete } from './userProfile';

/** Call everywhere we previously called `completeOnboarding()` for the first-run flow. */
export async function completeFirstRunOnboardingFlow(): Promise<void> {
  useOnboardingStore.getState().completeOnboarding();
  if (!isFirebaseConfigured()) return;
  const u = getFirebaseAuth().currentUser;
  if (u) {
    try {
      await setFirstRunOnboardingComplete(u.uid, true);
    } catch {
      // Firestore may fail offline; local store still updated
    }
  }
}
