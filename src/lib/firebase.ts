import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Extract Firebase environment variables
const {
  VITE_FIREBASE_API_KEY,
  VITE_FIREBASE_AUTH_DOMAIN,
  VITE_FIREBASE_PROJECT_ID,
  VITE_FIREBASE_STORAGE_BUCKET,
  VITE_FIREBASE_MESSAGING_SENDER_ID,
  VITE_FIREBASE_APP_ID,
} = import.meta.env;

// Ensure all required variables are present
if (
  !VITE_FIREBASE_API_KEY ||
  !VITE_FIREBASE_AUTH_DOMAIN ||
  !VITE_FIREBASE_PROJECT_ID ||
  !VITE_FIREBASE_APP_ID
) {
  throw new Error(
    'Missing Firebase configuration. Please check your .env file.'
  );
}

const firebaseConfig = {
  apiKey: VITE_FIREBASE_API_KEY,
  authDomain: VITE_FIREBASE_AUTH_DOMAIN,
  projectId: VITE_FIREBASE_PROJECT_ID,
  storageBucket: VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: VITE_FIREBASE_APP_ID,
};

// Avoid re-initialising the Firebase app in case this file is imported multiple
// times during hot module reloads or testing.
export const app =
  getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
