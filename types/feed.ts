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
  authorId: string;
  authorName: string;
  authorHandle: string;
  avatar: string;
  body: string;
  likes: number;
  createdAt: number;
};

export type PlayerEngagementStats = {
  likesGiven: number;
  repliesWritten: number;
  repostsMade: number;
  reach: number;
};
