import { create } from 'zustand';
import { loadStore, saveStore } from '../db/worldPersistence';

export type Story = {
  id: string;
  authorId: string;
  authorName: string;
  handle: string;
  avatar: string;
  verified?: boolean;
  text: string;
  thought: string;
  imageUri?: string;
  viewed?: boolean;
};

export type StoryComment = {
  id: string;
  storyId: string;
  authorName: string;
  avatar: string;
  body: string;
  createdAt: number;
};

type StoryStore = {
  stories: Story[];
  commentsByStory: Record<string, StoryComment[]>;
  likedStoryIds: string[];
  addStory: (story: Omit<Story, 'id' | 'viewed'>) => void;
  addNpcStory: (story: Omit<Story, 'id' | 'viewed'>) => void;
  markViewed: (storyId: string) => void;
  addComment: (storyId: string, body: string) => void;
  toggleLike: (storyId: string) => void;
};

type PersistedStoryState = Pick<StoryStore, 'stories' | 'commentsByStory' | 'likedStoryIds'>;

const initialStories: Story[] = [
  {
    id: 'ginny-story',
    authorId: 'ginny',
    authorName: 'Ginny Weasley',
    handle: '@thebestweasley',
    avatar: 'https://i.pravatar.cc/150?u=ginny',
    verified: true,
    thought: 'He is actually becoming the main character of...',
    text: 'i failed my charms essay',
  },
  {
    id: 'hermione-story',
    authorId: 'hermione',
    authorName: 'Hermione Granger',
    handle: '@actually_reading',
    avatar: 'https://i.pravatar.cc/150?u=hermione',
    verified: true,
    thought: 'A study break is still a study break.',
    text: 'Someone has moved my annotated books again.',
  },
  {
    id: 'ophelia-story',
    authorId: 'ophelia',
    authorName: 'Ophelia',
    handle: '@ophelia',
    avatar: 'https://i.pravatar.cc/150?u=Ophelia',
    thought: 'The castle has opinions tonight.',
    text: 'The common room gossip is getting specific.',
  },
  {
    id: 'cherry-story',
    authorId: 'cherry',
    authorName: 'Cherry',
    handle: '@cherry',
    avatar: 'https://i.pravatar.cc/150?u=Cherry',
    thought: 'Do not ask where I found this.',
    text: 'This is either genius or a terrible idea.',
  },
  {
    id: 'draco-story',
    authorId: 'draco',
    authorName: 'Draco',
    handle: '@draco',
    avatar: 'https://i.pravatar.cc/150?u=Draco',
    verified: true,
    thought: 'Some people need a reminder about standards.',
    text: 'The dress code is not optional.',
  },
];

const initialState: PersistedStoryState = loadStore<PersistedStoryState>('stories') ?? {
  stories: initialStories,
  commentsByStory: {
    'ginny-story': [
      { id: 'ginny-comment-1', storyId: 'ginny-story', authorName: 'Hermione Granger', avatar: 'https://i.pravatar.cc/150?u=hermione', body: 'You did not fail. You merely chose chaos over revision.', createdAt: Date.now() - 1000 * 60 * 18 },
      { id: 'ginny-comment-2', storyId: 'ginny-story', authorName: 'Raghav', avatar: 'https://i.pravatar.cc/150?u=raghav', body: 'That sounds like a very fixable problem.', createdAt: Date.now() - 1000 * 60 * 7 },
    ],
    'hermione-story': [
      { id: 'hermione-comment-1', storyId: 'hermione-story', authorName: 'Ginny Weasley', avatar: 'https://i.pravatar.cc/150?u=ginny', body: 'I moved one. It needed better company.', createdAt: Date.now() - 1000 * 60 * 11 },
    ],
  },
  likedStoryIds: [],
};

function persist(state: PersistedStoryState): void {
  saveStore('stories', state);
}

export const useStoryStore = create<StoryStore>((set) => ({
  ...initialState,
  addStory: (story) =>
    set((state) => {
      const next = { stories: [{ ...story, id: `story-${Date.now()}`, viewed: false }, ...state.stories], commentsByStory: state.commentsByStory, likedStoryIds: state.likedStoryIds };
      persist(next);
      return next;
    }),
  addNpcStory: (story) =>
    set((state) => {
      const next = { stories: [{ ...story, id: `npc-story-${Date.now()}`, viewed: false }, ...state.stories].slice(0, 30), commentsByStory: state.commentsByStory, likedStoryIds: state.likedStoryIds };
      persist(next);
      return next;
    }),
  markViewed: (storyId) =>
    set((state) => {
      const story = state.stories.find((item) => item.id === storyId);
      if (!story || story.viewed) return state;
      const next = {
        stories: state.stories.map((item) => (item.id === storyId ? { ...item, viewed: true } : item)),
        commentsByStory: state.commentsByStory,
        likedStoryIds: state.likedStoryIds,
      };
      persist(next);
      return next;
    }),
  addComment: (storyId, body) => {
    const trimmed = body.trim();
    if (!trimmed) return;
    set((state) => {
      const next = {
        stories: state.stories,
        likedStoryIds: state.likedStoryIds,
        commentsByStory: {
        ...state.commentsByStory,
        [storyId]: [
          ...(state.commentsByStory[storyId] ?? []),
          { id: `comment-${Date.now()}`, storyId, authorName: 'Raghav', avatar: 'https://i.pravatar.cc/150?u=raghav', body: trimmed, createdAt: Date.now() },
        ],
        },
      };
      persist(next);
      return next;
    });
  },
  toggleLike: (storyId) =>
    set((state) => {
      const next = {
        stories: state.stories,
        commentsByStory: state.commentsByStory,
        likedStoryIds: state.likedStoryIds.includes(storyId)
        ? state.likedStoryIds.filter((id) => id !== storyId)
        : [...state.likedStoryIds, storyId],
      };
      persist(next);
      return next;
    }),
}));
