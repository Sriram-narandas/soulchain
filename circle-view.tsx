'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, MessageSquare, Trophy, Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SoulCard } from '@/components/feed/soul-card';
import { useSoulChainStore } from '@/lib/store';
import { SAMPLE_CIRCLE_ENTRIES } from '@/lib/constants';
import { SoulEntry } from '@/lib/types';

interface CircleViewProps {
  circleId: string;
  onBack: () => void;
}

export function CircleView({ circleId, onBack }: CircleViewProps) {
  const { circles, user, setPostModalOpen } = useSoulChainStore();
  const [circleEntries, setCircleEntries] = useState<SoulEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const circle = circles.find(c => c.id === circleId);

  useEffect(() => {
    // Load circle-specific entries
    setIsLoading(true);
    setTimeout(() => {
      const entries = SAMPLE_CIRCLE_ENTRIES[circleId] || [];
      setCircleEntries(entries);
      setIsLoading(false);
    }, 1000);
  }, [circleId]);

  if (!circle) {
    return (
      <div className="min-h-screen pt-24 pb-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Circle not found</h2>
          <Button onClick={onBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen pt-24 pb-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="mb-4 hover:bg-white/5"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Circles
            </Button>

            {/* Circle Banner */}
            <div className="relative h-48 rounded-2xl overflow-hidden mb-6">
              <img
                src={circle.bannerImage}
                alt={circle.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-end justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                      {circle.name}
                    </h1>
                    <p className="text-white/90 mb-4 max-w-2xl">
                      {circle.description}
                    </p>
                    
                    {/* Stats */}
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-white/80">
                        <Users size={16} />
                        <span className="text-sm">{formatNumber(circle.memberCount)} members</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/80">
                        <MessageSquare size={16} />
                        <span className="text-sm">{formatNumber(circle.entryCount)} souls</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/80">
                        <Trophy size={16} />
                        <span className="text-sm">{circle.soulScore} soul score</span>
                      </div>
                    </div>
                  </div>

                  {user?.isWalletConnected && (
                    <Button 
                      onClick={() => setPostModalOpen(true)}
                      className="gradient-soul hover:opacity-90 transition-opacity"
                    >
                      <Plus size={16} className="mr-2" />
                      Share Soul
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {circle.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Rules */}
            <div className="glass-card p-6 rounded-2xl mb-8">
              <h3 className="font-semibold mb-4">Community Guidelines</h3>
              <ul className="space-y-2">
                {circle.rules.map((rule, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Circle Feed */}
          <div className="max-w-lg mx-auto">
            <div className="mb-6 text-center">
              <h2 className="text-xl font-semibold mb-2">Circle Souls</h2>
              <p className="text-muted-foreground text-sm">
                Anonymous thoughts from this community
              </p>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {circleEntries.map((entry, index) => (
                  <SoulCard key={entry.id} entry={entry} index={index} />
                ))}
                
                {circleEntries.length === 0 && (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">💭</div>
                    <h3 className="text-xl font-semibold mb-2">No souls yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Be the first to share your thoughts in this circle
                    </p>
                    {user?.isWalletConnected && (
                      <Button 
                        onClick={() => setPostModalOpen(true)}
                        className="gradient-soul hover:opacity-90 transition-opacity"
                      >
                        Share First Soul
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}