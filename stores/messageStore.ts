import { create } from 'zustand';
import { loadStore, saveStore } from '../db/worldPersistence';
import type { ChatMessage, ConversationState } from '../types/messaging';
import type { NPCProfile } from '../types/feed';
import { npcProfiles } from './feedStore';
import { generateNpcText } from '../utils/npcEngine';
import { useActivityLogStore } from './activityLogStore';
import { addNotification } from './notificationStore';

const conversationId = 'ginny';
const initialTime = Date.now();

const initialConversation: ConversationState = {
  id: conversationId,
  participantId: 'ginny',
  participantName: 'Ginny Weasley',
  participantHandle: '@thebestweasley',
  avatar: 'https://i.pravatar.cc/150?u=ginny',
  unreadCount: 0,
  isTyping: false,
  relationshipDelta: '+0.1%',
  mood: 'Smirkingly threatening but less hostile',
  messages: [
    { id: '1', conversationId, body: 'It wasn’t a prank now was it? I saw you take the locket.', side: 'player', createdAt: initialTime - 240000, delivery: 'read' },
    { id: '2', conversationId, body: "Don't get cocky just because you weren't lying for once", side: 'character', createdAt: initialTime - 180000, delivery: 'read' },
    { id: '3', conversationId, body: 'I got it, alright? Now stop hovering over my shoulder like some kind of creep', side: 'character', createdAt: initialTime - 150000, delivery: 'read', rate: true },
    { id: '4', conversationId, body: 'All right all right see you at practice', side: 'player', createdAt: initialTime - 90000, delivery: 'read' },
    { id: '5', conversationId, body: 'Whatever', side: 'character', createdAt: initialTime - 60000, delivery: 'read' },
    { id: '6', conversationId, body: "Just don't be late, or I'm using you for target practice with the Bludgers", side: 'character', createdAt: initialTime - 30000, delivery: 'read', rate: true },
  ],
};

type MessageStore = {
  conversations: Record<string, ConversationState>;
  startConversation: (profile: NPCProfile) => void;
  sendMessage: (conversationId: string, body: string) => void;
  markConversationRead: (conversationId: string) => void;
  setTyping: (conversationId: string, isTyping: boolean) => void;
};

function persistConversations(conversations: Record<string, ConversationState>): void {
  saveStore('messages', conversations);
}

function buildResponse(body: string): string {
  const normalized = body.toLowerCase();
  const ginny = npcProfiles.find((npc) => npc.id === 'ginny');
  if (normalized.includes('sorry')) return 'That is a start. Do not make me regret answering.';
  if (normalized.includes('practice')) return 'You remembered practice? Miracles really do happen.';
  if (normalized.includes('?')) return 'You ask a lot of questions for someone who keeps causing trouble.';
  if (!ginny) return 'Interesting. I will pretend that was almost sensible.';
  return generateNpcText(ginny, {
    id: 'chat-context',
    authorId: 'player',
    authorName: 'You',
    authorHandle: '@you',
    authorKind: 'player',
    verified: false,
    content: body,
    createdAt: Date.now(),
    likes: 0,
    reposts: 0,
    comments: 0,
    views: 0,
    tension: 0.35,
    affinity: 0,
  });
}

export const useMessageStore = create<MessageStore>((set) => ({
  conversations: loadStore<Record<string, ConversationState>>('messages') ?? { [conversationId]: initialConversation },

  startConversation: (profile) =>
    set((state) => {
      if (state.conversations[profile.id]) return state;
      const conversations = {
          ...state.conversations,
          [profile.id]: {
            id: profile.id,
            participantId: profile.id,
            participantName: profile.name,
            participantHandle: profile.handle,
            avatar: profile.avatar,
            unreadCount: 0,
            isTyping: false,
            relationshipDelta: '+0.0%',
            mood: 'Waiting to see what you say',
            messages: [],
          },
        };
      persistConversations(conversations);
      return { conversations };
    }),

  sendMessage: (id, body) => {
    const trimmed = body.trim();
    if (!trimmed) return;

    const createdAt = Date.now();
    const playerMessage: ChatMessage = {
      id: `player-${createdAt}`,
      conversationId: id,
      body: trimmed,
      side: 'player',
      createdAt,
      delivery: 'sending',
    };
    useActivityLogStore.getState().record({
      kind: 'chat',
      title: `Messaged ${stateName(id)}`,
      detail: trimmed,
    });

    set((state) => {
      const conversation = state.conversations[id];
      if (!conversation) return state;
      const conversations = {
          ...state.conversations,
          [id]: { ...conversation, messages: [...conversation.messages, playerMessage] },
        };
      persistConversations(conversations);
      return { conversations };
    });

    setTimeout(() => {
      set((state) => {
        const conversation = state.conversations[id];
        if (!conversation) return state;
        const conversations = {
            ...state.conversations,
            [id]: {
              ...conversation,
              messages: conversation.messages.map((message) => message.id === playerMessage.id ? { ...message, delivery: 'read' as const } : message),
              isTyping: true,
            },
          };
        persistConversations(conversations);
        return { conversations };
      });
    }, 500);

    setTimeout(() => {
      set((state) => {
        const conversation = state.conversations[id];
        if (!conversation) return state;
        const response: ChatMessage = {
          id: `character-${Date.now()}`,
          conversationId: id,
          body: buildResponse(trimmed),
          side: 'character',
          createdAt: Date.now(),
          delivery: 'read',
          rate: true,
        };
        addNotification('message', { actorId: id, actorName: conversation.participantName, actorAvatar: conversation.avatar, title: `New message from ${conversation.participantName}`, body: response.body, targetId: id });
        const conversations = {
            ...state.conversations,
            [id]: { ...conversation, messages: [...conversation.messages, response], isTyping: false, unreadCount: 0 },
          };
        persistConversations(conversations);
        return { conversations };
      });
    }, 1800);
  },

  markConversationRead: (id) =>
    set((state) => {
      const conversation = state.conversations[id];
      if (!conversation || conversation.unreadCount === 0) return state;
      const conversations = { ...state.conversations, [id]: { ...conversation, unreadCount: 0 } };
      persistConversations(conversations);
      return { conversations };
    }),

  setTyping: (id, isTyping) =>
    set((state) => {
      const conversation = state.conversations[id];
      if (!conversation || conversation.isTyping === isTyping) return state;
      const conversations = { ...state.conversations, [id]: { ...conversation, isTyping } };
      persistConversations(conversations);
      return { conversations };
    }),
}));

function stateName(id: string): string {
  return id === 'ginny' ? 'Ginny Weasley' : id;
}
