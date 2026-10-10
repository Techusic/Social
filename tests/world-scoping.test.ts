import test from 'node:test';
import assert from 'node:assert/strict';
import { worldStoreKey } from '../utils/worldKeys';
import { isPlayerRelevantReply } from '../utils/worldRules';
import { canChatWith } from '../utils/profileLinks';

test('world persistence keys keep records isolated', () => {
  assert.equal(worldStoreKey('stories', 'hogwarts'), 'world:hogwarts:stories');
  assert.notEqual(worldStoreKey('stories', 'hogwarts'), worldStoreKey('stories', 'space-academy'));
});

test('NPC conversations can address main-character posts', () => {
  assert.equal(isPlayerRelevantReply('player', 'ginny', '@raghav you are impossible'), true);
  assert.equal(isPlayerRelevantReply('hermione', 'ginny', '@raghav cite your sources'), true);
});

test('only main characters can start direct chats', () => {
  assert.equal(canChatWith('ginny'), true);
  assert.equal(canChatWith('hermione'), true);
  assert.equal(canChatWith('quidditch-stats'), false);
});
