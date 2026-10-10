export type PostAuthorKind = 'npc' | 'player' | 'system';

export type MediaAttachment = {
  id: string;
  uri: string;
  alt?: string;
  type: 'image';
};

export type Post = {
  id: string;
  authorId: string;
  authorName: string;
  authorHandle: string;
  authorKind: PostAuthorKind;
  verified: boolean;
  content: string;
  createdAt: number;
  comments: number;
  reposts: number;
  likes: number;
  views: number;
  tension: number;
  affinity: number;
  media?: MediaAttachment[];
  likedByPlayer?: boolean;
  repostedByPlayer?: boolean;
};

export type Reply = {
  id: string;
  postId: string;
  parentReplyId?: string;
  authorId: string;
  authorName: string;
  authorHandle: string;
  avatar: string;
  body: string;
  likes: number;
  createdAt: number;
  likedByPlayer?: boolean;
};

export type NPCArchetype = 'rival' | 'ally' | 'authority' | 'commentator';

export type NPCProfile = {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  archetype: NPCArchetype;
  verified: boolean;
  baselineSentiment: number;
  postingFrequency: number;
  traits: {
    boldness: number;
    humor: number;
    patience: number;
    suspicion: number;
    empathy: number;
  };
  speakingStyle: string;
};

export type NPCMemory = {
  id: string;
  npcId: string;
  summary: string;
  emotionalWeight: number;
  importance: number;
  createdAt: number;
};

export type RelationshipState = {
  npcId: string;
  affinity: number;
  sentiment: 'hostile' | 'suspicious' | 'neutral' | 'amused' | 'supportive';
  lastInteractionAt: number;
};

export type PlayerEngagementStats = {
  likesGiven: number;
  repliesWritten: number;
  repostsMade: number;
  reach: number;
};
