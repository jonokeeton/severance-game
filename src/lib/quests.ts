import { Quest, Faction } from './types';

const ARCHITECTS_QUESTS: Quest[] = [
  {
    id: 'arch-1',
    title: 'Restructure Protocol',
    faction: 'architects' as Faction,
    description: 'Implement a new organizational framework',
    narrative: 'The Architects have identified inefficiencies in the current power structure. You must design and implement a comprehensive restructuring protocol that consolidates their influence while appearing to benefit all.',
    order: 1,
    choices: [
      {
        id: 'arch-1-a',
        text: 'Implement ruthless hierarchical optimization',
        description: 'Create a strict pyramid structure that elevates architect control',
        consequences: {
          influence: 15,
          reputation: -10,
          resources: 5,
          severance_level: 2,
        },
      },
      {
        id: 'arch-1-b',
        text: 'Design a collaborative framework',
        description: 'Create a system that appears democratic but subtly guides others',
        consequences: {
          influence: 10,
          reputation: 8,
          resources: 3,
          severance_level: 1,
        },
      },
      {
        id: 'arch-1-c',
        text: 'Propose decentralized autonomous nodes',
        description: 'Suggest a distributed system that keeps actual power with architects',
        consequences: {
          influence: 12,
          reputation: 5,
          resources: 8,
          severance_level: 0,
        },
      },
    ],
  },
  {
    id: 'arch-2',
    title: 'Information Monopoly',
    faction: 'architects' as Faction,
    description: 'Consolidate access to critical data',
    narrative: 'Information is power. The Architects seek to control the flow of knowledge, positioning themselves as the sole interpreters of reality\'s blueprints.',
    order: 2,
    choices: [
      {
        id: 'arch-2-a',
        text: 'Create a restricted information vault',
        description: 'Store all critical data in architect-controlled servers',
        consequences: {
          influence: 16,
          reputation: -12,
          resources: 10,
          severance_level: 3,
        },
      },
      {
        id: 'arch-2-b',
        text: 'Establish yourself as a trusted intermediary',
        description: 'Control access by becoming the interpreter of shared data',
        consequences: {
          influence: 11,
          reputation: 6,
          resources: 5,
          severance_level: 1,
        },
      },
    ],
  },
];

const SENTINELS_QUESTS: Quest[] = [
  {
    id: 'sent-1',
    title: 'Establish Watchtowers',
    faction: 'sentinels' as Faction,
    description: 'Create surveillance infrastructure',
    narrative: 'The Sentinels believe security requires constant vigilance. You must establish a network of monitoring stations to detect threats—both external and internal.',
    order: 1,
    choices: [
      {
        id: 'sent-1-a',
        text: 'Build pervasive surveillance network',
        description: 'Monitor everyone to catch any threat, no matter how small',
        consequences: {
          influence: 14,
          reputation: -8,
          resources: 6,
          severance_level: 2,
        },
      },
      {
        id: 'sent-1-b',
        text: 'Create targeted defense posts',
        description: 'Focus protection where threats are most likely',
        consequences: {
          influence: 10,
          reputation: 7,
          resources: 4,
          severance_level: 1,
        },
      },
    ],
  },
];

const ECHOES_QUESTS: Quest[] = [
  {
    id: 'echo-1',
    title: 'Amplify the Signal',
    faction: 'echoes' as Faction,
    description: 'Spread a message through the fractured reality',
    narrative: 'The Echoes believe in the power of resonance and shared experience. You must amplify their message so it reaches across all fractured dimensions.',
    order: 1,
    choices: [
      {
        id: 'echo-1-a',
        text: 'Create a viral memetic payload',
        description: 'Craft a message that spreads uncontrollably',
        consequences: {
          influence: 13,
          reputation: 5,
          resources: 3,
          severance_level: 1,
        },
      },
      {
        id: 'echo-1-b',
        text: 'Plant seeds organically through communities',
        description: 'Gradually introduce the message to trusted circles',
        consequences: {
          influence: 9,
          reputation: 10,
          resources: 2,
          severance_level: 0,
        },
      },
    ],
  },
];

const RAVAGERS_QUESTS: Quest[] = [
  {
    id: 'rav-1',
    title: 'Destabilize the Core',
    faction: 'ravagers' as Faction,
    description: 'Introduce chaos into established systems',
    narrative: 'The Ravagers see the current order as stagnant and broken. You must create strategic disruptions to collapse the systems keeping reality fragmented.',
    order: 1,
    choices: [
      {
        id: 'rav-1-a',
        text: 'Launch coordinated terrorist attacks',
        description: 'Strike multiple critical infrastructure points',
        consequences: {
          influence: 18,
          reputation: -15,
          resources: 12,
          severance_level: 5,
        },
      },
      {
        id: 'rav-1-b',
        text: 'Orchestrate mass protests and unrest',
        description: 'Turn populations against their leaders',
        consequences: {
          influence: 14,
          reputation: -5,
          resources: 8,
          severance_level: 3,
        },
      },
    ],
  },
];

const ARBITERS_QUESTS: Quest[] = [
  {
    id: 'arb-1',
    title: 'Mediate the Divide',
    faction: 'arbiters' as Faction,
    description: 'Bring opposing factions to the negotiation table',
    narrative: 'The Arbiters seek balance between all factions. Your mission is to facilitate dialogue and create frameworks for peaceful coexistence in the Severance.',
    order: 1,
    choices: [
      {
        id: 'arb-1-a',
        text: 'Propose a neutral global council',
        description: 'Create a structure where all voices have equal weight',
        consequences: {
          influence: 10,
          reputation: 12,
          resources: 4,
          severance_level: 0,
        },
      },
      {
        id: 'arb-1-b',
        text: 'Establish bilateral peace agreements',
        description: 'Broker individual treaties between factions',
        consequences: {
          influence: 8,
          reputation: 10,
          resources: 3,
          severance_level: -1,
        },
        factionImpact: {
          faction: 'architects' as Faction,
          influenceChange: 2,
        },
      },
    ],
  },
];

export function getQuestsByFaction(faction: string): Quest[] {
  switch (faction) {
    case 'architects':
      return ARCHITECTS_QUESTS;
    case 'sentinels':
      return SENTINELS_QUESTS;
    case 'echoes':
      return ECHOES_QUESTS;
    case 'ravagers':
      return RAVAGERS_QUESTS;
    case 'arbiters':
      return ARBITERS_QUESTS;
    default:
      return [];
  }
}