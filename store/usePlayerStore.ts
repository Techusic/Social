import { create } from 'zustand';

interface Post {
  id: string;
  authorName: string;
  authorHandle: string;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  timestamp: number;
  isPlayerPost: boolean;
}

interface PlayerState {
  // Core Stats
  followers: number;
  aura: number;
  cloutTokens: number;
  
  // Profile
  username: string;
  displayName: string;
  bio: string;
  
  // Feed State
  feed: Record<string, Post>;
  feedOrder: string[]; 
  
  // Actions
  incrementFollowers: (amount: number) => void;
  adjustAura: (amount: number) => void;
  addPostToFeed: (post: Post) => void;
  updatePostLikes: (postId: string, likeCount: number) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  followers: 120,
  aura: 50,
  cloutTokens: 0,
  username: 'player1',
  displayName: 'Local Nobody',
  bio: 'Just trying to make it.',
  feed: {
    'post_1': {
      id: 'post_1',
      authorName: 'System',
      authorHandle: '@nexus',
      content: 'Welcome to the network. Your presence has been logged. Begin building your influence.',
      likes: 42,
      comments: 3,
      timestamp: Date.now() - 3600000,
      isPlayerPost: false,
    },
    'post_2': {
      id: 'post_2',
      authorName: 'Elena',
      authorHandle: '@elena_tech',
      content: 'Seeing a lot of new accounts spinning up today. Must be another migration wave.',
      likes: 128,
      comments: 14,
      timestamp: Date.now() - 7200000,
      isPlayerPost: false,
    }
  },
  feedOrder: ['post_1', 'post_2'],

  incrementFollowers: (amount) => set((state) => ({ followers: Math.max(0, state.followers + amount) })),
  adjustAura: (amount) => set((state) => ({ aura: Math.max(0, Math.min(100, state.aura + amount)) })),
  
  addPostToFeed: (post) => set((state) => ({
    feed: { ...state.feed, [post.id]: post },
    feedOrder: [post.id, ...state.feedOrder]
  })),
  
  updatePostLikes: (postId, likeCount) => set((state) => ({
    feed: {
      ...state.feed,
      [postId]: { ...state.feed[postId], likes: likeCount }
    }
  }))
}));