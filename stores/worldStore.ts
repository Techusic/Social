import { create } from 'zustand';
import { hydrateWorldStores, loadStore, saveStore } from '../db/worldPersistence';
import type { World, WorldSettings } from '../types/world';

type WorldStore = {
  worlds: World[];
  activeWorldId: string;
  createWorld: (input: Omit<World, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateWorld: (patch: Partial<Pick<World, 'name' | 'theme' | 'tagline' | 'description' | 'coverUri' | 'isPublic'>>) => void;
  updateSettings: (patch: Partial<WorldSettings>) => void;
  setActiveWorld: (worldId: string) => void;
};

const defaultWorld: World = {
  id: 'hogwarts',
  name: 'Harry Potter',
  theme: 'Fantasy school drama',
  tagline: 'Life at Hogwarts plays out through the school feed.',
  description: 'A magical social world filled with rivalries, secrets, and late-night stories.',
  isPublic: true,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  settings: {
    difficulty: 'Hard',
    madnessScale: 'Normal',
    multiplayer: false,
    universeStories: true,
    newsAccounts: true,
    worldTone: 'Social drama, secrets, and magic.',
    npcGuidance: 'Let characters react naturally to public posts and private conversations.',
    newsTone: 'Gossip and breaking news',
  },
};

type PersistedWorldState = Pick<WorldStore, 'worlds' | 'activeWorldId'>;
const persisted = loadStore<PersistedWorldState>('worlds');
const initialState = persisted ?? { worlds: [defaultWorld], activeWorldId: defaultWorld.id };
if (!persisted) saveStore('worlds', initialState);

function persist(state: Pick<WorldStore, 'worlds' | 'activeWorldId'>): void {
  saveStore('worlds', state);
}

export const useWorldStore = create<WorldStore>((set, get) => ({
  ...initialState,
  createWorld: (input) => {
    const timestamp = Date.now();
    const world: World = { ...input, id: `world-${timestamp}`, createdAt: timestamp, updatedAt: timestamp };
    set((state) => {
      const next = { worlds: [world, ...state.worlds], activeWorldId: world.id };
      persist(next);
      return next;
    });
    return world.id;
  },
  updateWorld: (patch) => set((state) => {
    const worlds = state.worlds.map((world) => world.id === state.activeWorldId ? { ...world, ...patch, updatedAt: Date.now() } : world);
    const next = { worlds, activeWorldId: state.activeWorldId };
    persist(next);
    return next;
  }),
  updateSettings: (patch) => set((state) => {
    const worlds = state.worlds.map((world) => world.id === state.activeWorldId ? { ...world, settings: { ...world.settings, ...patch }, updatedAt: Date.now() } : world);
    const next = { worlds, activeWorldId: state.activeWorldId };
    persist(next);
    return next;
  }),
  setActiveWorld: (worldId) => {
    if (!get().worlds.some((world) => world.id === worldId)) return;
    set((state) => {
      const next = { worlds: state.worlds, activeWorldId: worldId };
      persist(next);
      return next;
    });
    hydrateWorldStores(worldId);
  },
}));

export function getActiveWorld(): World {
  const state = useWorldStore.getState();
  return state.worlds.find((world) => world.id === state.activeWorldId) ?? defaultWorld;
}

export function getActiveWorldId(): string {
  return useWorldStore.getState().activeWorldId;
}
