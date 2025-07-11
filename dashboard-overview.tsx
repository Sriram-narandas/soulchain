'use client';

import { motion } from 'framer-motion';
import { Coins, Flame, BookOpen, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useSoulChainStore } from '@/lib/store';
import { MOOD_CONFIGS } from '@/lib/constants';

export function DashboardOverview() {
  const { user, entries } = useSoulChainStore();

  if (!user) return null;

  const userEntries = entries.filter(entry => entry.author === user.address);
  const moodCounts = userEntries.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topMood = Object.entries(moodCounts).sort(([,a], [,b]) => b - a)[0];

  return (
    <div className="min-h-screen pt-24 pb-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold gradient-text mb-2">
              Soul Dashboard
            </h1>
            <p className="text-muted-foreground">
              Track your emotional journey and growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Soul Balance */}
            <Card className="glass-card border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Soul Balance</CardTitle>
                <Coins className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user.soulBalance}</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last week
                </p>
              </CardContent>
            </Card>

            {/* Streak */}
            <Card className="glass-card border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                <Flame className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user.streak} days</div>
                <p className="text-xs text-muted-foreground">
                  Keep journaling daily!
                </p>
              </CardContent>
            </Card>

            {/* Total Entries */}
            <Card className="glass-card border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Souls</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userEntries.length}</div>
                <p className="text-xs text-muted-foreground">
                  Lifetime entries
                </p>
              </CardContent>
            </Card>

            {/* Joined Circles */}
            <Card className="glass-card border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Soul Circles</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user.joinedCircles.length}</div>
                <p className="text-xs text-muted-foreground">
                  Communities joined
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mood Analytics */}
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp size={20} />
                  Mood Analytics
                </CardTitle>
                <CardDescription>
                  Your emotional patterns over time
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {topMood && (
                  <div className="text-center p-4 glass-card rounded-lg">
                    <div className="text-3xl mb-2">
                      {MOOD_CONFIGS[topMood[0] as keyof typeof MOOD_CONFIGS]?.emoji}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Most common mood: {MOOD_CONFIGS[topMood[0] as keyof typeof MOOD_CONFIGS]?.label}
                    </div>
                  </div>
                )}
                
                <div className="space-y-3">
                  {Object.entries(moodCounts).map(([mood, count]) => {
                    const moodConfig = MOOD_CONFIGS[mood as keyof typeof MOOD_CONFIGS];
                    const percentage = (count / userEntries.length) * 100;
                    
                    return (
                      <div key={mood} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center gap-2">
                            {moodConfig?.emoji} {moodConfig?.label}
                          </span>
                          <span>{count} entries</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
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
                          <div className="text-sm text-muted-foreground line-clamp-2">
                            {entry.isPrivate ? '🔒 Private Soul' : entry.content}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}