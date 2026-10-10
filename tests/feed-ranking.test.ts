import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { Post } from '../types/feed';
import { getVisiblePosts, rankPosts, sortPostsChronologically } from '../utils/feedRanking';

const now = Date.now();

function makePost(overrides: Partial<Post> = {}): Post {
  return {
    id: 'post-1',
    authorId: 'npc-1',
    authorName: 'Test Author',
    authorHandle: '@testauthor',
    authorKind: 'npc',
    verified: true,
    content: 'Test post content',
    createdAt: now,
    comments: 2,
    reposts: 3,
    likes: 10,
    views: 1000,
    tension: 0.5,
    affinity: 0.4,
    ...overrides,
  };
}

describe('feed ranking helpers', () => {
  it('sorts posts by newest timestamp in chronological mode', () => {
    const older = makePost({ id: 'older', createdAt: now - 1000 * 60 * 40 });
    const newer = makePost({ id: 'newer', createdAt: now - 1000 * 60 * 5 });

    const visiblePosts = sortPostsChronologically([older, newer]);

    assert.deepEqual(visiblePosts.map((post) => post.id), ['newer', 'older']);
  });

  it('ranks posts with stronger engagement and freshness ahead of stale far-lower-activity posts', () => {
    const stale = makePost({
      id: 'stale-post',
      createdAt: now - 1000 * 60 * 60 * 24,
      likes: 100,
      reposts: 10,
      comments: 3,
      views: 20000,
      tension: 0.2,
      affinity: 0.1,
    });
    const live = makePost({
      id: 'live-post',
      createdAt: now - 1000 * 60 * 8,
      likes: 2500,
      reposts: 140,
      comments: 38,
      views: 75000,
      tension: 0.9,
      affinity: 0.8,
    });

    const ranked = rankPosts([stale, live], now);

    assert.equal(ranked[0].id, 'live-post');
    assert.equal(ranked[1].id, 'stale-post');
  });

  it('respects the selected feed mode when resolving visible posts', () => {
    const older = makePost({ id: 'older', createdAt: now - 1000 * 60 * 30 });
    const newer = makePost({ id: 'newer', createdAt: now - 1000 * 60 * 5 });

    assert.deepEqual(
      getVisiblePosts([older, newer], 'chronological').map((post) => post.id),
      ['newer', 'older'],
    );
    assert.deepEqual(
      getVisiblePosts([older, newer], 'ranked').map((post) => post.id),
      ['newer', 'older'],
    );
  });
});
