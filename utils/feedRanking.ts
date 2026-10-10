import type { Post } from '../types/feed';

export function rankPost(post: Post, currentTime: number): number {
  const ageInHours = Math.max(0, (currentTime - post.createdAt) / (1000 * 60 * 60));
  const freshness = Math.max(0, 1 - ageInHours / 48);
  const engagement = Math.min(1, Math.log10(post.likes + post.reposts * 2 + post.comments * 3 + 1) / 8);
  const velocity = Math.min(1, (post.comments * 4 + post.reposts * 2 + post.likes) / Math.max(1, post.views));
  const playerSignal =
    (post.likedByPlayer ? 0.3 : 0) +
    (post.repostedByPlayer ? 0.4 : 0) +
    post.affinity * 0.25;

  return freshness * 0.3 + engagement * 0.22 + velocity * 0.13 + post.tension * 0.2 + playerSignal * 0.15;
}

export function sortPostsChronologically(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => b.createdAt - a.createdAt);
}

export function rankPosts(posts: Post[], currentTime = Date.now()): Post[] {
  return [...posts].sort((a, b) => {
    const scoreDifference = rankPost(b, currentTime) - rankPost(a, currentTime);
    return Math.abs(scoreDifference) > 0.0001 ? scoreDifference : b.createdAt - a.createdAt;
  });
}

export function getVisiblePosts(posts: Post[], mode: 'ranked' | 'chronological'): Post[] {
  return mode === 'chronological' ? sortPostsChronologically(posts) : rankPosts(posts);
}
