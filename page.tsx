'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { SoulFeed } from '@/components/feed/soul-feed';
import { CirclesGrid } from '@/components/circles/circles-grid';
import { CircleView } from '@/components/circles/circle-view';
import { DashboardOverview } from '@/components/dashboard/dashboard-overview';
import { ProfilePage } from '@/components/profile/profile-page';
import { SettingsPage } from '@/components/settings/settings-page';
import { PostModal } from '@/components/modals/post-modal';
import { useSoulChainStore } from '@/lib/store';

export type ViewType = 'feed' | 'circles' | 'dashboard' | 'profile' | 'settings';

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewType>('feed');
  const { user, selectedCircleId, setSelectedCircleId } = useSoulChainStore();

  const renderView = () => {
    // If a circle is selected, show circle view
    if (selectedCircleId && currentView === 'circles') {
      return (
        <CircleView 
          circleId={selectedCircleId} 
          onBack={() => setSelectedCircleId(null)} 
        />
      );
    }

    switch (currentView) {
      case 'feed':
        return <SoulFeed />;
      case 'circles':
        return <CirclesGrid />;
      case 'dashboard':
        // STRICT: Only wallet users can access dashboard
        if (!user?.isWalletConnected) {
          return <SoulFeed />;
        }
        return <DashboardOverview />;
      case 'profile':
        // STRICT: Only wallet users can access profile
        if (!user?.isWalletConnected) {
          return <SoulFeed />;
        }
        return <ProfilePage />;
      case 'settings':
        // STRICT: Only authenticated users can access settings
        if (!user) {
          return <SoulFeed />;
        }
        return <SettingsPage />;
      default:
        return <SoulFeed />;
    }
  };

  const handleViewChange = (view: ViewType) => {
    // Reset circle selection when changing views
    if (view !== 'circles') {
      setSelectedCircleId(null);
    }
    
    // STRICT ACCESS CONTROL - Block unauthorized access
    if (!user && ['dashboard', 'profile', 'settings'].includes(view)) {
      // Force stay on feed for non-authenticated users
      setCurrentView('feed');
      return;
    }
    
    if (user && !user.isWalletConnected && ['dashboard', 'profile'].includes(view)) {
      // Google auth users can't access wallet-only features
      setCurrentView('feed');
      return;
    }
    
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header currentView={currentView} onViewChange={handleViewChange} />
      <main className="relative">
        {renderView()}
      </main>
      {/* Only show post modal for wallet users */}
      {user?.isWalletConnected && <PostModal />}
    </div>
  );
}