import test from 'node:test';
import assert from 'node:assert/strict';
import { eventConsequenceMultiplier, isPlayerRelevantReply, npcChaosMultiplier, shouldGenerateNpcStory } from '../utils/worldRules';

test('world settings produce expected NPC chaos levels', () => {
  assert.equal(npcChaosMultiplier('Low'), 0.7);
  assert.equal(npcChaosMultiplier('Normal'), 1);
  assert.equal(npcChaosMultiplier('Chaotic'), 1.35);
});

test('difficulty scales event consequences', () => {
  assert.equal(eventConsequenceMultiplier('Relaxed'), 0.75);
  assert.equal(eventConsequenceMultiplier('Normal'), 1);
  assert.equal(eventConsequenceMultiplier('Hard'), 1.25);
});

test('story generation respects world settings', () => {
  assert.equal(shouldGenerateNpcStory(false, 5, 'Chaotic'), false);
  assert.equal(shouldGenerateNpcStory(true, 5, 'Normal'), true);
  assert.equal(shouldGenerateNpcStory(true, 4, 'Chaotic'), true);
});

test('reply relevance excludes unrelated NPC conversations', () => {
  assert.equal(isPlayerRelevantReply('ginny-post', 'npc-a', 'hello there'), false);
  assert.equal(isPlayerRelevantReply('player', 'npc-a', 'hello there'), true);
  assert.equal(isPlayerRelevantReply('ginny-post', 'npc-a', 'hey @raghav'), true);
  assert.equal(isPlayerRelevantReply('player-post', 'player', 'self reply'), false);
});
