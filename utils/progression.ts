export const XP_PER_LEVEL = 35;

export type Progression = {
  level: number;
  currentXp: number;
  nextLevelXp: number;
  progress: number;
};

export function getProgression(xp: number): Progression {
  const safeXp = Math.max(0, Math.floor(xp));
  const level = Math.floor(safeXp / XP_PER_LEVEL) + 1;
  const currentXp = safeXp % XP_PER_LEVEL;

  return {
    level,
    currentXp,
    nextLevelXp: XP_PER_LEVEL,
    progress: currentXp / XP_PER_LEVEL,
  };
}
