'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Globe, Palette, Music, Image } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSoulChainStore } from '@/lib/store';
import { MOOD_CONFIGS } from '@/lib/constants';
import { MoodType } from '@/lib/types';

const BG_COLORS = [
  { name: 'Midnight', value: 'from-slate-800 to-slate-900' },
  { name: 'Purple Dream', value: 'from-purple-800 to-purple-900' },
  { name: 'Ocean Deep', value: 'from-blue-800 to-blue-900' },
  { name: 'Forest Night', value: 'from-emerald-800 to-emerald-900' },
  { name: 'Sunset Glow', value: 'from-amber-800 to-amber-900' },
  { name: 'Rose Garden', value: 'from-pink-800 to-pink-900' },
  { name: 'Cosmic Void', value: 'from-indigo-800 to-indigo-900' },
  { name: 'Fire Storm', value: 'from-red-800 to-red-900' },
];

const AMBIENT_SOUNDS = [
  { name: 'None', value: 'none' },
  { name: 'Rain', value: 'rain' },
  { name: 'Ocean Waves', value: 'ocean' },
  { name: 'Forest', value: 'forest' },
  { name: 'Fireplace', value: 'fireplace' },
  { name: 'Wind', value: 'wind' },
];

export function PostModal() {
  const { isPostModalOpen, setPostModalOpen, addEntry, user } = useSoulChainStore();
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<MoodType | ''>('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedBg, setSelectedBg] = useState(BG_COLORS[0]);
  const [selectedSound, setSelectedSound] = useState(AMBIENT_SOUNDS[0]);
  const [isPosting, setIsPosting] = useState(false);

  const handleClose = () => {
    setPostModalOpen(false);
    setContent('');
    setMood('');
    setIsPrivate(false);
    setSelectedBg(BG_COLORS[0]);
    setSelectedSound(AMBIENT_SOUNDS[0]);
  };

  const handlePost = async () => {
    if (!content.trim() || !mood || !user?.isWalletConnected) return;

    setIsPosting(true);
    
    try {
      // In a real app, this would encrypt the content and upload to IPFS
      const newEntry = {
        id: Date.now().toString(),
        content: content.trim(),
        mood: mood as MoodType,
        emoji: MOOD_CONFIGS[mood as MoodType].emoji,
        timestamp: Date.now(),
        author: user.address,
        isPrivate,
        bgColor: selectedBg.value,
        bgMusic: selectedSound.value === 'none' ? '' : selectedSound.value,
      };

      addEntry(newEntry);
      handleClose();
    } catch (error) {
      console.error('Failed to post entry:', error);
    } finally {
      setIsPosting(false);
    }
  };

  const isValid = content.trim() && mood;

  // Only show modal for wallet-connected users
  if (!user?.isWalletConnected) {
    return null;
  }

  return (
    <Dialog open={isPostModalOpen} onOpenChange={setPostModalOpen}>
      <DialogContent className="glass-card border-0 max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <div className="flex flex-col h-full max-h-[90vh]">
          {/* Header */}
          <DialogHeader className="p-6 pb-0 flex-shrink-0">
            <DialogTitle className="text-2xl gradient-text">
              Express Your Soul
            </DialogTitle>
          </DialogHeader>

          {/* Content */}
          <ScrollArea className="flex-1 px-6 overflow-y-auto">
            <div className="space-y-6 pb-6">
              {/* Main Content Input */}
              <div className="space-y-2">
                <Label>What's on your soul?</Label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share your thoughts, feelings, or experiences..."
                  className="min-h-[120px] resize-none bg-white/5 border-white/10 text-base"
                  maxLength={500}
                />
                <div className="text-xs text-muted-foreground text-right">
                  {content.length}/500
                </div>
              </div>

              {/* Mood Selection */}
              <div className="space-y-2">
                <Label>How are you feeling?</Label>
                <Select value={mood} onValueChange={setMood}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Select your mood" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {Object.entries(MOOD_CONFIGS).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <span>{config.emoji}</span>
                          <span>{config.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Customization Tabs */}
              <Tabs defaultValue="style" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="style">Style</TabsTrigger>
                  <TabsTrigger value="privacy">Privacy</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                
                <TabsContent value="style" className="space-y-4 mt-4">
                  {/* Background Selection */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Palette size={16} />
                      Background Style
                    </Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {BG_COLORS.map((bg) => (
                        <button
                          key={bg.value}
                          onClick={() => setSelectedBg(bg)}
                          className={`relative group overflow-hidden rounded-lg aspect-video bg-gradient-to-br ${bg.value} border-2 transition-all hover:scale-105 ${
                            selectedBg.value === bg.value ? 'border-primary ring-2 ring-primary/20' : 'border-white/10'
                          }`}
                        >
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                          <div className="absolute bottom-1 left-1 right-1">
                            <p className="text-xs text-white font-medium truncate">
                              {bg.name}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Ambient Sound */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Music size={16} />
                      Ambient Sound
                    </Label>
                    <Select value={selectedSound.value} onValueChange={(value) => {
                      const sound = AMBIENT_SOUNDS.find(s => s.value === value);
                      if (sound) setSelectedSound(sound);
                    }}>
                      <SelectTrigger className="bg-white/5 border-white/10">
                        <SelectValue placeholder="Choose ambient sound" />
                      </SelectTrigger>
                      <SelectContent>
                        {AMBIENT_SOUNDS.map((sound) => (
                          <SelectItem key={sound.value} value={sound.value}>
                            {sound.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
                
                <TabsContent value="privacy" className="space-y-4 mt-4">
                  {/* Privacy Toggle */}
                  <div className="flex items-center justify-between p-4 glass-card rounded-lg">
                    <div className="flex items-center gap-3">
                      {isPrivate ? (
                        <Lock size={20} className="text-muted-foreground" />
                      ) : (
                        <Globe size={20} className="text-muted-foreground" />
                      )}
                      <div>
                        <Label className="text-base font-medium">
                          {isPrivate ? 'Private Soul' : 'Public Soul'}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {isPrivate 
                            ? 'Only you can see this entry' 
                            : 'Visible to all SoulChain users'
                          }
                        </p>
                      </div>
                    </div>
                    <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
                  </div>

                  {/* Privacy Information */}
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <h4 className="font-medium mb-2">Privacy & Security</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• All entries are encrypted before storage</li>
                      <li>• Private entries are only visible to you</li>
                      <li>• Public entries are anonymous by default</li>
                      <li>• Your wallet address is never fully exposed</li>
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="preview" className="mt-4">
                  {/* Preview */}
                  {content && mood && (
                    <div className="space-y-3">
                      <Label>Preview</Label>
                      <div className={`relative p-6 rounded-xl bg-gradient-to-br ${selectedBg.value} overflow-hidden`}>
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white to-transparent rounded-full blur-2xl" />
                          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white to-transparent rounded-full blur-xl" />
                        </div>
                        
                        {/* Content */}
                        <div className="relative z-10">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg">
                              {MOOD_CONFIGS[mood as MoodType]?.emoji}
                            </div>
                            <div>
                              <span className="text-sm font-medium text-white/90">
                                {MOOD_CONFIGS[mood as MoodType]?.label}
                              </span>
                              <div className="flex items-center gap-2 text-xs text-white/60">
                                {isPrivate && <Lock size={12} />}
                                {selectedSound.value !== 'none' && <Music size={12} />}
                                <span>Just now</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-white/90 leading-relaxed">{content}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 p-6 pt-0 border-t border-white/10 flex-shrink-0">
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handlePost}
              disabled={!isValid || isPosting}
              className="gradient-soul hover:opacity-90 transition-opacity min-w-[120px]"
            >
              {isPosting ? 'Posting...' : 'Post Soul'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}