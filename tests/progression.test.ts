import test from 'node:test';
import assert from 'node:assert/strict';
import { getProgression, XP_PER_LEVEL } from '../utils/progression';

test('progression derives level and progress from earned XP', () => {
  assert.deepEqual(getProgression(0), { level: 1, currentXp: 0, nextLevelXp: XP_PER_LEVEL, progress: 0 });
  assert.deepEqual(getProgression(35), { level: 2, currentXp: 0, nextLevelXp: XP_PER_LEVEL, progress: 0 });
  assert.deepEqual(getProgression(47), { level: 2, currentXp: 12, nextLevelXp: XP_PER_LEVEL, progress: 12 / XP_PER_LEVEL });
});

test('progression does not produce negative levels or XP', () => {
  assert.deepEqual(getProgression(-10), { level: 1, currentXp: 0, nextLevelXp: XP_PER_LEVEL, progress: 0 });
});
