'use client';

import { motion } from 'framer-motion';
import { WalletButton } from '@/components/wallet/wallet-button';
import { GoogleAuthButton } from '@/components/auth/google-auth-button';
import { useSoulChainStore } from '@/lib/store';

export function AuthSection() {
  const { user } = useSoulChainStore();

  if (user) {
    return (
      <div className="flex items-center gap-3">
        {user.isWalletConnected ? <WalletButton /> : <GoogleAuthButton />}
      </div>
    );
  }

  return (
    <motion.div 
      className="flex items-center gap-3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <GoogleAuthButton />
      <div className="text-muted-foreground text-sm hidden sm:block">or</div>
      <WalletButton />
    </motion.div>
  );
}