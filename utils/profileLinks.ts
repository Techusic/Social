const MAIN_CHARACTER_IDS = new Set(['player', 'ron', 'cedric', 'ginny', 'dobby', 'hermione', 'harry']);

export function canOpenProfile(id: string): boolean {
  return MAIN_CHARACTER_IDS.has(id);
}

