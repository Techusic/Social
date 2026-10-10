export type AchievementId =
  | 'first-reply'
  | 'first-mention'
  | 'first-like'
  | 'first-repost'
  | 'first-follow'
  | 'first-message'
  | 'first-story-reply'
  | 'relationship-spark'
  | 'social-gravity';

export type AchievementDefinition = {
  id: AchievementId;
  title: string;
  description: string;
  rewardXp: number;
};

export type UnlockedAchievement = AchievementDefinition & {
  unlockedAt: number;
  npcId?: string;
};

export const ACHIEVEMENTS: AchievementDefinition[] = [
  { id: 'first-reply', title: 'The Conversation Starts', description: 'An NPC replied to one of your posts.', rewardXp: 5 },
  { id: 'first-mention', title: 'Name in the Feed', description: 'An NPC mentioned you publicly.', rewardXp: 8 },
  { id: 'first-like', title: 'Quiet Approval', description: 'An NPC liked one of your posts.', rewardXp: 4 },
  { id: 'first-repost', title: 'Passed Along', description: 'An NPC reposted one of your posts.', rewardXp: 8 },
  { id: 'first-follow', title: 'People Are Watching', description: 'An NPC started following you.', rewardXp: 10 },
  { id: 'first-message', title: 'An Owl Arrives', description: 'An NPC started a private conversation with you.', rewardXp: 8 },
  { id: 'first-story-reply', title: 'Story Reaction', description: 'An NPC replied to one of your stories.', rewardXp: 6 },
  { id: 'relationship-spark', title: 'Something Changed', description: 'A relationship shifted meaningfully because of your actions.', rewardXp: 10 },
  { id: 'social-gravity', title: 'Social Gravity', description: 'Five different NPC reactions have reached you.', rewardXp: 20 },
];

