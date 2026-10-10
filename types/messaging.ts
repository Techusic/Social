export type MessageSide = 'player' | 'character';
export type MessageDelivery = 'sending' | 'sent' | 'read';

export type ChatMessage = {
  id: string;
  conversationId: string;
  body: string;
  side: MessageSide;
  createdAt: number;
  delivery: MessageDelivery;
  rate?: boolean;
};

export type ConversationState = {
  id: string;
  participantId: string;
  participantName: string;
  participantHandle: string;
  avatar: string;
  messages: ChatMessage[];
  unreadCount: number;
  isTyping: boolean;
  relationshipDelta: string;
  mood: string;
};
