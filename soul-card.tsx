'use client';

import { motion } from 'framer-motion';
import { Clock, Lock, Users, Bookmark, Share } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { SoulEntry } from '@/lib/types';
import { MOOD_CONFIGS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { useSoulChainStore } from '@/lib/store';
import { useState } from 'react';

interface SoulCardProps {
  entry: SoulEntry;
  index: number;
}

export function SoulCard({ entry, index }: SoulCardProps) {
  const { user, addSavedPost, removeSavedPost, savedPosts } = useSoulChainStore();
  const [isBookmarked, setIsBookmarked] = useState(
    savedPosts.some(post => post.id === entry.id)
  );
  const [isSharing, setIsSharing] = useState(false);

  const moodConfig = MOOD_CONFIGS[entry.mood];
  const timeAgo = formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true });

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user?.isWalletConnected) {
      alert('Connect your wallet to save posts');
      return;
    }

    if (isBookmarked) {
      removeSavedPost(entry.id);
      setIsBookmarked(false);
    } else {
      addSavedPost(entry);
      setIsBookmarked(true);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    setIsSharing(true);
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Soul from ${moodConfig.label}`,
          text: entry.isPrivate ? 'A private soul was shared' : entry.content,
          url: window.location.href,
        });
      } else {
        // Fallback to clipboard
        const shareText = entry.isPrivate 
          ? 'Check out this soul on SoulChain' 
          : `"${entry.content}" - Shared anonymously on SoulChain`;
        await navigator.clipboard.writeText(shareText);
        alert('Copied to clipboard!');
      }
    } catch (error) {
      console.error('Share failed:', error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <motion.div
      className="w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <div className={`glass-card p-6 rounded-2xl bg-gradient-to-br ${entry.bgColor || 'from-slate-800 to-slate-900'} relative overflow-hidden`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white to-transparent rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white to-transparent rounded-full blur-xl" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${moodConfig.color} flex items-center justify-center text-lg`}>
                {entry.emoji}
              </div>
              <div>
                <span className="text-sm font-medium text-white/90">
                  {moodConfig.label}
                </span>
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <Clock size={12} />
                  {timeAgo}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {entry.isPrivate && (
                <Lock size={14} className="text-white/60" />
              )}
              {entry.circleId && (
                <Users size={14} className="text-white/60" />
              )}
            </div>
          </div>

          {/* Content */}
          <div className="mb-4">
            {entry.isPrivate ? (
              <div className="flex items-center gap-2 text-white/60">
                <Lock size={16} />
                <span className="text-sm italic">🔒 Private Soul</span>
              </div>
            ) : (
              <p className="text-white/90 leading-relaxed text-sm">
                {entry.content}
              </p>
            )}
          </div>

          {/* Action Buttons - Only Save and Share */}
          {user?.isWalletConnected && (
            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  disabled={isSharing}
                  className="p-2 hover:bg-white/10 text-white/70 hover:text-white"
                >
                  <Share size={16} />
                </Button>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className={`p-2 hover:bg-white/10 transition-colors ${
                  isBookmarked 
                    ? 'text-yellow-400 hover:text-yellow-300' 
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <Bookmark size={16} className={isBookmarked ? 'fill-current' : ''} />
              </Button>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-white/50 mt-3">
            <span>{entry.author.slice(0, 6)}...{entry.author.slice(-4)}</span>
            {entry.circleId && (
              <span className="glass-card px-2 py-1 rounded-full">
                Soul Circle
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}