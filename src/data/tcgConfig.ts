import type { TCGConfig } from '../types';

// To enable/disable a TCG tab, set `enabled: true/false`.
// Disabled TCGs will not appear in the navigation or shop.
export const TCG_CONFIG: TCGConfig[] = [
  {
    key: 'pokemon',
    label: 'Pokémon',
    primary: '#CC0000',
    accent: '#FFCB05',
    enabled: true,
  },
  {
    key: 'onePiece',
    label: 'One Piece',
    primary: '#E31E24',
    accent: '#1a56db',
    enabled: false,
  },
  {
    key: 'dragonball',
    label: 'Dragon Ball',
    primary: '#FF7F00',
    accent: '#FFD700',
    enabled: false,
  },
  {
    key: 'yugioh',
    label: 'Yu-Gi-Oh!',
    primary: '#6B21A8',
    accent: '#DBA309',
    enabled: false,
  },
  {
    key: 'mtg',
    label: 'Magic: The Gathering',
    primary: '#1D4ED8',
    accent: '#D97706',
    enabled: false,
  },
];

export const enabledTCGs = TCG_CONFIG.filter((t) => t.enabled);
export const getTCGConfig = (key: string) => TCG_CONFIG.find((t) => t.key === key);
