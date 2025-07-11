'use client';

import { motion } from 'framer-motion';
import { Calendar, Coins, Flame, BookOpen, Users, Edit3, Camera } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useSoulChainStore } from '@/lib/store';
import { MOOD_CONFIGS } from '@/lib/constants';
import { formatDistanceToNow } from 'date-fns';

export function ProfilePage() {
  const { user, entries } = useSoulChainStore();

  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-8 flex items-center justify-center">
        <Card className="glass-card border-0 max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Sign In Required</h2>
            <p className="text-muted-foreground">
              Please sign in to view your profile
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const userEntries = entries.filter(entry => entry.author === user.address);
  const joinedDate = new Date(user.joinedAt);
  const moodCounts = userEntries.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topMood = Object.entries(moodCounts).sort(([,a], [,b]) => b - a)[0];

  return (
    <div className="min-h-screen pt-24 pb-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile Header */}
          <Card className="glass-card border-0 mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-2xl gradient-soul">
                      {user.isWalletConnected ? '🔗' : '👤'}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                  >
                    <Camera size={14} />
                  </Button>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold">
                      {user.isWalletConnected 
                        ? `${user.address.slice(0, 6)}...${user.address.slice(-4)}`
                        : 'Soul Traveler'
                      }
                    </h1>
                    <Badge variant={user.isWalletConnected ? 'default' : 'secondary'}>
                      {user.isWalletConnected ? 'Wallet Connected' : 'Google Account'}
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">
                    Member since {formatDistanceToNow(joinedDate, { addSuffix: true })}
                  </p>
                  
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <Coins size={16} className="text-yellow-500" />
                      <span className="text-sm">{user.soulBalance} Soul Tokens</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Flame size={16} className="text-orange-500" />
                      <span className="text-sm">{user.streak} day streak</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} className="text-blue-500" />
                      <span className="text-sm">{userEntries.length} souls shared</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-purple-500" />
                      <span className="text-sm">{user.joinedCircles.length} circles joined</span>
                    </div>
                  </div>
                </div>
                
                <Button className="gradient-soul">
                  <Edit3 size={16} className="mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Mood Analytics */}
            <Card className="glass-card border-0 lg:col-span-2">
              <CardHeader>
                <CardTitle>Emotional Journey</CardTitle>
                <CardDescription>
                  Your mood patterns and emotional growth
                </CardDescription>
              </CardHeader>
              <CardContent>
                {topMood ? (
                  <div className="space-y-6">
                    <div className="text-center p-6 glass-card rounded-lg">
                      <div className="text-4xl mb-2">
                        {MOOD_CONFIGS[topMood[0] as keyof typeof MOOD_CONFIGS]?.emoji}
                      </div>
                      <h3 className="font-semibold mb-1">
                        Most Common Mood
                      </h3>
                      <p className="text-muted-foreground">
                        {MOOD_CONFIGS[topMood[0] as keyof typeof MOOD_CONFIGS]?.label}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {topMood[1]} out of {userEntries.length} entries
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(moodCounts).map(([mood, count]) => {
                        const moodConfig = MOOD_CONFIGS[mood as keyof typeof MOOD_CONFIGS];
                        const percentage = ((count / userEntries.length) * 100).toFixed(1);
                        
                        return (
                          <div key={mood} className="text-center p-3 glass-card rounded-lg">
                            <div className="text-2xl mb-1">{moodConfig?.emoji}</div>
                            <div className="text-xs text-muted-foreground mb-1">
                              {moodConfig?.label}
                            </div>
                            <div className="text-sm font-medium">{percentage}%</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen size={48} className="mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Start journaling to see your emotional patterns
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle>Recent Souls</CardTitle>
                <CardDescription>
                  Your latest journal entries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userEntries.slice(0, 5).map((entry) => {
                    const moodConfig = MOOD_CONFIGS[entry.mood];
                    return (
                      <div key={entry.id} className="flex items-start gap-3 p-3 glass-card rounded-lg">
                        <div className="text-lg">{moodConfig.emoji}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium mb-1">
                            {moodConfig.label}
                          </div>
                          <div className="text-xs text-muted-foreground mb-1">
                            {formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}
                          </div>
                          <div className="text-sm text-muted-foreground line-clamp-2">
                            {entry.isPrivate ? '🔒 Private Soul' : entry.content}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {userEntries.length === 0 && (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground text-sm">
                        No souls shared yet
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}