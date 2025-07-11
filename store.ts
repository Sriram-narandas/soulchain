'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, FeedState, CircleState, SoulEntry, SoulCircle, User } from './types';

interface SoulChainStore extends AuthState, FeedState, CircleState {
  // Auth actions
  setUser: (user: User | null) => void;
  setAuthLoading: (loading: boolean) => void;
  setAuthError: (error: string | null) => void;
  
  // Feed actions
  setEntries: (entries: SoulEntry[]) => void;
  addEntry: (entry: SoulEntry) => void;
  setFeedLoading: (loading: boolean) => void;
  setHasMore: (hasMore: boolean) => void;
  setFeedError: (error: string | null) => void;
  
  // Circle actions
  setCircles: (circles: SoulCircle[]) => void;
  addCircle: (circle: SoulCircle) => void;
  setCurrentCircle: (circle: SoulCircle | null) => void;
  setCircleLoading: (loading: boolean) => void;
  setCircleError: (error: string | null) => void;
  
  // Saved posts
  savedPosts: SoulEntry[];
  addSavedPost: (entry: SoulEntry) => void;
  removeSavedPost: (entryId: string) => void;
  
  // UI state
  isPostModalOpen: boolean;
  setPostModalOpen: (open: boolean) => void;
  
  selectedCircleId: string | null;
  setSelectedCircleId: (id: string | null) => void;
  
  // Utils
  reset: () => void;
}

export const useSoulChainStore = create<SoulChainStore>()(
  persist(
    (set, get) => ({
      // Auth state
      user: null,
      isLoading: false,
      error: null,
      
      // Feed state
      entries: [],
      hasMore: true,
      
      // Circle state
      circles: [],
      currentCircle: null,
      
      // Saved posts
      savedPosts: [],
      
      // UI state
      isPostModalOpen: false,
      selectedCircleId: null,
      
      // Auth actions
      setUser: (user) => {
        const currentUser = get().user;
        // Clear saved posts if user logs out or changes
        if (!user || (currentUser && currentUser.address !== user.address)) {
          set({ savedPosts: [] });
        }
        // Prevent infinite loops by checking if user actually changed
        if (JSON.stringify(currentUser) !== JSON.stringify(user)) {
          set({ user });
        }
      },
      setAuthLoading: (loading) => set({ isLoading: loading }),
      setAuthError: (error) => set({ error }),
      
      // Feed actions
      setEntries: (entries) => set({ entries }),
      addEntry: (entry) => set((state) => ({ entries: [entry, ...state.entries] })),
      setFeedLoading: (loading) => set({ isLoading: loading }),
      setHasMore: (hasMore) => set({ hasMore }),
      setFeedError: (error) => set({ error }),
      
      // Circle actions
      setCircles: (circles) => set({ circles }),
      addCircle: (circle) => set((state) => ({ circles: [...state.circles, circle] })),
      setCurrentCircle: (circle) => set({ currentCircle: circle }),
      setCircleLoading: (loading) => set({ isLoading: loading }),
      setCircleError: (error) => set({ error }),
      
      // Saved posts actions
      addSavedPost: (entry) => set((state) => ({ 
        savedPosts: [entry, ...state.savedPosts.filter(p => p.id !== entry.id)]
      })),
      removeSavedPost: (entryId) => set((state) => ({ 
        savedPosts: state.savedPosts.filter(p => p.id !== entryId)
      })),
      
      // UI actions
      setPostModalOpen: (open) => set({ isPostModalOpen: open }),
      setSelectedCircleId: (id) => set({ selectedCircleId: id }),
      
      // Utils
      reset: () => set({
        user: null,
        isLoading: false,
        error: null,
        entries: [],
        hasMore: true,
        circles: [],
        currentCircle: null,
        savedPosts: [],
        isPostModalOpen: false,
        selectedCircleId: null,
      }),
    }),
    {
      name: 'soulchain-store',
      partialize: (state) => ({
        user: state.user,
        entries: state.entries,
        circles: state.circles,
        savedPosts: state.savedPosts,
      }),
      skipHydration: true,
    }
  )
);

// Hydrate the store on client side
if (typeof window !== 'undefined') {
  useSoulChainStore.persist.rehydrate();
}