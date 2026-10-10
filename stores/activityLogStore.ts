import { create } from 'zustand';
import { loadStore, saveStore } from '../db/worldPersistence';

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
  clear: () => void;
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

const initialEntries = loadStore<ActivityLogEntry[]>('activity-log') ?? defaultEntries;

export const useActivityLogStore = create<ActivityLogStore>((set) => ({
  entries: initialEntries,
  record: (entry) =>
    set((state) => {
      const entries = [{ ...entry, id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, createdAt: Date.now() }, ...state.entries].slice(0, 200);
      saveStore('activity-log', entries);
      return { entries };
    }),
  clear: () => {
    saveStore('activity-log', []);
    set({ entries: [] });
  },
}));
