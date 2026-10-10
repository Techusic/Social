export function worldStoreKey(key: string, worldId: string): string {
  return `world:${worldId}:${key}`;
}
