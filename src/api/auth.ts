import { auth } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

export const login = async (email: string, password: string) => {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const accessToken = await credential.user.getIdToken();
    return {
      accessToken,
      user: {
        id: credential.user.uid,
        email: credential.user.email ?? '',
      },
    };
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(error?.message || 'Login failed');
  }
};

export const register = async (email: string, password: string) => {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    return { email: credential.user.email ?? '' };
  } catch (error: any) {
    throw new Error(error?.message || 'Registration failed');
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error?.message || 'Logout failed');
  }
};
