import type { MadnessScale, DifficultyMode } from '../types/world';

export function npcChaosMultiplier(scale: MadnessScale): number {
  if (scale === 'Chaotic') return 1.35;
  if (scale === 'Low') return 0.7;
  return 1;
}

export function eventConsequenceMultiplier(difficulty: DifficultyMode): number {
  if (difficulty === 'Hard') return 1.25;
  if (difficulty === 'Relaxed') return 0.75;
  return 1;
}

export function shouldGenerateNpcStory(universeStories: boolean, tick: number, scale: MadnessScale): boolean {
  if (!universeStories) return false;
  return tick % Math.max(3, Math.round(5 / npcChaosMultiplier(scale))) === 0;
}

export function isPlayerRelevantReply(postAuthorId: string, replyAuthorId: string, body: string): boolean {
  if (replyAuthorId === 'player') return false;
  return postAuthorId === 'player' || /(?:^|\s)@raghav\b/i.test(body);
}

