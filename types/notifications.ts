export type NotificationType = 'reply' | 'mention' | 'like' | 'repost' | 'follow' | 'story-reply' | 'message' | 'relationship' | 'event' | 'achievement';

export type Notification = {
  id: string;
  type: NotificationType;
  actorId?: string;
  actorName: string;
  actorAvatar?: string;
  title: string;
  body: string;
  targetId?: string;
  createdAt: number;
  read: boolean;
};
