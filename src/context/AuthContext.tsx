import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithCredential,
  type User,
} from 'firebase/auth';
import { useIdTokenAuthRequest } from 'expo-auth-session/providers/google';
import type { AuthSessionResult } from 'expo-auth-session';
import {
  googleAndroidClientId,
  googleIosClientId,
  googleWebClientId,
  isFirebaseConfigured,
} from '../config/firebaseConfig';
import { getFirebaseAuth, setAuthPersistenceForNextSignIn } from '../services/firebase';
import { onUserSignedIn } from '../services/userProfile';

export type SignInPersistenceOptions = { staySignedIn?: boolean };

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  firebaseConfigured: boolean;
  devBypass: boolean;
  setDevBypass: (v: boolean) => void;
  signInEmail: (
    email: string,
    password: string,
    options?: SignInPersistenceOptions
  ) => Promise<void>;
  signUpEmail: (
    email: string,
    password: string,
    options?: SignInPersistenceOptions
  ) => Promise<void>;
  signOutUser: () => Promise<void>;
  signInWithGoogle: (
    options?: SignInPersistenceOptions
  ) => Promise<AuthSessionResult | void>;
  googleSignInAvailable: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/** Native platforms require ios/android client IDs; empty env becomes "" and OAuth omits client_id. Fall back to Web ID for dev until platform OAuth clients are set. */
function resolveGoogleClientIds() {
  const web = googleWebClientId.trim();
  return {
    webClientId: web,
    iosClientId: (googleIosClientId || web).trim(),
    androidClientId: (googleAndroidClientId || web).trim(),
  };
}

function isValidGoogleWebClientId(id: string): boolean {
  return id.length > 0 && id.includes('.apps.googleusercontent.com');
}

function GoogleAuthIntegration({
  enabled,
  promptRef,
  googleStaySignedInRef,
}: {
  enabled: boolean;
  promptRef: React.MutableRefObject<(() => Promise<AuthSessionResult>) | null>;
  googleStaySignedInRef: React.MutableRefObject<boolean>;
}) {
  const ids = useMemo(() => resolveGoogleClientIds(), []);
  if (__DEV__ && ids.webClientId && !isValidGoogleWebClientId(ids.webClientId)) {
    console.warn(
      '[Auth] EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID should end with .apps.googleusercontent.com — Google will return invalid_client.'
    );
  }
  const [_, response, promptAsync] = useIdTokenAuthRequest(
    {
      webClientId: ids.webClientId,
      iosClientId: ids.iosClientId,
      androidClientId: ids.androidClientId,
    },
    { scheme: 'levels' }
  );

  const lastIdTokenRef = useRef<string | null>(null);

  useEffect(() => {
    promptRef.current = promptAsync;
  }, [promptAsync, promptRef]);

  useEffect(() => {
    if (!enabled || !response || response.type !== 'success') return;
    const idToken = response.params.id_token;
    if (!idToken || lastIdTokenRef.current === idToken) return;
    lastIdTokenRef.current = idToken;
    const auth = getFirebaseAuth();
    const cred = GoogleAuthProvider.credential(idToken);
    setAuthPersistenceForNextSignIn(auth, googleStaySignedInRef.current)
      .then(() => signInWithCredential(auth, cred))
      .catch((e) => {
        console.warn('Google sign-in', e);
      });
  }, [enabled, response, googleStaySignedInRef]);

  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const configured = isFirebaseConfigured();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [devBypass, setDevBypass] = useState(false);
  const promptRef = useRef<(() => Promise<AuthSessionResult>) | null>(null);
  const googleStaySignedInRef = useRef(true);

  const googleConfigured =
    (Boolean(googleWebClientId?.trim()) && isValidGoogleWebClientId(googleWebClientId.trim())) ||
    Boolean(googleIosClientId?.trim()) ||
    Boolean(googleAndroidClientId?.trim());

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }
    // Stale true from Fast Refresh while Firebase is configured would skip login via dev-bypass branch.
    setDevBypass(false);
    const auth = getFirebaseAuth();
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          await onUserSignedIn(u);
        } catch (e) {
          console.warn('onUserSignedIn', e);
        }
      }
      setLoading(false);
    });
    return unsub;
  }, [configured]);

  const signInEmail = useCallback(
    async (email: string, password: string, options?: SignInPersistenceOptions) => {
      if (!configured) throw new Error('Firebase not configured');
      const auth = getFirebaseAuth();
      const staySignedIn = options?.staySignedIn !== false;
      await setAuthPersistenceForNextSignIn(auth, staySignedIn);
      await signInWithEmailAndPassword(auth, email.trim(), password);
    },
    [configured]
  );

  const signUpEmail = useCallback(
    async (email: string, password: string, options?: SignInPersistenceOptions) => {
      if (!configured) throw new Error('Firebase not configured');
      const auth = getFirebaseAuth();
      const staySignedIn = options?.staySignedIn !== false;
      await setAuthPersistenceForNextSignIn(auth, staySignedIn);
      await createUserWithEmailAndPassword(auth, email.trim(), password);
    },
    [configured]
  );

  const signOutUser = useCallback(async () => {
    if (!configured) return;
    await signOut(getFirebaseAuth());
  }, [configured]);

  const signInWithGoogle = useCallback(
    async (options?: SignInPersistenceOptions) => {
      if (!configured || !googleConfigured || !promptRef.current) {
        return;
      }
      googleStaySignedInRef.current = options?.staySignedIn !== false;
      return promptRef.current();
    },
    [configured, googleConfigured]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      firebaseConfigured: configured,
      devBypass,
      setDevBypass,
      signInEmail,
      signUpEmail,
      signOutUser,
      signInWithGoogle,
      googleSignInAvailable: configured && googleConfigured,
    }),
    [
      user,
      loading,
      configured,
      devBypass,
      signInEmail,
      signUpEmail,
      signOutUser,
      signInWithGoogle,
      googleConfigured,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {configured && googleConfigured ? (
        <GoogleAuthIntegration
          enabled={configured}
          promptRef={promptRef}
          googleStaySignedInRef={googleStaySignedInRef}
        />
      ) : null}
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
