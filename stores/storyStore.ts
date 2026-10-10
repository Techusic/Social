import { create } from 'zustand';

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

type StoryStore = {
  stories: Story[];
  addStory: (story: Omit<Story, 'id' | 'viewed'>) => void;
  markViewed: (storyId: string) => void;
};

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

export const useStoryStore = create<StoryStore>((set) => ({
  stories: initialStories,
  addStory: (story) =>
    set((state) => ({
      stories: [{ ...story, id: `story-${Date.now()}`, viewed: false }, ...state.stories],
    })),
  markViewed: (storyId) =>
    set((state) => ({
      stories: state.stories.map((story) => (story.id === storyId ? { ...story, viewed: true } : story)),
    })),
}));
