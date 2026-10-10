import * as SQLite from 'expo-sqlite';
export { worldStoreKey } from '../utils/worldKeys';
import { worldStoreKey } from '../utils/worldKeys';

const db = SQLite.openDatabaseSync('social-feed.db');
const TABLE_NAME = 'social_store';
const worldHydrators = new Set<(worldId: string) => void>();

function ensureTable(): void {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
}

export function loadStore<T>(key: string): T | null {
  ensureTable();
  const row = db.getFirstSync<{ value: string }>(`SELECT value FROM ${TABLE_NAME} WHERE key = ?;`, [key]);
  if (!row?.value) return null;
  try {
    return JSON.parse(row.value) as T;
  } catch {
    return null;
  }
}

export function saveStore<T>(key: string, value: T): void {
  ensureTable();
  db.runSync(`INSERT OR REPLACE INTO ${TABLE_NAME} (key, value) VALUES (?, ?);`, [key, JSON.stringify(value)]);
}

export function registerWorldHydrator(hydrate: (worldId: string) => void): () => void {
  worldHydrators.add(hydrate);
  return () => worldHydrators.delete(hydrate);
}

export function hydrateWorldStores(worldId: string): void {
  worldHydrators.forEach((hydrate) => hydrate(worldId));
}
