import type { NPCMemory, NPCProfile, Post, RelationshipState } from '../types/feed';

export type NPCAction = 'ignore' | 'reply' | 'post';

type NPCContext = {
  npc: NPCProfile;
  relationship: RelationshipState;
  target?: Post;
  memories: NPCMemory[];
  tick: number;
};

export function decideNpcAction({ npc, relationship, target, memories, tick }: NPCContext): NPCAction {
  if (!target) return 'post';
  const tensionPressure = target.tension * 0.5;
  const relationshipPressure = Math.abs(relationship.affinity) * 0.25;
  const memoryPressure = Math.min(0.2, memories.filter((memory) => memory.importance > 0.5).length * 0.04);
  const reactionScore = npc.traits.boldness * 0.35 + npc.traits.suspicion * tensionPressure + relationshipPressure + memoryPressure;

  if (reactionScore < 0.3 && tick % 4 !== 0) return 'ignore';
  return tick % 3 === 0 || npc.archetype === 'rival' ? 'reply' : 'post';
}

export function generateNpcText(npc: NPCProfile, target?: Post, memories: NPCMemory[] = []): string {
  const topic = target?.content.split(/[.!?]/)[0].slice(0, 48) ?? 'this situation';
  const hasRelevantMemory = memories.some((memory) => memory.summary.toLowerCase().includes('player'));

  if (npc.archetype === 'rival') {
    return hasRelevantMemory
      ? `You are still doing this? At least be consistent about it.`
      : `That is a very confident take for someone who keeps getting caught.`;
  }
  if (npc.archetype === 'authority') return `For the record, "${topic}" is not a substitute for evidence.`;
  if (npc.archetype === 'commentator') return `Update: "${topic}" is now attracting attention.`;
  return `I do not hate this idea. Do not let that go to your head.`;
}
