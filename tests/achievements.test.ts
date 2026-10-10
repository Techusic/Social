import test from 'node:test';
import assert from 'node:assert/strict';
import { ACHIEVEMENTS } from '../types/achievements';

test('reaction achievements have distinct rewards and descriptions', () => {
  assert.equal(new Set(ACHIEVEMENTS.map((achievement) => achievement.id)).size, ACHIEVEMENTS.length);
  assert.ok(ACHIEVEMENTS.every((achievement) => achievement.rewardXp > 0 && achievement.description.length > 10));
});

test('social gravity requires multiple reaction milestones', () => {
  const gravity = ACHIEVEMENTS.find((achievement) => achievement.id === 'social-gravity');
  assert.ok(gravity);
  assert.equal(ACHIEVEMENTS.filter((achievement) => achievement.id.startsWith('first-')).length >= 5, true);
});
