export interface SoulEntry {
  id: string;
  content: string;
  mood: MoodType;
  emoji: string;
  timestamp: number;
  author: string;
  isPrivate: boolean;
  ipfsHash?: string;
  circleId?: string;
  bgColor?: string;
  bgMusic?: string;
}

export interface SoulCircle {
  id: string;
  name: string;
  description: string;
  bannerImage: string;
  memberCount: number;
  entryCount: number;
  rules: string[];
  soulScore: number;
  createdAt: number;
  creator: string;
  tags: string[];
  isPrivate: boolean;
}

export interface User {
  address: string;
  isWalletConnected: boolean;
  isGoogleAuth: boolean;
  joinedAt: number;
  soulBalance: number;
  streak: number;
  totalEntries: number;
  joinedCircles: string[];
  moodStats: MoodStats;
}

export interface MoodStats {
  [key: string]: number;
}

export type MoodType = 
  | 'grateful' 
  | 'peaceful' 
  | 'excited' 
  | 'hopeful' 
  | 'reflective' 
  | 'anxious' 
  | 'sad' 
  | 'angry' 
  | 'confused' 
  | 'lonely' 
  | 'creative' 
  | 'determined';

export interface PostModalData {
  content: string;
  mood: MoodType;
  emoji: string;
  isPrivate: boolean;
  circleId?: string;
  bgColor?: string;
  bgMusic?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface FeedState {
  entries: SoulEntry[];
  isLoading: boolean;
  hasMore: boolean;
  error: string | null;
}

export interface CircleState {
  circles: SoulCircle[];
  currentCircle: SoulCircle | null;
  isLoading: boolean;
  error: string | null;
}