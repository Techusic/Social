import { create } from 'zustand';
import type { PlayerProgress, WorldEvent } from '../types/events';
import { useFeedStore } from './feedStore';

const seededEvent: WorldEvent = {
  id: 'owl-post-accusation',
  title: 'The Owl Post Accusation',
  category: 'Viral rumor',
  prompt: 'A screenshot is spreading that claims you used a school owl to deliver a note into the restricted section. Ginny is asking whether you want to deny it publicly.',
  context: 'Your next move will shape both your reach and how seriously the other students take you.',
  completed: false,
  choices: [
    {
      id: 'own-it',
      label: 'Own the chaos',
      description: 'Post a confident explanation before someone else controls the story.',
      consequences: [{ stat: 'humor', amount: 4 }, { stat: 'clout', amount: 7 }, { stat: 'aura', amount: 2 }],
      relationshipDelta: { npcId: 'ginny', amount: 0.04 },
    },
    {
      id: 'deny-it',
      label: 'Deny everything',
      description: 'Make a careful statement and distance yourself from the rumor.',
      consequences: [{ stat: 'reputation', amount: 5 }, { stat: 'socialSavvy', amount: 3 }, { stat: 'clout', amount: -2 }],
      relationshipDelta: { npcId: 'hermione', amount: 0.03 },
    },
    {
      id: 'stay-silent',
      label: 'Say nothing',
      description: 'Let the rumor burn out while you watch who amplifies it.',
      consequences: [{ stat: 'aura', amount: 5 }, { stat: 'socialSavvy', amount: 2 }],
      relationshipDelta: { npcId: 'ginny', amount: -0.01 },
    },
  ],
};

type EventStore = {
  events: WorldEvent[];
  progress: PlayerProgress;
  activeEventId: string;
  resolveEvent: (eventId: string, choiceId: string) => void;
};

export const useEventStore = create<EventStore>((set) => ({
  events: [seededEvent],
  activeEventId: seededEvent.id,
  progress: {
    humor: 20.7,
    aura: 25.1,
    clout: 12,
    reputation: 3,
    socialSavvy: 1,
    xp: 12,
    completedEvents: 0,
  },
  resolveEvent: (eventId, choiceId) =>
    set((state) => {
      const event = state.events.find((item) => item.id === eventId);
      const choice = event?.choices.find((item) => item.id === choiceId);
      if (!event || !choice || event.completed) return state;

      const progress = { ...state.progress, completedEvents: state.progress.completedEvents + 1, xp: state.progress.xp + 5 };
      choice.consequences.forEach(({ stat, amount }) => {
        progress[stat] = Math.max(0, progress[stat] + amount);
      });
      if (choice.relationshipDelta) {
        useFeedStore.getState().adjustRelationship(choice.relationshipDelta.npcId, choice.relationshipDelta.amount);
      }

      return {
        progress,
        events: state.events.map((item) => item.id === eventId ? { ...item, completed: true } : item),
      };
    }),
}));
