'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Chrome, LogOut } from 'lucide-react';
import { useSoulChainStore } from '@/lib/store';
import { GoogleAuthService } from '@/lib/firebase';

export function GoogleAuthButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useSoulChainStore();

  useEffect(() => {
    // Only set up auth listener if Firebase is configured
    if (!GoogleAuthService.isConfigured()) {
      return;
    }

    // Listen for auth state changes
    const unsubscribe = GoogleAuthService.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser && !user?.isWalletConnected) {
        setUser({
          address: firebaseUser.uid,
          isWalletConnected: false,
          isGoogleAuth: true,
          joinedAt: Date.now(),
          soulBalance: 0,
          streak: 0,
          totalEntries: 0,
          joinedCircles: [],
          moodStats: {},
        });
      } else if (!firebaseUser && user?.isGoogleAuth) {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [setUser, user?.isWalletConnected, user?.isGoogleAuth]);

  const handleGoogleAuth = async () => {
    if (!GoogleAuthService.isConfigured()) {
      alert('Google Auth is not configured. Please add Firebase environment variables to enable Google sign-in.');
      return;
    }

    setIsLoading(true);
    try {
      await GoogleAuthService.signInWithGoogle();
      // User state will be updated via the auth state listener
    } catch (error: any) {
      console.error('Google auth failed:', error);
      if (error.message !== 'Sign-in was cancelled') {
        alert('Google sign-in failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await GoogleAuthService.signOut();
      // User state will be updated via the auth state listener
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  if (user?.isGoogleAuth) {
    return (
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2 glass-card px-3 py-2 rounded-lg">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium">Google User</span>
        </div>
        <Button
          onClick={handleSignOut}
          variant="ghost"
          size="sm"
          className="hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut size={16} />
        </Button>
      </div>
    );
  }

  return (
    <Button 
      onClick={handleGoogleAuth}
      disabled={isLoading}
      variant="outline"
      className="border-white/10 hover:bg-white/5"
    >
      <Chrome size={18} />
      <span className="hidden sm:inline ml-2">
        {isLoading ? 'Signing in...' : 'Continue with Google'}
      </span>
    </Button>
  );
}