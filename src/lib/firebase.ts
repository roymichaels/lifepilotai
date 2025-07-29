import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getRuntimeConfig } from './runtimeConfig';

const {
  firebase: {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
  }
} = getRuntimeConfig();

// Ensure all required variables are present and report any that are missing
const firebaseVars = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
};

const missingKeys = Object.entries(firebaseVars)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingKeys.length > 0) {
  throw new Error(
    `Missing Firebase configuration keys: ${missingKeys.join(', ')}. Please provide them at runtime.`
  );
}

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
};

// Avoid re-initialising the Firebase app in case this file is imported multiple
// times during hot module reloads or testing.
export const app =
  getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
