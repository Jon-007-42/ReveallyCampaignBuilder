import { z } from 'zod';
// Vi importerer spillene her
import * as ScratchCard from '@/components/games/scratch-card';
import * as Quiz from '@/components/games/quiz';

// Definition af hvordan et spil ser ud
export interface GameModule {
  name: string;
  description: string;
  icon: string;
  category: 'instant-win' | 'skill-based' | 'chance';
  // Vi bruger 'any' her for simplicitet i starten, men det kan types stærkere senere
  GameComponent: React.ComponentType<any>; 
  ConfigEditor: React.ComponentType<any>;
  configSchema: z.ZodSchema;
  defaultConfig: Record<string, any>;
}

// REGISTERET: Her tilføjer du nye spil i fremtiden!
export const GAME_REGISTRY: Record<string, GameModule> = {
  'scratch-card': {
    name: 'Lucky Scratch',
    description: 'Skrab og vind rabatter',
    icon: '🎫',
    category: 'instant-win',
    GameComponent: ScratchCard.GameComponent,
    ConfigEditor: ScratchCard.ConfigEditor,
    configSchema: ScratchCard.configSchema,
    defaultConfig: ScratchCard.defaultConfig,
  },
  'quiz': {
    name: 'Eye-Q Quiz',
    description: 'Test din viden',
    icon: '🧠',
    category: 'skill-based',
    GameComponent: Quiz.GameComponent,
    ConfigEditor: Quiz.ConfigEditor,
    configSchema: Quiz.configSchema,
    defaultConfig: Quiz.defaultConfig,
  },
};

export function getGameModule(type: string) {
  return GAME_REGISTRY[type];
}