export type DifficultyMode = 'Relaxed' | 'Normal' | 'Hard';
export type MadnessScale = 'Low' | 'Normal' | 'Chaotic';

export type WorldSettings = {
  difficulty: DifficultyMode;
  madnessScale: MadnessScale;
  multiplayer: boolean;
  universeStories: boolean;
  newsAccounts: boolean;
  worldTone: string;
  npcGuidance: string;
  newsTone: string;
};

export type World = {
  id: string;
  name: string;
  theme: string;
  tagline: string;
  description: string;
  coverUri?: string;
  isPublic: boolean;
  createdAt: number;
  updatedAt: number;
  settings: WorldSettings;
};

