'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CircleCard } from './circle-card';
import { CreateCircleModal } from './create-circle-modal';
import { useSoulChainStore } from '@/lib/store';
import { SAMPLE_CIRCLES } from '@/lib/constants';
import { Loader2, Plus, Search, Filter, TrendingUp, Users, Clock, Lock, LogIn, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export function CirclesGrid() {
  const { circles, isLoading, setCircles, setCircleLoading, user } = useSoulChainStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [filterTag, setFilterTag] = useState('all');

  useEffect(() => {
    if (circles.length === 0) {
      setCircleLoading(true);
      setTimeout(() => {
        setCircles(SAMPLE_CIRCLES);
        setCircleLoading(false);
      }, 1000);
    }
  }, [circles.length, setCircles, setCircleLoading]);

  // Get all unique tags from circles
  const allTags = Array.from(new Set(circles.flatMap(circle => circle.tags)));

  // Filter and sort circles
  const filteredCircles = circles
    .filter(circle => {
      const matchesSearch = circle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           circle.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           circle.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesTag = filterTag === 'all' || circle.tags.includes(filterTag);
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.memberCount - a.memberCount;
        case 'active':
          return b.entryCount - a.entryCount;
        case 'newest':
          return b.createdAt - a.createdAt;
        case 'soulScore':
          return b.soulScore - a.soulScore;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen pt-24 pb-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold gradient-text mb-2">
              Soul Circles
            </h1>
            <p className="text-muted-foreground mb-6">
              Join anonymous communities for emotional support and growth
            </p>
            
            {user?.isWalletConnected && (
              <Button 
                onClick={() => setIsCreateModalOpen(true)}
                className="gradient-soul hover:opacity-90 transition-opacity"
              >
                <Plus size={18} />
                <span className="ml-2">Create Circle</span>
              </Button>
            )}
          </div>

          {/* Access Control Notice */}
          {!user && (
            <motion.div 
              className="mb-6 p-4 glass-card rounded-lg border border-blue-500/20 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Lock size={16} className="text-blue-500" />
                <span className="text-sm font-medium text-blue-500">Browse Mode</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                You can browse circles but need to sign in to join them and access their content.
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="border-white/20 flex-1">
                  <LogIn size={16} className="mr-2" />
                  Sign In
                </Button>
                <Button size="sm" className="gradient-soul flex-1">
                  <Wallet size={16} className="mr-2" />
                  Connect Wallet
                </Button>
              </div>
            </motion.div>
          )}

          {user?.isGoogleAuth && !user?.isWalletConnected && (
            <motion.div 
              className="mb-6 p-4 glass-card rounded-lg border border-yellow-500/20 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Lock size={16} className="text-yellow-500" />
                <span className="text-sm font-medium text-yellow-500">Limited Circle Access</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Connect your wallet to join circles, create posts, and access full community features.
              </p>
              <Button size="sm" className="gradient-soul w-full">
                <Wallet size={16} className="mr-2" />
                Connect Wallet to Join Circles
              </Button>
            </motion.div>
          )}

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search circles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10"
                />
              </div>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[180px] bg-white/5 border-white/10">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">
                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      Most Popular
                    </div>
                  </SelectItem>
                  <SelectItem value="active">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={16} />
                      Most Active
                    </div>
                  </SelectItem>
                  <SelectItem value="newest">
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      Newest
                    </div>
                  </SelectItem>
                  <SelectItem value="soulScore">
                    <div className="flex items-center gap-2">
                      <Filter size={16} />
                      Soul Score
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tag Filter */}
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={filterTag === 'all' ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/20 transition-colors"
                onClick={() => setFilterTag('all')}
              >
                All
              </Badge>
              {allTags.slice(0, 8).map((tag) => (
                <Badge
                  key={tag}
                  variant={filterTag === tag ? 'default' : 'outline'}
                  className="cursor-pointer hover:bg-primary/20 transition-colors"
                  onClick={() => setFilterTag(tag)}
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Circles Grid */}
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="animate-spin text-muted-foreground" size={32} />
            </div>
          ) : (
            <>
              {filteredCircles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCircles.map((circle, index) => (
                    <CircleCard key={circle.id} circle={circle} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold mb-2">No circles found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </>
          )}

          {/* Create Circle Modal - Only for wallet users */}
          {user?.isWalletConnected && (
            <CreateCircleModal 
              isOpen={isCreateModalOpen} 
              onClose={() => setIsCreateModalOpen(false)} 
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}