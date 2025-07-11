'use client';

import { motion } from 'framer-motion';
import { Users, MessageSquare, Trophy, ChevronRight, Check } from 'lucide-react';
import { SoulCircle } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useSoulChainStore } from '@/lib/store';
import { useState } from 'react';

interface CircleCardProps {
  circle: SoulCircle;
  index: number;
}

export function CircleCard({ circle, index }: CircleCardProps) {
  const { user, setSelectedCircleId } = useSoulChainStore();
  const [isJoined, setIsJoined] = useState(
    user?.joinedCircles.includes(circle.id) || false
  );
  const [isJoining, setIsJoining] = useState(false);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const handleJoinCircle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user?.isWalletConnected) {
      alert('Please connect your wallet to join circles');
      return;
    }

    setIsJoining(true);
    
    // Simulate joining process
    setTimeout(() => {
      setIsJoined(true);
      setIsJoining(false);
      
      // Update user's joined circles in store
      if (user) {
        const updatedUser = {
          ...user,
          joinedCircles: [...user.joinedCircles, circle.id]
        };
        // Note: In a real app, this would update the store
      }
    }, 1000);
  };

  const handleViewCircle = () => {
    setSelectedCircleId(circle.id);
    // Navigate to circle view - in a real app this would use router
    window.location.hash = `circle-${circle.id}`;
  };

  return (
    <motion.div
      className="glass-card rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      onClick={handleViewCircle}
    >
      {/* Banner Image */}
      <div className="relative h-32 overflow-hidden">
        <img
          src={circle.bannerImage}
          alt={circle.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Soul Score Badge */}
        <div className="absolute top-3 right-3 glass-card px-2 py-1 rounded-full">
          <div className="flex items-center gap-1 text-xs">
            <Trophy size={12} className="text-yellow-400" />
            <span className="text-white font-medium">{circle.soulScore}</span>
          </div>
        </div>

        {/* Joined Badge */}
        {isJoined && (
          <div className="absolute top-3 left-3 glass-card px-2 py-1 rounded-full bg-green-500/20">
            <div className="flex items-center gap-1 text-xs">
              <Check size={12} className="text-green-400" />
              <span className="text-green-400 font-medium">Joined</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{circle.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {circle.description}
            </p>
          </div>
          <ChevronRight size={20} className="text-muted-foreground mt-1" />
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users size={14} />
            <span>{formatNumber(circle.memberCount)}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MessageSquare size={14} />
            <span>{formatNumber(circle.entryCount)}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {circle.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
            >
              #{tag}
            </span>
          ))}
          {circle.tags.length > 3 && (
            <span className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs">
              +{circle.tags.length - 3}
            </span>
          )}
        </div>

        {/* Action Button */}
        {user?.isWalletConnected ? (
          <Button 
            onClick={handleJoinCircle}
            disabled={isJoined || isJoining}
            className={`w-full transition-all ${
              isJoined 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'gradient-soul hover:opacity-90'
            }`}
          >
            {isJoining ? 'Joining...' : isJoined ? 'Joined' : 'Join Circle'}
          </Button>
        ) : (
          <Button 
            variant="outline" 
            className="w-full border-white/20 hover:bg-white/5"
            onClick={(e) => {
              e.stopPropagation();
              alert('Connect your wallet to join circles');
            }}
          >
            Connect Wallet to Join
          </Button>
        )}
      </div>
    </motion.div>
  );
}