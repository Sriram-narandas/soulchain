'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected, walletConnect } from 'wagmi/connectors';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut, ChevronDown } from 'lucide-react';
import { useSoulChainStore } from '@/lib/store';
import { useEffect, useRef } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function WalletButton() {
  const { address, isConnected, isConnecting } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { user, setUser } = useSoulChainStore();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (isConnected && address && !hasInitialized.current) {
      hasInitialized.current = true;
      setUser({
        address,
        isWalletConnected: true,
        isGoogleAuth: false,
        joinedAt: Date.now(),
        soulBalance: 100,
        streak: 1,
        totalEntries: 0,
        joinedCircles: [],
        moodStats: {},
      });
    } else if (!isConnected && hasInitialized.current) {
      hasInitialized.current = false;
      if (user?.isWalletConnected) {
        setUser(null);
      }
    }
  }, [isConnected, address, setUser, user?.isWalletConnected]);

  const handleConnect = (connector: any) => {
    try {
      connect({ connector });
    } catch (error) {
      console.error('Wallet connection failed:', error);
    }
  };

  const handleDisconnect = () => {
    try {
      disconnect();
      hasInitialized.current = false;
    } catch (error) {
      console.error('Wallet disconnection failed:', error);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2 glass-card px-3 py-2 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium">
            {formatAddress(address)}
          </span>
        </div>
        <Button
          onClick={handleDisconnect}
          variant="ghost"
          size="sm"
          className="hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut size={16} />
        </Button>
      </div>
    );
  }

  const availableConnectors = connectors.filter(connector => connector.id !== 'injected' || typeof window !== 'undefined');

  if (availableConnectors.length === 1) {
    return (
      <Button 
        onClick={() => handleConnect(availableConnectors[0])}
        disabled={isConnecting || isPending}
        className="gradient-soul hover:opacity-90 transition-opacity"
      >
        <Wallet size={18} />
        <span className="hidden sm:inline ml-2">
          {isConnecting || isPending ? 'Connecting...' : 'Connect Wallet'}
        </span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          disabled={isConnecting || isPending}
          className="gradient-soul hover:opacity-90 transition-opacity"
        >
          <Wallet size={18} />
          <span className="hidden sm:inline ml-2">
            {isConnecting || isPending ? 'Connecting...' : 'Connect Wallet'}
          </span>
          <ChevronDown size={14} className="ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass-card border-white/10">
        {availableConnectors.map((connector) => (
          <DropdownMenuItem
            key={connector.id}
            onClick={() => handleConnect(connector)}
            className="cursor-pointer"
          >
            <Wallet size={16} className="mr-2" />
            {connector.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}