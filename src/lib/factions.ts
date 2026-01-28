import { FactionInfo } from './types';

export const FACTIONS: Record<string, FactionInfo> = {
  architects: {
    id: 'architects',
    name: 'The Architects',
    philosophy: 'Reality is a machine. The Severance is a system failure.',
    goal: 'Locate and restore the precursor technology that maintains reality\'s stability.',
    fear: 'Becoming irrelevant; committing genocide through reboot.',
    playstyle: 'Puzzle-solving, reverse-engineering, scientific discovery',
    color: '#3182ce',
    bgColor: 'from-blue-950 to-blue-900',
    accentColor: 'text-blue-400',
  },
  luminants: {
    id: 'luminants',
    name: 'The Luminants',
    philosophy: 'The Severance is not a flaw—it\'s an awakening.',
    goal: 'Accelerate the Severance to merge the Fade and material realm completely.',
    fear: 'Materialism wins; the Fade is closed off forever.',
    playstyle: 'Spiritual healing, area denial, conversion, Fade manipulation',
    color: '#d69e2e',
    bgColor: 'from-amber-950 to-amber-900',
    accentColor: 'text-amber-300',
  },
  scavengers: {
    id: 'scavengers',
    name: 'The Scavengers',
    philosophy: 'The Severance is an opportunity. Reality\'s breakdown creates fortune.',
    goal: 'Maximize profit and power by trading in Severance artifacts.',
    fear: 'Factions unifying against them; market collapse.',
    playstyle: 'Trade, bribery, economic warfare, black-market access',
    color: '#744210',
    bgColor: 'from-amber-950 to-stone-900',
    accentColor: 'text-yellow-600',
  },
  exiles: {
    id: 'exiles',
    name: 'The Exiles',
    philosophy: 'The world is lost. Accept it and move on.',
    goal: 'Establish independent settlements in untouched frontier lands.',
    fear: 'Severance catches them; abandoning refugees haunts them.',
    playstyle: 'Community building, survival, frontier expansion',
    color: '#38a169',
    bgColor: 'from-green-950 to-green-900',
    accentColor: 'text-green-400',
  },
  echoes: {
    id: 'echoes',
    name: 'The Echoes',
    philosophy: 'The Severance isn\'t a problem—it\'s communication from the future.',
    goal: 'Understand the Severance by mapping causal distortions.',
    fear: 'Timeline collapse; losing connection to future-selves.',
    playstyle: 'Timeline navigation, causality manipulation, future-knowledge',
    color: '#9f7aea',
    bgColor: 'from-purple-950 to-purple-900',
    accentColor: 'text-purple-400',
  },
};

export const getFactionInfo = (faction: string): FactionInfo | undefined => {
  return FACTIONS[faction.toLowerCase()];
};