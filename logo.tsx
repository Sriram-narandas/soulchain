'use client';

import { motion } from 'framer-motion';
import { Heart, Link } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const sizeConfig = {
    sm: { icon: 24, text: 'text-xl' },
    md: { icon: 32, text: 'text-2xl' },
    lg: { icon: 48, text: 'text-4xl' },
  };

  return (
    <motion.div
      className="flex items-center gap-2"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-sm"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-2">
          <div className="flex items-center justify-center">
            <Heart 
              size={sizeConfig[size].icon} 
              className="text-white fill-white" 
            />
            <Link 
              size={sizeConfig[size].icon * 0.6} 
              className="text-white -ml-2 -mt-1" 
            />
          </div>
        </div>
      </div>
      
      {showText && (
        <motion.div
          className="flex flex-col"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span className={`${sizeConfig[size].text} font-bold gradient-text`}>
            SoulChain
          </span>
          <span className="text-xs text-muted-foreground -mt-1">
            Anonymous Journaling
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}