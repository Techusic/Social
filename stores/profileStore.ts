import { create } from 'zustand';

type ProfileState = {
  name: string;
  handle: string;
  bio: string;
  description: string;
  avatarUri: string;
  coverUri: string;
  updateProfile: (updates: Partial<Omit<ProfileState, 'updateProfile'>>) => void;
};

export const useProfileStore = create<ProfileState>((set) => ({
  name: 'Raghav',
  handle: '@raghav',
  bio: 'Just here for the drama and the magic 😉.',
  description: "Just here for the drama and the magic. I’m friends with everyone FYI.",
  avatarUri: 'https://i.pravatar.cc/150?u=raghav',
  coverUri: 'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?q=80&w=1000&auto=format&fit=crop',
  updateProfile: (updates) => set(updates),
}));
