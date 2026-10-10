export type EventStat = 'humor' | 'aura' | 'clout' | 'reputation' | 'socialSavvy';

export type EventDelta = {
  stat: EventStat;
  amount: number;
};

export type WorldEventChoice = {
  id: string;
  label: string;
  description: string;
  consequences: EventDelta[];
  relationshipDelta?: { npcId: string; amount: number };
};

export type WorldEvent = {
  id: string;
  title: string;
  category: string;
  prompt: string;
  context: string;
  choices: WorldEventChoice[];
  completed: boolean;
};

export type PlayerProgress = Record<EventStat, number> & {
  xp: number;
  completedEvents: number;
};
