import { create } from 'zustand';
import { getActiveWorld } from './worldStore';
import { loadStore, registerWorldHydrator, saveStore, worldStoreKey } from '../db/worldPersistence';
import type { PlayerProgress, WorldEvent } from '../types/events';
import { useFeedStore } from './feedStore';
import { useActivityLogStore } from './activityLogStore';
import { addNotification } from './notificationStore';
import { eventConsequenceMultiplier } from '../utils/worldRules';

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

type PersistedEventState = Pick<EventStore, 'events' | 'progress' | 'activeEventId'>;

const defaultState: PersistedEventState = {
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
};
function loadState(worldId: string): PersistedEventState {
  return loadStore<PersistedEventState>(worldStoreKey('events', worldId))
    ?? (worldId === 'hogwarts' ? loadStore<PersistedEventState>('events') : null)
    ?? defaultState;
}
const initialState = loadState(getActiveWorld().id);

export const useEventStore = create<EventStore>((set) => ({
  ...initialState,
  resolveEvent: (eventId, choiceId) =>
    set((state) => {
      const event = state.events.find((item) => item.id === eventId);
      const choice = event?.choices.find((item) => item.id === choiceId);
      if (!event || !choice || event.completed) return state;

      const progress = { ...state.progress, completedEvents: state.progress.completedEvents + 1, xp: state.progress.xp + 5 };
      const multiplier = eventConsequenceMultiplier(getActiveWorld().settings.difficulty);
      choice.consequences.forEach(({ stat, amount }) => {
        progress[stat] = Math.max(0, progress[stat] + Math.round(amount * multiplier));
      });
      if (choice.relationshipDelta) {
        useFeedStore.getState().adjustRelationship(choice.relationshipDelta.npcId, choice.relationshipDelta.amount);
      }
      useActivityLogStore.getState().record({
        kind: 'event',
        title: `Resolved "${event.title}"`,
        detail: choice.label,
      });
      addNotification('event', { actorName: 'World event', title: `Event resolved: ${event.title}`, body: choice.label, targetId: event.id });

      const next = {
        progress,
        events: state.events.map((item) => item.id === eventId ? { ...item, completed: true } : item),
        activeEventId: state.activeEventId,
      };
      saveStore(worldStoreKey('events', getActiveWorld().id), next);
      return next;
    }),
}));

registerWorldHydrator((worldId) => useEventStore.setState(loadState(worldId)));
