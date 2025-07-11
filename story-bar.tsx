'use client';

import { motion } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSoulChainStore } from '@/lib/store';

interface StoryBarProps {
  onClose: () => void;
}

const SAMPLE_STORIES = [
  { id: '1', author: 'Your Story', avatar: '🌟', hasStory: false },
  { id: '2', author: 'Anonymous', avatar: '🌙', hasStory: true },
  { id: '3', author: 'Soul Seeker', avatar: '🦋', hasStory: true },
  { id: '4', author: 'Dreamer', avatar: '✨', hasStory: true },
  { id: '5', author: 'Wanderer', avatar: '🌸', hasStory: true },
  { id: '6', author: 'Mystic', avatar: '🔮', hasStory: true },
];

export function StoryBar({ onClose }: StoryBarProps) {
  const { setPostModalOpen } = useSoulChainStore();

  return (
    <motion.div
      className="mb-6 glass-card rounded-2xl p-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Soul Stories</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X size={16} />
        </Button>
      </div>
      
      <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
        {SAMPLE_STORIES.map((story, index) => (
          <motion.div
            key={story.id}
            className="flex-shrink-0 text-center cursor-pointer"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              if (!story.hasStory) {
                setPostModalOpen(true);
              }
            }}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-2 relative ${
              story.hasStory 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 p-0.5' 
                : 'glass-card border-2 border-dashed border-white/30'
            }`}>
              {story.hasStory ? (
                <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                  {story.avatar}
                </div>
              ) : (
                <Plus size={24} className="text-muted-foreground" />
              )}
            </div>
            <p className="text-xs text-muted-foreground max-w-[64px] truncate">
              {story.author}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}