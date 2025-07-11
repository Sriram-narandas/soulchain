'use client';

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, User } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only if config is available
let app: any;
let auth: any;
let googleProvider: any;

try {
  if (firebaseConfig.apiKey && typeof window !== 'undefined') {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.addScope('email');
    googleProvider.addScope('profile');
  }
} catch (error) {
  console.warn('Firebase initialization failed:', error);
}

export class GoogleAuthService {
  static async signInWithGoogle() {
    if (!auth || !googleProvider) {
      throw new Error('Firebase not configured. Please add Firebase environment variables to .env.local');
    }
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result;
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in was cancelled');
      }
      if (error.code === 'auth/popup-blocked') {
        throw new Error('Popup was blocked by browser. Please allow popups and try again.');
      }
      throw error;
    }
  }

  static async signOut() {
    if (!auth) {
      throw new Error('Firebase not configured');
    }
    
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  static getCurrentUser(): User | null {
    if (!auth) return null;
    return auth.currentUser;
  }

  static onAuthStateChanged(callback: (user: User | null) => void) {
    if (!auth) {
      // Return a no-op function if auth is not available
      return () => {};
    }
    return auth.onAuthStateChanged(callback);
  }

  static isConfigured(): boolean {
    return !!auth && !!googleProvider && typeof window !== 'undefined';
  }
}