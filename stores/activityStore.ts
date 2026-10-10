import { create } from 'zustand';

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
    set((state) => ({
      activities: [...state.activities, { ...activity, id: `activity-${Date.now()}`, createdAt: Date.now() }],
    })),
}));
