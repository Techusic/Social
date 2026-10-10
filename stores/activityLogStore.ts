import { create } from 'zustand';
import { loadStore, registerWorldHydrator, saveStore, worldStoreKey } from '../db/worldPersistence';
import { getActiveWorld } from './worldStore';

export type ActivityLogKind = 'world' | 'social' | 'chat' | 'event' | 'activity';

export type ActivityLogEntry = {
  id: string;
  kind: ActivityLogKind;
  title: string;
  detail: string;
  createdAt: number;
};

type ActivityLogStore = {
  entries: ActivityLogEntry[];
  record: (entry: Omit<ActivityLogEntry, 'id' | 'createdAt'>) => void;
};

const defaultEntries: ActivityLogEntry[] = [
    {
      id: 'log-world-start',
      kind: 'world',
      title: 'Entered Hogwarts',
      detail: 'You started playing in the Harry Potter world.',
      createdAt: Date.now() - 1000 * 60 * 60 * 4,
    },
];

function loadEntries(worldId: string): ActivityLogEntry[] {
  return loadStore<ActivityLogEntry[]>(worldStoreKey('activity-log', worldId))
    ?? (worldId === 'hogwarts' ? loadStore<ActivityLogEntry[]>('activity-log') : null)
    ?? defaultEntries;
}

export const useActivityLogStore = create<ActivityLogStore>((set) => ({
  entries: loadEntries(getActiveWorld().id),
  record: (entry) =>
    set((state) => {
      const entries = [{ ...entry, id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, createdAt: Date.now() }, ...state.entries];
      saveStore(worldStoreKey('activity-log', getActiveWorld().id), entries);
      return { entries };
    }),
}));

registerWorldHydrator((worldId) => useActivityLogStore.setState({ entries: loadEntries(worldId) }));
