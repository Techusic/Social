import * as SQLite from 'expo-sqlite';

import type { NPCMemory, PlayerEngagementStats, Post, RelationshipState, Reply } from '../types/feed';

export type FeedMode = 'ranked' | 'chronological';

export type FeedSnapshot = {
  posts: Post[];
  repliesByPost: Record<string, Reply[]>;
  relationships: Record<string, RelationshipState>;
  memories: Record<string, NPCMemory[]>;
  simulationTick: number;
  playerStats: PlayerEngagementStats;
  feedMode: FeedMode;
};

const DB_NAME = 'social-feed.db';
const TABLE_NAME = 'feed_store_snapshot';
const STORAGE_KEY = 'feedState';

const db = SQLite.openDatabaseSync(DB_NAME);

function ensureTable(): void {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
}

export function loadFeedSnapshot(worldId = 'hogwarts'): FeedSnapshot | null {
  ensureTable();

  const key = worldId === 'hogwarts' ? STORAGE_KEY : `world:${worldId}:${STORAGE_KEY}`;
  const row = db.getFirstSync<{ value: string }>(`SELECT value FROM ${TABLE_NAME} WHERE key = ?;`, [key]);
  if (!row?.value) {
    return null;
  }

  try {
    return JSON.parse(row.value) as FeedSnapshot;
  } catch {
    return null;
  }
}

export function saveFeedSnapshot(snapshot: FeedSnapshot, worldId = 'hogwarts'): void {
  ensureTable();
  const serialized = JSON.stringify(snapshot);

  const key = worldId === 'hogwarts' ? STORAGE_KEY : `world:${worldId}:${STORAGE_KEY}`;
  db.runSync(`INSERT OR REPLACE INTO ${TABLE_NAME} (key, value) VALUES (?, ?);`, [key, serialized]);
}
