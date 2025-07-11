'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Plus, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useSoulChainStore } from '@/lib/store';
import { SoulCircle } from '@/lib/types';

interface CreateCircleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_BANNERS = [
  'https://images.pexels.com/photos/1420709/pexels-photo-1420709.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/1509582/pexels-photo-1509582.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/1624438/pexels-photo-1624438.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/1264210/pexels-photo-1264210.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
];

export function CreateCircleModal({ isOpen, onClose }: CreateCircleModalProps) {
  const { addCircle, user } = useSoulChainStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedBanner, setSelectedBanner] = useState(SAMPLE_BANNERS[0]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [rules, setRules] = useState<string[]>(['Be respectful and supportive']);
  const [newRule, setNewRule] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleClose = () => {
    onClose();
    // Reset form
    setName('');
    setDescription('');
    setSelectedBanner(SAMPLE_BANNERS[0]);
    setTags([]);
    setNewTag('');
    setRules(['Be respectful and supportive']);
    setNewRule('');
    setIsPrivate(false);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim().toLowerCase()) && tags.length < 5) {
      setTags([...tags, newTag.trim().toLowerCase()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addRule = () => {
    if (newRule.trim() && !rules.includes(newRule.trim()) && rules.length < 5) {
      setRules([...rules, newRule.trim()]);
      setNewRule('');
    }
  };

  const removeRule = (ruleToRemove: string) => {
    setRules(rules.filter(rule => rule !== ruleToRemove));
  };

  const handleCreate = async () => {
    if (!name.trim() || !description.trim() || !user?.isWalletConnected) return;

    setIsCreating(true);
    
    try {
      const newCircle: SoulCircle = {
        id: Date.now().toString(),
        name: name.trim(),
        description: description.trim(),
        bannerImage: selectedBanner,
        memberCount: 1,
        entryCount: 0,
        rules,
        soulScore: 100,
        createdAt: Date.now(),
        creator: user.address,
        tags,
        isPrivate,
      };

      addCircle(newCircle);
      handleClose();
    } catch (error) {
      console.error('Failed to create circle:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const isValid = name.trim() && description.trim() && tags.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-0 max-w-2xl max-h-[90vh] p-0 overflow-hidden">
        <div className="flex flex-col h-full max-h-[90vh]">
          {/* Header */}
          <DialogHeader className="p-6 pb-0 flex-shrink-0">
            <DialogTitle className="text-2xl gradient-text">
              Create Soul Circle
            </DialogTitle>
          </DialogHeader>

          {/* Content */}
          <div className="flex-1 px-6 overflow-y-auto">
            <div className="space-y-6 pb-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Circle Name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter circle name..."
                    className="bg-white/5 border-white/10"
                    maxLength={50}
                  />
                  <div className="text-xs text-muted-foreground text-right">
                    {name.length}/50
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your circle's purpose..."
                    className="min-h-[100px] resize-none bg-white/5 border-white/10"
                    maxLength={200}
                  />
                  <div className="text-xs text-muted-foreground text-right">
                    {description.length}/200
                  </div>
                </div>
              </div>

              {/* Banner Selection */}
              <div className="space-y-3">
                <Label>Banner Image</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {SAMPLE_BANNERS.map((banner, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedBanner(banner)}
                      className={`relative group overflow-hidden rounded-lg aspect-video border-2 transition-all hover:scale-105 ${
                        selectedBanner === banner ? 'border-primary ring-2 ring-primary/20' : 'border-white/10'
                      }`}
                    >
                      <img
                        src={banner}
                        alt={`Banner ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-3">
                <Label>Tags (up to 5)</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      #{tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X size={12} />
                      </button>
                    </Badge>
                  ))}
                </div>
                {tags.length < 5 && (
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag..."
                      className="bg-white/5 border-white/10"
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      maxLength={20}
                    />
                    <Button onClick={addTag} size="sm" variant="outline">
                      <Plus size={16} />
                    </Button>
                  </div>
                )}
              </div>

              {/* Rules */}
              <div className="space-y-3">
                <Label>Community Rules (up to 5)</Label>
                <div className="space-y-2">
                  {rules.map((rule, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 glass-card rounded-lg">
                      <span className="flex-1 text-sm">{rule}</span>
                      {rules.length > 1 && (
                        <button
                          onClick={() => removeRule(rule)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {rules.length < 5 && (
                  <div className="flex gap-2">
                    <Input
                      value={newRule}
                      onChange={(e) => setNewRule(e.target.value)}
                      placeholder="Add a rule..."
                      className="bg-white/5 border-white/10"
                      onKeyPress={(e) => e.key === 'Enter' && addRule()}
                      maxLength={100}
                    />
                    <Button onClick={addRule} size="sm" variant="outline">
                      <Plus size={16} />
                    </Button>
                  </div>
                )}
              </div>

              {/* Privacy */}
              <div className="flex items-center justify-between p-4 glass-card rounded-lg">
                <div>
                  <Label className="text-base font-medium">Private Circle</Label>
                  <p className="text-sm text-muted-foreground">
                    Require approval to join
                  </p>
                </div>
                <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 pt-0 border-t border-white/10 flex-shrink-0">
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!isValid || isCreating}
              className="gradient-soul hover:opacity-90 transition-opacity min-w-[120px]"
            >
              {isCreating ? 'Creating...' : 'Create Circle'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}