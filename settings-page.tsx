'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Bell, 
  Palette, 
  Globe, 
  Download, 
  Trash2, 
  Eye, 
  EyeOff,
  Moon,
  Sun,
  Monitor,
  Bookmark,
  Heart,
  Lock,
  Smartphone,
  Mail,
  Database,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SoulCard } from '@/components/feed/soul-card';
import { useSoulChainStore } from '@/lib/store';
import { useTheme } from 'next-themes';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export function SettingsPage() {
  const { user, savedPosts, setUser } = useSoulChainStore();
  const { theme, setTheme } = useTheme();
  
  // Settings state
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [privateByDefault, setPrivateByDefault] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [dataCollection, setDataCollection] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);
  
  // Form states
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [reportText, setReportText] = useState('');

  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-8 flex items-center justify-center">
        <Card className="glass-card border-0 max-w-md">
          <CardContent className="p-8 text-center">
            <Lock size={48} className="mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Sign In Required</h2>
            <p className="text-muted-foreground mb-4">
              Please sign in to access settings
            </p>
            <Button className="gradient-soul w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleNotificationToggle = async (type: string, value: boolean) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      switch (type) {
        case 'push':
          setPushNotifications(value);
          if (value && 'Notification' in window) {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
              toast.success('Push notifications enabled');
            } else {
              toast.error('Push notification permission denied');
              setPushNotifications(false);
            }
          } else if (!value) {
            toast.success('Push notifications disabled');
          }
          break;
        case 'email':
          setEmailNotifications(value);
          toast.success(value ? 'Email notifications enabled' : 'Email notifications disabled');
          break;
        case 'marketing':
          setMarketingEmails(value);
          toast.success(value ? 'Marketing emails enabled' : 'Marketing emails disabled');
          break;
      }
    } catch (error) {
      toast.error('Failed to update notification settings');
    }
  };

  const handleDataExport = async () => {
    setIsExporting(true);
    try {
      // Simulate data export
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const userData = {
        user: user,
        savedPosts: savedPosts,
        settings: {
          notifications,
          emailNotifications,
          pushNotifications,
          privateByDefault,
          showPreview,
          autoSave,
          theme
        },
        exportDate: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `soulchain-data-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  const handleAccountDeletion = async () => {
    if (deleteConfirmation !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }
    
    setIsDeleting(true);
    try {
      // Simulate account deletion
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Clear all user data
      setUser(null);
      localStorage.clear();
      sessionStorage.clear();
      
      toast.success('Account deleted successfully');
      window.location.reload();
    } catch (error) {
      toast.error('Failed to delete account');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!feedbackText.trim()) {
      toast.error('Please enter your feedback');
      return;
    }
    
    try {
      // Simulate feedback submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Feedback submitted successfully');
      setFeedbackText('');
    } catch (error) {
      toast.error('Failed to submit feedback');
    }
  };

  const handleReportSubmit = async () => {
    if (!reportText.trim()) {
      toast.error('Please describe the issue');
      return;
    }
    
    try {
      // Simulate report submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Report submitted successfully');
      setReportText('');
    } catch (error) {
      toast.error('Failed to submit report');
    }
  };

  const handleTwoFactorToggle = async (enabled: boolean) => {
    try {
      // Simulate 2FA setup
      await new Promise(resolve => setTimeout(resolve, 1500));
      setTwoFactorAuth(enabled);
      toast.success(enabled ? '2FA enabled successfully' : '2FA disabled');
    } catch (error) {
      toast.error('Failed to update 2FA settings');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold gradient-text mb-2">Settings</h1>
            <p className="text-muted-foreground">
              Customize your SoulChain experience
            </p>
          </div>

          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              {/* Appearance */}
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette size={20} />
                    Appearance
                  </CardTitle>
                  <CardDescription>
                    Customize the look and feel of SoulChain
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-base">Theme</Label>
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">
                          <div className="flex items-center gap-2">
                            <Sun size={16} />
                            Light
                          </div>
                        </SelectItem>
                        <SelectItem value="dark">
                          <div className="flex items-center gap-2">
                            <Moon size={16} />
                            Dark
                          </div>
                        </SelectItem>
                        <SelectItem value="system">
                          <div className="flex items-center gap-2">
                            <Monitor size={16} />
                            System
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Show Content Preview</Label>
                      <p className="text-sm text-muted-foreground">
                        Display soul content in feed previews
                      </p>
                    </div>
                    <Switch 
                      checked={showPreview} 
                      onCheckedChange={setShowPreview}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Auto-save Drafts</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically save your writing as you type
                      </p>
                    </div>
                    <Switch 
                      checked={autoSave} 
                      onCheckedChange={setAutoSave}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Feedback */}
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart size={20} />
                    Feedback & Support
                  </CardTitle>
                  <CardDescription>
                    Help us improve SoulChain
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-base">Send Feedback</Label>
                    <Textarea
                      placeholder="Tell us what you think about SoulChain..."
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      className="min-h-[100px] bg-white/5 border-white/10"
                    />
                    <Button onClick={handleFeedbackSubmit} className="w-full sm:w-auto">
                      <Heart size={16} className="mr-2" />
                      Submit Feedback
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <Label className="text-base">Report an Issue</Label>
                    <Textarea
                      placeholder="Describe the problem you're experiencing..."
                      value={reportText}
                      onChange={(e) => setReportText(e.target.value)}
                      className="min-h-[100px] bg-white/5 border-white/10"
                    />
                    <Button onClick={handleReportSubmit} variant="outline" className="w-full sm:w-auto">
                      <AlertTriangle size={16} className="mr-2" />
                      Report Issue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6">
              {/* Privacy & Security */}
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield size={20} />
                    Privacy & Security
                  </CardTitle>
                  <CardDescription>
                    Control how your data is handled and shared
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Private by Default</Label>
                      <p className="text-sm text-muted-foreground">
                        Make all new souls private automatically
                      </p>
                    </div>
                    <Switch 
                      checked={privateByDefault} 
                      onCheckedChange={setPrivateByDefault}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch 
                      checked={twoFactorAuth} 
                      onCheckedChange={handleTwoFactorToggle}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Data Collection</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow anonymous usage analytics to improve the app
                      </p>
                    </div>
                    <Switch 
                      checked={dataCollection} 
                      onCheckedChange={setDataCollection}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <Label className="text-base">Data Export</Label>
                    <p className="text-sm text-muted-foreground">
                      Download all your soul data in JSON format
                    </p>
                    <Button 
                      onClick={handleDataExport}
                      disabled={isExporting}
                      variant="outline" 
                      className="w-full sm:w-auto"
                    >
                      <Download size={16} className="mr-2" />
                      {isExporting ? 'Exporting...' : 'Export My Data'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              {/* Notifications */}
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell size={20} />
                    Notifications
                  </CardTitle>
                  <CardDescription>
                    Manage how you receive updates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base flex items-center gap-2">
                        <Smartphone size={16} />
                        Push Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications for circle activity
                      </p>
                    </div>
                    <Switch 
                      checked={pushNotifications} 
                      onCheckedChange={(value) => handleNotificationToggle('push', value)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base flex items-center gap-2">
                        <Mail size={16} />
                        Email Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Get important updates via email
                      </p>
                    </div>
                    <Switch 
                      checked={emailNotifications} 
                      onCheckedChange={(value) => handleNotificationToggle('email', value)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive updates about new features and tips
                      </p>
                    </div>
                    <Switch 
                      checked={marketingEmails} 
                      onCheckedChange={(value) => handleNotificationToggle('marketing', value)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Bell size={16} className="text-blue-500" />
                      Notification Preferences
                    </h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <CheckCircle size={14} className="text-green-500" />
                        <span>New circle invitations</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle size={14} className="text-green-500" />
                        <span>Weekly mood insights</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <XCircle size={14} className="text-red-500" />
                        <span>Individual post interactions</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="saved" className="space-y-6">
              {/* Saved Posts */}
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bookmark size={20} />
                    Saved Souls
                  </CardTitle>
                  <CardDescription>
                    Posts you've bookmarked for later ({savedPosts.length} saved)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {savedPosts.length > 0 ? (
                    <div className="space-y-6 max-h-[600px] overflow-y-auto">
                      {savedPosts.map((entry, index) => (
                        <div key={entry.id} className="max-w-md mx-auto">
                          <SoulCard entry={entry} index={index} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Bookmark size={48} className="mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">No saved souls yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Bookmark souls to save them for later reading
                      </p>
                      <Button className="gradient-soul">
                        Explore Feed
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account" className="space-y-6">
              {/* Account Management */}
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe size={20} />
                    Account Management
                  </CardTitle>
                  <CardDescription>
                    Manage your account and data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-base">Account Type</Label>
                    <div className="p-3 glass-card rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {user.isWalletConnected ? 'Wallet Account' : 'Google Account'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {user.isWalletConnected 
                              ? 'Full access to all features'
                              : 'Limited access - connect wallet for more features'
                            }
                          </p>
                        </div>
                        {!user.isWalletConnected && (
                          <Button className="gradient-soul">
                            Upgrade Account
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <Label className="text-base">Account Statistics</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 glass-card rounded-lg text-center">
                        <div className="text-2xl font-bold text-primary">{savedPosts.length}</div>
                        <div className="text-sm text-muted-foreground">Saved Posts</div>
                      </div>
                      <div className="p-3 glass-card rounded-lg text-center">
                        <div className="text-2xl font-bold text-primary">{user.joinedCircles.length}</div>
                        <div className="text-sm text-muted-foreground">Joined Circles</div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <Label className="text-base text-destructive">Danger Zone</Label>
                    <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-destructive mb-2">Delete Account</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            Permanently delete your account and all associated data. This action cannot be undone.
                          </p>
                          <div className="space-y-3">
                            <div>
                              <Label className="text-sm">Type "DELETE" to confirm:</Label>
                              <Input
                                value={deleteConfirmation}
                                onChange={(e) => setDeleteConfirmation(e.target.value)}
                                placeholder="DELETE"
                                className="mt-1 bg-white/5 border-destructive/20"
                              />
                            </div>
                            <Button 
                              onClick={handleAccountDeletion}
                              disabled={deleteConfirmation !== 'DELETE' || isDeleting}
                              variant="destructive" 
                              className="w-full sm:w-auto"
                            >
                              <Trash2 size={16} className="mr-2" />
                              {isDeleting ? 'Deleting Account...' : 'Delete Account'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}