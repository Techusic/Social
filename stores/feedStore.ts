import { create } from 'zustand';
import type { NPCMemory, NPCProfile, PlayerEngagementStats, Post, RelationshipState, Reply } from '../types/feed';
import { decideNpcAction, generateNpcText } from '../utils/npcEngine';

type NewPost = Pick<Post, 'content' | 'media'>;
type NewReply = Pick<Reply, 'authorId' | 'authorName' | 'authorHandle' | 'avatar' | 'body' | 'parentReplyId'>;

type FeedStore = {
  posts: Post[];
  repliesByPost: Record<string, Reply[]>;
  relationships: Record<string, RelationshipState>;
  memories: Record<string, NPCMemory[]>;
  simulationTick: number;
  playerStats: PlayerEngagementStats;
  toggleLike: (postId: string) => void;
  toggleRepost: (postId: string) => void;
  addReply: (postId: string, reply: NewReply) => void;
  publishPost: (post: NewPost) => void;
  getRankedPosts: () => Post[];
  simulateNpcTick: () => void;
  adjustRelationship: (npcId: string, amount: number) => void;
  toggleReplyLike: (postId: string, replyId: string) => void;
};

const now = Date.now();

const initialPosts: Post[] = [
  {
    id: 'ginny-owl-respect',
    authorId: 'ginny',
    authorName: 'Ginny Weasley',
    authorHandle: '@thebestweasley',
    authorKind: 'npc',
    verified: true,
    content:
      'HONESTLY why do the owls get more respect than we do? they literally just poop on everything and the professors LOVE them',
    createdAt: now - 1000 * 60 * 12,
    comments: 21,
    reposts: 10500,
    likes: 399700,
    views: 1200000,
    tension: 0.7,
    affinity: 0.9,
  },
  {
    id: 'quidditch-stats',
    authorId: 'quidditch-stats',
    authorName: 'Quidditch Stats',
    authorHandle: '@quidditch_stats',
    authorKind: 'npc',
    verified: true,
    content: 'The Slytherin seeker has missed three catches in a row. That is not a coincidence.',
    createdAt: now - 1000 * 60 * 34,
    comments: 84,
    reposts: 3200,
    likes: 76200,
    views: 430000,
    tension: 0.95,
    affinity: 0.45,
  },
  {
    id: 'hermione-library',
    authorId: 'hermione',
    authorName: 'Hermione Granger',
    authorHandle: '@actually_reading',
    authorKind: 'npc',
    verified: true,
    content: 'Reminder: the library closes at eight. Please stop treating restricted books like a personal challenge.',
    createdAt: now - 1000 * 60 * 68,
    comments: 13,
    reposts: 740,
    likes: 15800,
    views: 98000,
    tension: 0.3,
    affinity: 0.6,
  },
];

const initialReplies: Record<string, Reply[]> = {
  'ginny-owl-respect': [
    { id: 'snitch-sniffer', postId: 'ginny-owl-respect', authorId: 'snitch-sniffer', authorName: 'snitch_sniffer', authorHandle: '@snitch_sniffer', avatar: 'https://i.pravatar.cc/150?u=snitch-sniffer', body: 'they basically have unlimited travel passes while we get detention for breathing in the wrong corridor', likes: 439, createdAt: now - 1000 * 60 * 9 },
    { id: 'potion-steward', postId: 'ginny-owl-respect', authorId: 'potion-steward', authorName: 'potion_steward', authorHandle: '@potion_steward', avatar: 'https://i.pravatar.cc/150?u=potion-steward', body: '@snitch_sniffer actually true. filch treats those birds like royalty and us like prisoners', likes: 222, createdAt: now - 1000 * 60 * 7 },
    { id: 'cauldron-crash', postId: 'ginny-owl-respect', authorId: 'cauldron-crash', authorName: 'cauldron_crash', authorHandle: '@cauldron_crash', avatar: 'https://i.pravatar.cc/150?u=cauldron-crash', body: 'imagine the amount of bird seed the school spends on them while our feast is just potato mash', likes: 557, createdAt: now - 1000 * 60 * 5 },
    { id: 'perfect-probs', postId: 'ginny-owl-respect', authorId: 'perfect-probs', authorName: 'perfect_probs', authorHandle: '@perfect_probs', avatar: 'https://i.pravatar.cc/150?u=perfect-probs', body: '@thebestweasley tell us how you really feel ginevra', likes: 193, createdAt: now - 1000 * 60 * 3 },
  ],
};

export const npcProfiles: NPCProfile[] = [
  { id: 'ginny', name: 'Ginny Weasley', handle: '@thebestweasley', avatar: 'https://i.pravatar.cc/150?u=ginny', archetype: 'rival', verified: true, baselineSentiment: 0.15, postingFrequency: 0.8, traits: { boldness: 0.9, humor: 0.8, patience: 0.3, suspicion: 0.7, empathy: 0.45 }, speakingStyle: 'sarcastic, competitive, emotionally guarded' },
  { id: 'hermione', name: 'Hermione Granger', handle: '@actually_reading', avatar: 'https://i.pravatar.cc/150?u=hermione', archetype: 'authority', verified: true, baselineSentiment: 0.35, postingFrequency: 0.35, traits: { boldness: 0.6, humor: 0.4, patience: 0.8, suspicion: 0.6, empathy: 0.7 }, speakingStyle: 'precise, principled, corrective' },
  { id: 'quidditch-stats', name: 'Quidditch Stats', handle: '@quidditch_stats', avatar: 'https://i.pravatar.cc/150?u=quidditch-stats', archetype: 'commentator', verified: true, baselineSentiment: 0.05, postingFrequency: 0.6, traits: { boldness: 0.5, humor: 0.3, patience: 0.5, suspicion: 0.8, empathy: 0.2 }, speakingStyle: 'brief, factual, dramatic' },
];

const initialRelationships: Record<string, RelationshipState> = Object.fromEntries(
  npcProfiles.map((npc) => [
    npc.id,
    {
      npcId: npc.id,
      affinity: npc.id === 'ginny' ? 0.9 : npc.id === 'hermione' ? 0.6 : 0.45,
      sentiment: npc.id === 'ginny' ? 'amused' : 'neutral',
      lastInteractionAt: now,
    },
  ]),
);

const initialMemories: Record<string, NPCMemory[]> = {
  ginny: [{ id: 'ginny-player-chaos', npcId: 'ginny', summary: 'The player thrives on public chaos.', emotionalWeight: 0.5, importance: 0.8, createdAt: now }],
  hermione: [{ id: 'hermione-player-citations', npcId: 'hermione', summary: 'The player needs reminders to support bold claims with evidence.', emotionalWeight: 0.2, importance: 0.6, createdAt: now }],
  'quidditch-stats': [],
};

function rankPost(post: Post, currentTime: number): number {
  const ageInHours = Math.max(0, (currentTime - post.createdAt) / (1000 * 60 * 60));
  const freshness = Math.max(0, 1 - ageInHours / 48);
  const engagement = Math.min(1, Math.log10(post.likes + post.reposts * 2 + post.comments * 3 + 1) / 8);
  const velocity = Math.min(1, (post.comments * 4 + post.reposts * 2 + post.likes) / Math.max(1, post.views));
  const playerSignal =
    (post.likedByPlayer ? 0.3 : 0) +
    (post.repostedByPlayer ? 0.4 : 0) +
    post.affinity * 0.25;

  return freshness * 0.3 + engagement * 0.22 + velocity * 0.13 + post.tension * 0.2 + playerSignal * 0.15;
}

export function rankPosts(posts: Post[], currentTime = Date.now()): Post[] {
  return [...posts].sort((a, b) => {
    const scoreDifference = rankPost(b, currentTime) - rankPost(a, currentTime);
    return Math.abs(scoreDifference) > 0.0001 ? scoreDifference : b.createdAt - a.createdAt;
  });
}

export const useFeedStore = create<FeedStore>((set, get) => ({
  posts: initialPosts,
  repliesByPost: initialReplies,
  relationships: initialRelationships,
  memories: initialMemories,
  simulationTick: 0,
  playerStats: {
    likesGiven: 0,
    repliesWritten: 0,
    repostsMade: 0,
    reach: 0,
  },

  toggleLike: (postId) =>
    set((state) => {
      const post = state.posts.find((item) => item.id === postId);
      if (!post) return state;

      const liked = !post.likedByPlayer;
      return {
        posts: state.posts.map((item) =>
          item.id === postId
            ? { ...item, likedByPlayer: liked, likes: Math.max(0, item.likes + (liked ? 1 : -1)), tension: Math.min(1, item.tension + (liked ? 0.015 : -0.01)) }
            : item,
        ),
        playerStats: {
          ...state.playerStats,
          likesGiven: Math.max(0, state.playerStats.likesGiven + (liked ? 1 : -1)),
          reach: Math.max(0, state.playerStats.reach + (liked ? Math.ceil((post.tension + post.affinity) * 3) : -Math.ceil((post.tension + post.affinity) * 3))),
        },
      };
    }),

  toggleRepost: (postId) =>
    set((state) => {
      const post = state.posts.find((item) => item.id === postId);
      if (!post) return state;

      const reposted = !post.repostedByPlayer;
      return {
        posts: state.posts.map((item) =>
          item.id === postId
            ? { ...item, repostedByPlayer: reposted, reposts: Math.max(0, item.reposts + (reposted ? 1 : -1)), tension: Math.min(1, item.tension + (reposted ? 0.04 : -0.02)) }
            : item,
        ),
        playerStats: {
          ...state.playerStats,
          repostsMade: Math.max(0, state.playerStats.repostsMade + (reposted ? 1 : -1)),
          reach: Math.max(0, state.playerStats.reach + (reposted ? Math.ceil((post.tension + post.affinity) * 10) : -Math.ceil((post.tension + post.affinity) * 10))),
        },
      };
    }),

  addReply: (postId, reply) =>
    set((state) => ({
      repliesByPost: {
        ...state.repliesByPost,
        [postId]: [...(state.repliesByPost[postId] ?? []), { ...reply, postId, id: `${reply.authorId}-${Date.now()}`, likes: 0, createdAt: Date.now() }],
      },
      posts: state.posts.map((item) =>
        item.id === postId ? { ...item, comments: item.comments + 1, tension: Math.min(1, item.tension + 0.03) } : item,
      ),
      playerStats: {
        ...state.playerStats,
        repliesWritten: state.playerStats.repliesWritten + 1,
        reach: state.playerStats.reach + Math.ceil(2 + postAffinity(state.posts, postId) * 3),
      },
    })),

  publishPost: ({ content, media }) =>
    set((state) => ({
      posts: [
        {
          id: `player-${Date.now()}`,
          authorId: 'player',
          authorName: 'Raghav',
          authorHandle: '@raghav',
          authorKind: 'player',
          verified: true,
          content,
          createdAt: Date.now(),
          comments: 0,
          reposts: 0,
          likes: 0,
          views: 1,
          tension: 0.5,
          affinity: 1,
          media,
        },
        ...state.posts,
      ],
    })),

  getRankedPosts: () => rankPosts(get().posts),

  adjustRelationship: (npcId, amount) =>
    set((state) => {
      const relationship = state.relationships[npcId];
      if (!relationship) return state;
      const affinity = Math.max(-1, Math.min(1, relationship.affinity + amount));
      return {
        relationships: {
          ...state.relationships,
          [npcId]: {
            ...relationship,
            affinity,
            sentiment: affinity < -0.5 ? 'hostile' : affinity < 0 ? 'suspicious' : affinity > 0.7 ? 'supportive' : relationship.sentiment,
            lastInteractionAt: Date.now(),
          },
        },
      };
    }),

  toggleReplyLike: (postId, replyId) =>
    set((state) => ({
      repliesByPost: {
        ...state.repliesByPost,
        [postId]: (state.repliesByPost[postId] ?? []).map((reply) =>
          reply.id === replyId
            ? { ...reply, likedByPlayer: !reply.likedByPlayer, likes: Math.max(0, reply.likes + (reply.likedByPlayer ? -1 : 1)) }
            : reply,
        ),
      },
    })),

  simulateNpcTick: () =>
    set((state) => {
      const nextTick = state.simulationTick + 1;
      const npc = npcProfiles[(nextTick - 1) % npcProfiles.length];
      const relationship = state.relationships[npc.id];
      if (!relationship) return { simulationTick: nextTick };

      const target = state.posts.find((post) => post.authorId !== npc.id);
      if (!target) return { simulationTick: nextTick };
      const action = decideNpcAction({
        npc,
        relationship,
        target,
        memories: state.memories[npc.id] ?? [],
        tick: nextTick,
      });
      if (action === 'ignore') return { simulationTick: nextTick };

      if (action === 'reply') {
        const reply: Reply = {
          id: `${npc.id}-sim-${nextTick}`,
          postId: target.id,
          authorId: npc.id,
          authorName: npc.name,
          authorHandle: npc.handle,
          avatar: npc.avatar,
          body: generateNpcText(npc, target, state.memories[npc.id]),
          likes: 0,
          createdAt: Date.now(),
        };
        return {
          simulationTick: nextTick,
          repliesByPost: { ...state.repliesByPost, [target.id]: [...(state.repliesByPost[target.id] ?? []), reply] },
          posts: state.posts.map((post) => post.id === target.id ? { ...post, comments: post.comments + 1, tension: Math.min(1, post.tension + 0.02) } : post),
          relationships: { ...state.relationships, [npc.id]: { ...relationship, affinity: Math.min(1, relationship.affinity + 0.01), lastInteractionAt: Date.now() } },
          memories: { ...state.memories, [npc.id]: [...(state.memories[npc.id] ?? []), { id: `${npc.id}-memory-${nextTick}`, npcId: npc.id, summary: `The player drew attention around "${target.content.slice(0, 40)}".`, emotionalWeight: target.tension, importance: Math.min(1, target.tension + 0.2), createdAt: Date.now() }] },
        };
      }

      const generatedPost: Post = {
        id: `${npc.id}-sim-${nextTick}`,
        authorId: npc.id,
        authorName: npc.name,
        authorHandle: npc.handle,
        authorKind: 'npc',
        verified: npc.verified,
        content: generateNpcText(npc, target, state.memories[npc.id]),
        createdAt: Date.now(),
        comments: 0,
        reposts: 0,
        likes: 0,
        views: 1,
        tension: Math.min(1, 0.35 + Math.max(0, relationship.affinity) * 0.4),
        affinity: relationship.affinity,
      };
      return { simulationTick: nextTick, posts: [generatedPost, ...state.posts] };
    }),
}));

function postAffinity(posts: Post[], postId: string): number {
  return posts.find((post) => post.id === postId)?.affinity ?? 0;
}
