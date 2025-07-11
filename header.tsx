'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Plus, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { AuthSection } from '@/components/auth/auth-section';
import { useSoulChainStore } from '@/lib/store';
import { ViewType } from '@/app/page';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  currentView?: ViewType;
  onViewChange?: (view: ViewType) => void;
}

export function Header({ currentView = 'feed', onViewChange }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, setPostModalOpen } = useSoulChainStore();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleViewChange = (view: ViewType) => {
    if (onViewChange) {
      onViewChange(view);
    }
    setIsMenuOpen(false);
  };

  // Define navigation items based on user authentication - STRICT CONTROL
  const getNavigationItems = () => {
    const baseItems = [
      { id: 'feed', label: 'Feed', requiresAuth: false },
      { id: 'circles', label: 'Circles', requiresAuth: false },
    ];

    // Only add authenticated items if user is wallet-connected
    if (user?.isWalletConnected) {
      baseItems.push(
        { id: 'dashboard', label: 'Dashboard', requiresAuth: true }
      );
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 glass-card border-b backdrop-blur-xl"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Logo size="md" />
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigationItems.map((item) => (
              <Button 
                key={item.id}
                variant="ghost" 
                className={`text-muted-foreground hover:text-foreground transition-colors ${
                  currentView === item.id ? 'text-foreground bg-white/5' : ''
                }`}
                onClick={() => handleViewChange(item.id as ViewType)}
              >
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* New Soul Button - Only for wallet users */}
            {user?.isWalletConnected && (
              <Button
                onClick={() => setPostModalOpen(true)}
                className="gradient-soul hover:opacity-90 transition-opacity shadow-lg"
              >
                <Plus size={18} />
                <span className="hidden sm:inline ml-2">New Soul</span>
              </Button>
            )}
            
            {/* User Menu - Only for authenticated users */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hidden md:flex">
                    <User size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-card border-white/10">
                  {/* Only show profile for wallet users */}
                  {user.isWalletConnected && (
                    <>
                      <DropdownMenuItem onClick={() => handleViewChange('profile')}>
                        <User size={16} className="mr-2" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  {/* Settings available for any authenticated user */}
                  <DropdownMenuItem onClick={() => handleViewChange('settings')}>
                    <Settings size={16} className="mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-muted-foreground">
                    {user.isWalletConnected ? 'Wallet Connected' : 'Google Account'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            <AuthSection />
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="md:hidden"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.nav
            className="md:hidden mt-4 pb-4 border-t border-border pt-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col gap-2">
              {navigationItems.map((item) => (
                <Button 
                  key={item.id}
                  variant="ghost" 
                  className={`justify-start ${
                    currentView === item.id ? 'text-foreground bg-white/5' : ''
                  }`}
                  onClick={() => handleViewChange(item.id as ViewType)}
                >
                  {item.label}
                </Button>
              ))}
              
              {/* Profile only for wallet users */}
              {user?.isWalletConnected && (
                <Button 
                  variant="ghost" 
                  className={`justify-start ${
                    currentView === 'profile' ? 'text-foreground bg-white/5' : ''
                  }`}
                  onClick={() => handleViewChange('profile')}
                >
                  <User size={16} className="mr-2" />
                  Profile
                </Button>
              )}
              
              {/* Settings only for authenticated users */}
              {user && (
                <Button 
                  variant="ghost" 
                  className={`justify-start ${
                    currentView === 'settings' ? 'text-foreground bg-white/5' : ''
                  }`}
                  onClick={() => handleViewChange('settings')}
                >
                  <Settings size={16} className="mr-2" />
                  Settings
                </Button>
              )}
              
              {/* Google Auth Upgrade Prompt */}
              {user?.isGoogleAuth && !user?.isWalletConnected && (
                <div className="mt-4 p-3 glass-card rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    Connect your wallet for full access
                  </p>
                  <Button size="sm" className="gradient-soul w-full">
                    Connect Wallet
                  </Button>
                </div>
              )}
              
              {/* Sign In Prompt for non-authenticated users */}
              {!user && (
                <div className="mt-4 p-3 glass-card rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    Sign in to access more features
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="border-white/20 flex-1">
                      Google
                    </Button>
                    <Button size="sm" className="gradient-soul flex-1">
                      Wallet
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.nav>
        )}
      </div>
    </motion.header>
  );
}