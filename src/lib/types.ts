export type Faction = 'architects' | 'luminants' | 'scavengers' | 'exiles' | 'echoes';

export interface User {
  id: string;
  username: string;
  faction: Faction | null;
  created_at: string;
  updated_at: string;
}

export interface FactionProgress {
  id: number;
  user_id: string;
  faction: Faction;
  influence: number;
  reputation: number;
  resources: number;
  quest_count: number;
  created_at: string;
  updated_at: string;
}

export interface GameState {
  id: number;
  user_id: string;
  current_act: number;
  severance_level: number;
  choices_made: Record<string, any>;
  completed_quests: string[];
  created_at: string;
  updated_at: string;
}

export interface FactionInfo {
  id: Faction;
  name: string;
  philosophy: string;
  goal: string;
  fear: string;
  playstyle: string;
  color: string;
  bgColor: string;
  accentColor: string;
}