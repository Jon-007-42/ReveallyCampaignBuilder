import * as ScratchCard from '@/components/games/scratch-card';
import * as Quiz from '@/components/games/quiz';
import * as SlotMachine from '@/components/games/slot-machine';
import * as MemoryMatch from '@/components/games/memory-match';
import * as Snake from '@/components/games/snake';
import * as FrostyWipe from '@/components/games/frosty-wipe';
import * as WheelOfVision from '@/components/games/wheel-of-vision';
import * as FocusPuzzle from '@/components/games/focus-puzzle';
import * as Spotless from '@/components/games/spotless';
import * as DailyReveal from '@/components/games/daily-reveal';
import * as HiddenFrame from '@/components/games/hidden-frame';

export const GAME_REGISTRY: Record<string, any> = {
  'scratch-card': {
    id: 'scratch-card',
    name: 'Lucky Scratch',
    description: 'Et klassisk digitalt skrabespil. Perfekt til hurtig interaktion.',
    icon: '🎫',
    configSchema: ScratchCard.configSchema,
    defaultConfig: ScratchCard.defaultConfig,
    ConfigEditor: ScratchCard.ConfigEditor,
    GameComponent: ScratchCard.GameComponent,
  },
  'quiz': {
    id: 'quiz',
    name: 'Eye-Q Quiz',
    description: 'Test kundens viden med et interaktivt spørgsmål.',
    icon: '🧠',
    configSchema: Quiz.configSchema,
    defaultConfig: Quiz.defaultConfig,
    ConfigEditor: Quiz.ConfigEditor,
    GameComponent: Quiz.GameComponent,
  },
  'slot-machine': {
    id: 'slot-machine',
    name: 'Slot Machine',
    description: 'Enarmet tyveknægt! Få 3 på stribe for at vinde. Ren dopamin.',
    icon: '🎰',
    configSchema: SlotMachine.configSchema,
    defaultConfig: SlotMachine.defaultConfig,
    ConfigEditor: SlotMachine.ConfigEditor,
    GameComponent: SlotMachine.GameComponent,
  },
  'memory-match': {
    id: 'memory-match',
    name: 'Memory Match',
    description: 'Klassisk vendespil. Tvinger kunden til at fokusere på produkterne.',
    icon: '🃏',
    configSchema: MemoryMatch.configSchema,
    defaultConfig: MemoryMatch.defaultConfig,
    ConfigEditor: MemoryMatch.ConfigEditor,
    GameComponent: MemoryMatch.GameComponent,
  },
  'snake': {
    id: 'snake',
    name: 'Snake',
    description: 'Jagt rekorden! Spillet der får kunderne til at blive hængende længst.',
    icon: '🐍',
    configSchema: Snake.configSchema,
    defaultConfig: Snake.defaultConfig,
    ConfigEditor: Snake.ConfigEditor,
    GameComponent: Snake.GameComponent,
  },
  'frosty-wipe': {
    id: 'frosty-wipe',
    name: 'Frosty Wipe',
    description: 'Sæson-kampagne: Kunden tørrer en dugget rude af for at finde præmien.',
    icon: '🌫️',
    configSchema: FrostyWipe.configSchema,
    defaultConfig: FrostyWipe.defaultConfig,
    ConfigEditor: FrostyWipe.ConfigEditor,
    GameComponent: FrostyWipe.GameComponent,
  },
  'wheel-of-vision': {
    id: 'wheel-of-vision',
    name: 'Wheel of Vision',
    description: 'Det klassiske lykkehjul. Giver kunderne lyst til at dreje om store præmier.',
    icon: '🎡',
    configSchema: WheelOfVision.configSchema,
    defaultConfig: WheelOfVision.defaultConfig,
    ConfigEditor: WheelOfVision.ConfigEditor,
    GameComponent: WheelOfVision.GameComponent,
  },
  'focus-puzzle': {
    id: 'focus-puzzle',
    name: 'Focus Puzzle',
    description: 'Branding-spil: Kunden samler et billede af dit produkt.',
    icon: '🧩',
    configSchema: FocusPuzzle.configSchema,
    defaultConfig: FocusPuzzle.defaultConfig,
    ConfigEditor: FocusPuzzle.ConfigEditor,
    GameComponent: FocusPuzzle.GameComponent,
  },
  'spotless': {
    id: 'spotless',
    name: 'Spotless',
    description: 'Produkt-demo: Kunden pudser glasset rent for at se værdien af brillerens.',
    icon: '✨',
    configSchema: Spotless.configSchema,
    defaultConfig: Spotless.defaultConfig,
    ConfigEditor: Spotless.ConfigEditor,
    GameComponent: Spotless.GameComponent,
  },
  'daily-reveal': {
    id: 'daily-reveal',
    name: 'Daily Reveal',
    description: 'Retention-spil: En julekalender-mekanik der skaber loyalitet.',
    icon: '📅',
    configSchema: DailyReveal.configSchema,
    defaultConfig: DailyReveal.defaultConfig,
    ConfigEditor: DailyReveal.ConfigEditor,
    GameComponent: DailyReveal.GameComponent,
  },
  'hidden-frame': {
    id: 'hidden-frame',
    name: 'Hidden Frame',
    description: 'Visual Search: Find det rigtige stel i mængden for at vinde.',
    icon: '🖼️',
    configSchema: HiddenFrame.configSchema,
    defaultConfig: HiddenFrame.defaultConfig,
    ConfigEditor: HiddenFrame.ConfigEditor,
    GameComponent: HiddenFrame.GameComponent,
  }
};