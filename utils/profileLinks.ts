const MAIN_CHARACTER_IDS = new Set(['player', 'ron', 'cedric', 'ginny', 'dobby', 'hermione', 'harry']);
const CHAT_CHARACTER_IDS = new Set(['ginny', 'hermione']);

export function canOpenProfile(id: string): boolean {
  return MAIN_CHARACTER_IDS.has(id);
}

export function canChatWith(id: string): boolean {
  return CHAT_CHARACTER_IDS.has(id);
}
