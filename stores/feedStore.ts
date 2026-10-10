import { create } from 'zustand';

import { loadFeedSnapshot, saveFeedSnapshot } from '../db/feedPersistence';
import { registerWorldHydrator } from '../db/worldPersistence';
import type { FeedMode } from '../db/feedPersistence';
import type { NPCMemory, NPCProfile, PlayerEngagementStats, Post, RelationshipState, Reply } from '../types/feed';
import { getVisiblePosts, rankPosts, sortPostsChronologically } from '../utils/feedRanking';
import { decideNpcAction, generateNpcText } from '../utils/npcEngine';
import { generateLocalNpcText } from '../utils/localAi';
import { useActivityLogStore } from './activityLogStore';
import { useStoryStore } from './storyStore';
import { useMessageStore } from './messageStore';
import { unlockAchievement } from './achievementStore';
import { addNotification } from './notificationStore';
import { getActiveWorld } from './worldStore';
import { isPlayerRelevantReply, npcChaosMultiplier, shouldGenerateNpcStory } from '../utils/worldRules';

type NewPost = Pick<Post, 'content' | 'media'>;
type NewReply = Pick<Reply, 'authorId' | 'authorName' | 'authorHandle' | 'avatar' | 'body' | 'parentReplyId'>;

type FeedStore = {
  posts: Post[];
  repliesByPost: Record<string, Reply[]>;
  relationships: Record<string, RelationshipState>;
  memories: Record<string, NPCMemory[]>;
  simulationTick: number;
  playerStats: PlayerEngagementStats;
  feedMode: FeedMode;
  toggleLike: (postId: string) => void;
  toggleRepost: (postId: string) => void;
  addReply: (postId: string, reply: NewReply) => void;
  retryReply: (postId: string, replyId: string) => void;
  publishPost: (post: NewPost) => void;
  getRankedPosts: () => Post[];
  getVisiblePosts: () => Post[];
  setFeedMode: (mode: FeedMode) => void;
  simulateNpcTick: () => void;
  adjustRelationship: (npcId: string, amount: number) => void;
  setRelationshipChemistry: (npcId: string, chemistry: NonNullable<RelationshipState['chemistry']>) => void;
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
  'quidditch-stats': [
    { id: 'quidditch-reply-1', postId: 'quidditch-stats', authorId: 'ginny', authorName: 'Ginny Weasley', authorHandle: '@thebestweasley', avatar: 'https://i.pravatar.cc/150?u=ginny', body: 'Three catches is a pattern, not a bad afternoon.', likes: 84, createdAt: now - 1000 * 60 * 22 },
    { id: 'quidditch-reply-2', postId: 'quidditch-stats', authorId: 'hermione', authorName: 'Hermione Granger', authorHandle: '@actually_reading', avatar: 'https://i.pravatar.cc/150?u=hermione', body: 'Please cite the match footage before declaring a conspiracy.', likes: 51, createdAt: now - 1000 * 60 * 18 },
  ],
  'hermione-library': [
    { id: 'library-reply-1', postId: 'hermione-library', authorId: 'ginny', authorName: 'Ginny Weasley', authorHandle: '@thebestweasley', avatar: 'https://i.pravatar.cc/150?u=ginny', body: 'What if the restricted section is simply asking to be read?', likes: 120, createdAt: now - 1000 * 60 * 48 },
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
      chemistry: npc.id === 'ginny' ? 'rivals' : 'acquaintances',
      lastInteractionAt: now,
    },
  ]),
);

const initialMemories: Record<string, NPCMemory[]> = {
  ginny: [{ id: 'ginny-player-chaos', npcId: 'ginny', summary: 'The player thrives on public chaos.', emotionalWeight: 0.5, importance: 0.8, createdAt: now }],
  hermione: [{ id: 'hermione-player-citations', npcId: 'hermione', summary: 'The player needs reminders to support bold claims with evidence.', emotionalWeight: 0.2, importance: 0.6, createdAt: now }],
  'quidditch-stats': [],
};

const activeWorldId = getActiveWorld().id;
const persistedFeedState = loadFeedSnapshot(activeWorldId);
const hydratedFeedState = persistedFeedState ?? {
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
  feedMode: 'ranked',
};

if (!persistedFeedState) {
  saveFeedSnapshot(hydratedFeedState, activeWorldId);
}

export { getVisiblePosts, rankPosts, sortPostsChronologically } from '../utils/feedRanking';

export const useFeedStore = create<FeedStore>((set, get) => ({
  posts: hydratedFeedState.posts,
  repliesByPost: hydratedFeedState.repliesByPost,
  relationships: hydratedFeedState.relationships,
  memories: hydratedFeedState.memories,
  simulationTick: hydratedFeedState.simulationTick,
  playerStats: hydratedFeedState.playerStats,
  feedMode: hydratedFeedState.feedMode ?? 'ranked',

  toggleLike: (postId) =>
    set((state) => {
      const post = state.posts.find((item) => item.id === postId);
      if (!post) return state;

      const liked = !post.likedByPlayer;
      if (liked) {
        useActivityLogStore.getState().record({ kind: 'social', title: 'Liked a post', detail: `You liked ${post.authorName}'s post.` });
      }
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

  toggleRepost: (postId) => {
    const post = get().posts.find((item) => item.id === postId);
    if (!post) return;

    const reposted = !post.repostedByPlayer;
    useActivityLogStore.getState().record({
      kind: 'social',
      title: reposted ? 'Reposted a post' : 'Undid a repost',
      detail: `${reposted ? 'You reposted' : 'You removed your repost from'} ${post.authorName}'s post.`,
    });

    set((state) => ({
        ...state,
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
    }));
  },

  addReply: (postId, reply) =>
    set((state) => {
      const body = reply.body.trim();
      if (!body) {
        return state;
      }

      const existingReplies = state.repliesByPost[postId] ?? [];
      const duplicateReply = existingReplies.some((existingReply) => {
        if (existingReply.authorId !== reply.authorId || existingReply.parentReplyId !== reply.parentReplyId) {
          return false;
        }

        const sameBody = existingReply.body.trim() === body;
        if (!sameBody) {
          return false;
        }

        const ageMs = Date.now() - existingReply.createdAt;
        return ageMs < 5000;
      });

      if (duplicateReply) {
        return state;
      }

      const nextReply: Reply = {
        ...reply,
        body,
        postId,
        id: `${reply.authorId}-${Date.now()}`,
        likes: 0,
        createdAt: Date.now(),
        status: 'sending',
      };
      useActivityLogStore.getState().record({ kind: 'social', title: 'Replied to a post', detail: body });
      const post = state.posts.find((item) => item.id === postId);
      if (post?.authorId === 'player') {
        addNotification('reply', { actorId: reply.authorId, actorName: reply.authorName, actorAvatar: reply.avatar, title: `${reply.authorName} replied to your post`, body, targetId: postId });
      } else if (isPlayerRelevantReply(post?.authorId ?? '', reply.authorId, body)) {
        addNotification('mention', { actorId: reply.authorId, actorName: reply.authorName, actorAvatar: reply.avatar, title: `${reply.authorName} mentioned you`, body, targetId: postId });
      }

      const shouldFail = /(?:^|\s)(?:fail|error)(?:\s|$)/i.test(body);
      setTimeout(() => {
        set((innerState) => ({
          repliesByPost: {
            ...innerState.repliesByPost,
            [postId]: (innerState.repliesByPost[postId] ?? []).map((item) =>
              item.id === nextReply.id
                ? {
                    ...item,
                    status: shouldFail ? 'failed' : 'sent',
                    error: shouldFail ? 'Reply failed to send. Retry.' : undefined,
                  }
                : item,
            ),
          },
        }));
      }, 500);

      return {
        repliesByPost: {
          ...state.repliesByPost,
          [postId]: [...existingReplies, nextReply],
        },
        posts: state.posts.map((item) =>
          item.id === postId ? { ...item, comments: item.comments + 1, tension: Math.min(1, item.tension + 0.03) } : item,
        ),
        playerStats: {
          ...state.playerStats,
          repliesWritten: state.playerStats.repliesWritten + 1,
          reach: state.playerStats.reach + Math.ceil(2 + postAffinity(state.posts, postId) * 3),
        },
      };
    }),

  retryReply: (postId, replyId) =>
    set((state) => {
      const currentReply = (state.repliesByPost[postId] ?? []).find((reply) => reply.id === replyId);
      if (!currentReply) return state;

      const shouldFail = /(?:^|\s)(?:fail|error)(?:\s|$)/i.test(currentReply.body);
      setTimeout(() => {
        set((innerState) => ({
          repliesByPost: {
            ...innerState.repliesByPost,
            [postId]: (innerState.repliesByPost[postId] ?? []).map((reply) =>
              reply.id === replyId
                ? {
                    ...reply,
                    status: shouldFail ? 'failed' : 'sent',
                    error: shouldFail ? 'Reply failed to send. Retry.' : undefined,
                  }
                : reply,
            ),
          },
        }));
      }, 500);

      return {
        repliesByPost: {
          ...state.repliesByPost,
          [postId]: (state.repliesByPost[postId] ?? []).map((reply) =>
            reply.id === replyId ? { ...reply, status: 'sending', error: undefined } : reply,
          ),
        },
      };
    }),

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
  getVisiblePosts: () => getVisiblePosts(get().posts, get().feedMode),
  setFeedMode: (mode) => set({ feedMode: mode }),

  adjustRelationship: (npcId, amount) =>
    set((state) => {
      const relationship = state.relationships[npcId];
      if (!relationship) return state;
      const affinity = Math.max(-1, Math.min(1, relationship.affinity + amount));
      const npc = npcProfiles.find((item) => item.id === npcId);
      if (npc && Math.abs(amount) >= 0.03) {
        addNotification('relationship', {
          actorId: npc.id,
          actorName: npc.name,
          actorAvatar: npc.avatar,
          title: `${npc.name} relationship changed`,
          body: amount > 0 ? 'Your bond is getting stronger.' : 'Your relationship has become more strained.',
          targetId: npc.id,
        });
        unlockAchievement('relationship-spark', npcId);
      }
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

  setRelationshipChemistry: (npcId, chemistry) =>
    set((state) => {
      const relationship = state.relationships[npcId];
      if (!relationship) return state;
      return {
        relationships: {
          ...state.relationships,
          [npcId]: { ...relationship, chemistry, lastInteractionAt: Date.now() },
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

      const visiblePosts = state.posts.filter((post) => post.authorId !== npc.id);
      const target = visiblePosts.length > 0 ? visiblePosts[(nextTick - 1) % visiblePosts.length] : undefined;
      if (!target) return { simulationTick: nextTick };
      const action = decideNpcAction({
        npc,
        relationship,
        target,
        memories: state.memories[npc.id] ?? [],
        tick: nextTick,
      });
      const world = getActiveWorld();
      const chaosMultiplier = npcChaosMultiplier(world.settings.madnessScale);
      const shouldPostInstead = world.settings.difficulty === 'Relaxed' && nextTick % 4 === 0;
      const effectiveAction = shouldPostInstead ? 'post' : action;
      const generatedText = generateNpcText(npc, target, state.memories[npc.id]);
      const viewedPosts = state.posts.map((post) =>
        post.id === target.id ? { ...post, views: post.views + 1 } : post,
      );
      if (target.authorId === 'player' && nextTick % 2 === 0) {
        addNotification('like', { actorId: npc.id, actorName: npc.name, actorAvatar: npc.avatar, title: `${npc.name} liked your post`, body: target.content, targetId: target.id });
        unlockAchievement('first-like', npc.id);
      }
      if (target.authorId === 'player' && nextTick % 4 === 0) {
        addNotification('repost', { actorId: npc.id, actorName: npc.name, actorAvatar: npc.avatar, title: `${npc.name} reposted your post`, body: target.content, targetId: target.id });
        unlockAchievement('first-repost', npc.id);
      }
      if (target.authorId === 'player' && nextTick % 7 === 0) {
        addNotification('follow', { actorId: npc.id, actorName: npc.name, actorAvatar: npc.avatar, title: `${npc.name} is now following you`, body: 'Your world activity caught their attention.', targetId: npc.id });
        unlockAchievement('first-follow', npc.id);
      }
      if (target.authorId === 'player' && nextTick % 3 === 0) {
        useMessageStore.getState().receiveMessage(npc, generatedText);
        unlockAchievement('first-message', npc.id);
      }
      if (effectiveAction === 'ignore' || (chaosMultiplier < 1 && nextTick % 3 === 0)) return { simulationTick: nextTick, posts: viewedPosts };

      if (effectiveAction === 'reply') {
        const replyId = `${npc.id}-sim-${nextTick}`;
        const reply: Reply = {
          id: replyId,
          postId: target.id,
          authorId: npc.id,
          authorName: npc.name,
          authorHandle: npc.handle,
          avatar: npc.avatar,
          body: nextTick % 2 === 0 && target.authorId === 'player' ? `@raghav ${generatedText}` : generatedText,
          likes: 0,
          createdAt: Date.now(),
        };
        if (isPlayerRelevantReply(target.authorId, npc.id, reply.body)) {
          addNotification('reply', { actorId: npc.id, actorName: npc.name, actorAvatar: npc.avatar, title: `${npc.name} replied to you`, body: reply.body, targetId: target.id });
          unlockAchievement(reply.body.includes('@raghav') ? 'first-mention' : 'first-reply', npc.id);
        }
        const nextState = {
          simulationTick: nextTick,
          repliesByPost: { ...state.repliesByPost, [target.id]: [...(state.repliesByPost[target.id] ?? []), reply] },
          posts: viewedPosts.map((post) => post.id === target.id ? { ...post, comments: post.comments + 1, tension: Math.min(1, post.tension + 0.02) } : post),
          relationships: { ...state.relationships, [npc.id]: { ...relationship, affinity: Math.min(1, relationship.affinity + 0.01), lastInteractionAt: Date.now() } },
          memories: { ...state.memories, [npc.id]: [...(state.memories[npc.id] ?? []), { id: `${npc.id}-memory-${nextTick}`, npcId: npc.id, summary: `The player drew attention around "${target.content.slice(0, 40)}".`, emotionalWeight: target.tension, importance: Math.min(1, target.tension + 0.2), createdAt: Date.now() }] },
        };
        void generateLocalNpcText(
          npc,
          `Reply to this post: "${target.content}". Existing deterministic draft: "${reply.body}".`,
        ).then((text) => {
          if (!text) return;
          useFeedStore.setState((current) => ({
            repliesByPost: {
              ...current.repliesByPost,
              [target.id]: (current.repliesByPost[target.id] ?? []).map((item) =>
                item.id === replyId
                  ? { ...item, body: target.authorId === 'player' && reply.body.startsWith('@raghav') ? `@raghav ${text}` : text }
                  : item,
              ),
            },
          }));
        });
        return nextState;
      }

      const generatedPost: Post = {
        id: `${npc.id}-sim-${nextTick}`,
        authorId: npc.id,
        authorName: npc.name,
        authorHandle: npc.handle,
        authorKind: 'npc',
        verified: npc.verified,
        content: nextTick % 2 === 0 && target.authorId === 'player' ? `@raghav ${generatedText}` : generatedText,
        createdAt: Date.now(),
        comments: 0,
        reposts: 0,
        likes: 0,
        views: 1,
        tension: Math.min(1, 0.35 + Math.max(0, relationship.affinity) * 0.4),
        affinity: relationship.affinity,
      };
      if (shouldGenerateNpcStory(world.settings.universeStories, nextTick, world.settings.madnessScale)) {
        useStoryStore.getState().addNpcStory({
          authorId: npc.id,
          authorName: npc.name,
          handle: npc.handle,
          avatar: npc.avatar,
          verified: npc.verified,
          thought: `A live update from ${npc.name}.`,
          text: generatedText,
        });
      }
      if (world.settings.universeStories && nextTick % 4 === 0) {
        const playerStory = useStoryStore.getState().stories.find((story) => story.authorId === 'player');
        if (playerStory) {
          useStoryStore.getState().addNpcComment(playerStory.id, npc, `@raghav ${generatedText}`);
          unlockAchievement('first-story-reply', npc.id);
        }
      }
      if (npc.id === 'quidditch-stats' && !world.settings.newsAccounts) return { simulationTick: nextTick, posts: viewedPosts };
      void generateLocalNpcText(
        npc,
        `Write a short social post inspired by this target: "${target.content}". Existing deterministic draft: "${generatedPost.content}".`,
      ).then((text) => {
        if (!text) return;
        useFeedStore.setState((current) => ({
          posts: current.posts.map((post) =>
            post.id === generatedPost.id
              ? { ...post, content: target.authorId === 'player' && generatedPost.content.startsWith('@raghav') ? `@raghav ${text}` : text }
              : post,
          ),
        }));
      });
      return { simulationTick: nextTick, posts: [generatedPost, ...viewedPosts] };
    }),
}));

useFeedStore.subscribe((state) => {
  const worldId = getActiveWorld().id;
  saveFeedSnapshot({
    posts: state.posts,
    repliesByPost: state.repliesByPost,
    relationships: state.relationships,
    memories: state.memories,
    simulationTick: state.simulationTick,
    playerStats: state.playerStats,
    feedMode: state.feedMode,
  }, worldId);
});

registerWorldHydrator((worldId) => {
  const snapshot = loadFeedSnapshot(worldId) ?? {
    posts: initialPosts,
    repliesByPost: initialReplies,
    relationships: initialRelationships,
    memories: initialMemories,
    simulationTick: 0,
    playerStats: { likesGiven: 0, repliesWritten: 0, repostsMade: 0, reach: 0 },
    feedMode: 'ranked' as FeedMode,
  };
  useFeedStore.setState(snapshot);
  saveFeedSnapshot(snapshot, worldId);
});

function postAffinity(posts: Post[], postId: string): number {
  return posts.find((post) => post.id === postId)?.affinity ?? 0;
}
