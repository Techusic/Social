import { create } from 'zustand';
import { useActivityLogStore } from './activityLogStore';

export type RoleplayActivity = {
  id: string;
  title: string;
  characterIds: string[];
  day: number;
  time: string;
  description?: string;
  createdAt: number;
};

type ActivityStore = {
  activities: RoleplayActivity[];
  addActivity: (activity: Omit<RoleplayActivity, 'id' | 'createdAt'>) => void;
};

export const useActivityStore = create<ActivityStore>((set) => ({
  activities: [],
  addActivity: (activity) =>
    set((state) => {
      const createdAt = Date.now();
      useActivityLogStore.getState().record({
        kind: 'activity',
        title: 'Scheduled an activity',
        detail: activity.title,
      });
      return { activities: [...state.activities, { ...activity, id: `activity-${createdAt}`, createdAt }] };
    }),
}));
