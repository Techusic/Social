import { create } from 'zustand';
import { getActiveWorld } from './worldStore';
import { loadStore, registerWorldHydrator, saveStore, worldStoreKey } from '../db/worldPersistence';
import { ACHIEVEMENTS, type AchievementId, type UnlockedAchievement } from '../types/achievements';
import { useActivityLogStore } from './activityLogStore';
import { addNotification } from './notificationStore';

type AchievementStore = {
  unlocked: UnlockedAchievement[];
  totalXp: number;
  unlock: (id: AchievementId, npcId?: string) => void;
};

type PersistedAchievementState = Pick<AchievementStore, 'unlocked' | 'totalXp'>;

function loadAchievements(worldId: string): PersistedAchievementState {
  return loadStore<PersistedAchievementState>(worldStoreKey('achievements', worldId)) ?? { unlocked: [], totalXp: 0 };
}

function persist(state: PersistedAchievementState, worldId = getActiveWorld().id): void {
  saveStore(worldStoreKey('achievements', worldId), state);
}

export const useAchievementStore = create<AchievementStore>((set) => ({
  ...loadAchievements(getActiveWorld().id),
  unlock: (id, npcId) =>
    set((state) => {
      if (state.unlocked.some((item) => item.id === id)) return state;
      const definition = ACHIEVEMENTS.find((item) => item.id === id);
      if (!definition) return state;
      const achievement = { ...definition, unlockedAt: Date.now(), npcId };
      const unlocked = [...state.unlocked, achievement];
      const gravity = unlocked.length >= 5 && !state.unlocked.some((item) => item.id === 'social-gravity')
        ? ACHIEVEMENTS.find((item) => item.id === 'social-gravity')
        : undefined;
      if (gravity) unlocked.push({ ...gravity, unlockedAt: Date.now(), npcId });
      const totalXp = state.totalXp + definition.rewardXp + (gravity?.rewardXp ?? 0);
      persist({ unlocked, totalXp });
      useActivityLogStore.getState().record({ kind: 'social', title: `Achievement unlocked: ${definition.title}`, detail: `${definition.description} +${definition.rewardXp} XP` });
      addNotification('achievement', { actorName: 'Social', title: definition.title, body: `${definition.description} +${definition.rewardXp} XP`, targetId: id });
      if (gravity) {
        useActivityLogStore.getState().record({ kind: 'social', title: `Achievement unlocked: ${gravity.title}`, detail: `${gravity.description} +${gravity.rewardXp} XP` });
        addNotification('achievement', { actorName: 'Social', title: gravity.title, body: `${gravity.description} +${gravity.rewardXp} XP`, targetId: gravity.id });
      }
      return { unlocked, totalXp };
    }),
}));

export function unlockAchievement(id: AchievementId, npcId?: string): void {
  useAchievementStore.getState().unlock(id, npcId);
}

registerWorldHydrator((worldId) => useAchievementStore.setState(loadAchievements(worldId)));
