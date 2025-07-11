'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { SoulCard } from './soul-card';
import { StoryBar } from './story-bar';
import { useSoulChainStore } from '@/lib/store';
import { SAMPLE_ENTRIES } from '@/lib/constants';
import { Loader2, Lock, LogIn, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SoulFeed() {
  const { entries, isLoading, hasMore, setEntries, setFeedLoading, user } = useSoulChainStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [showStories, setShowStories] = useState(true);

  useEffect(() => {
    // Initialize with sample data
    if (entries.length === 0) {
      setFeedLoading(true);
      setTimeout(() => {
        setEntries(SAMPLE_ENTRIES);
        setFeedLoading(false);
      }, 1000);
    }
  }, [entries.length, setEntries, setFeedLoading]);

  const handleScroll = () => {
    if (!containerRef.current || !hasMore || isLoading) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      // Load more entries
      setFeedLoading(true);
      setTimeout(() => {
        // In a real app, this would fetch more entries
        setFeedLoading(false);
      }, 1000);
    }
  };

  // STRICT ACCESS CONTROL - Filter entries based on user type
  const getVisibleEntries = () => {
    if (!user) {
      // No user logged in - show only 3 public posts
      return entries.filter(entry => !entry.isPrivate).slice(0, 3);
    }
    
    if (user.isGoogleAuth && !user.isWalletConnected) {
      // Google auth but no wallet - show only 5 public posts
      return entries.filter(entry => !entry.isPrivate).slice(0, 5);
    }
    
    // Wallet connected - show all posts
    return entries;
  };

  const visibleEntries = getVisibleEntries();
  const totalPublicEntries = entries.filter(entry => !entry.isPrivate).length;

  return (
    <div className="min-h-screen pt-24 pb-8">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-lg mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold gradient-text mb-2">
              Soul Feed
            </h1>
            <p className="text-muted-foreground">
              Anonymous thoughts from the collective consciousness
            </p>
          </div>

          {/* Stories Bar - Only for wallet users */}
          {user?.isWalletConnected && showStories && (
            <StoryBar onClose={() => setShowStories(false)} />
          )}

          {/* Google Auth Limitation Notice */}
          {user?.isGoogleAuth && !user?.isWalletConnected && (
            <motion.div 
              className="mb-6 p-4 glass-card rounded-lg border border-yellow-500/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Lock size={16} className="text-yellow-500" />
                <span className="text-sm font-medium text-yellow-500">Limited Access</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                You're viewing {visibleEntries.length} of {totalPublicEntries} public souls. Connect your wallet to view all content, create posts, and join circles.
              </p>
              <Button size="sm" className="gradient-soul w-full">
                <Wallet size={16} className="mr-2" />
                Connect Wallet for Full Access
              </Button>
            </motion.div>
          )}

          {/* No User Limitation Notice */}
          {!user && (
            <motion.div 
              className="mb-6 p-4 glass-card rounded-lg border border-blue-500/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Lock size={16} className="text-blue-500" />
                <span className="text-sm font-medium text-blue-500">Preview Mode</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                You're viewing {visibleEntries.length} of {totalPublicEntries} public souls. Sign in to access more content and features.
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="border-white/20 flex-1">
                  <LogIn size={16} className="mr-2" />
                  Continue with Google
                </Button>
                <Button size="sm" className="gradient-soul flex-1">
                  <Wallet size={16} className="mr-2" />
                  Connect Wallet
                </Button>
              </div>
            </motion.div>
          )}

          <div
            ref={containerRef}
            className="space-y-6 max-h-[80vh] overflow-y-auto hide-scrollbar"
            onScroll={handleScroll}
          >
            {visibleEntries.map((entry, index) => (
              <SoulCard key={entry.id} entry={entry} index={index} />
            ))}
            
            {/* Limited Access Message */}
            {(!user || (user?.isGoogleAuth && !user?.isWalletConnected)) && entries.length > visibleEntries.length && (
              <motion.div 
                className="text-center p-6 glass-card rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Lock size={24} className="mx-auto mb-2 text-muted-foreground" />
                <h3 className="font-semibold mb-2">
                  {!user 
                    ? 'Sign in to see more souls' 
                    : 'Connect your wallet to see more souls'
                  }
                </h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  {!user 
                    ? `${totalPublicEntries - visibleEntries.length} more souls are waiting for you`
                    : `${totalPublicEntries - visibleEntries.length} more public souls plus private content available`
                  }
                </p>
                <div className="flex gap-2 justify-center">
                  {!user ? (
                    <>
                      <Button variant="outline" className="border-white/20">
                        <LogIn size={16} className="mr-2" />
                        Sign In
                      </Button>
                      <Button className="gradient-soul">
                        <Wallet size={16} className="mr-2" />
                        Connect Wallet
                      </Button>
                    </>
                  ) : (
                    <Button className="gradient-soul">
                      <Wallet size={16} className="mr-2" />
                      Connect Wallet
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
            
            {isLoading && (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin text-muted-foreground" size={24} />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}