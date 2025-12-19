
import { Villager, IslandItem, TileType, Fish } from './types';

export const GRID_SIZE = 30;

export const OUTFITS = [
  '👕', '👗', '👔', '👚', '🎽', '🧥', '👘', '🥻', '🧑‍🚀', '🥋', '🩱', '🩲', '🩳', '👙',
  '🥼', '🦺', '🤵', '👰', '🧛', '🧙', '🧝', '🧞', '🧜', '🧚', '🦸', '🦹', '🎅', '🤶',
  '💂', '👮', '👷', '🕵️', '👩‍🍳', '👩‍🌾', '👩‍🔬', '👩‍🎨', '👩‍🚀'
];

export const ACCESSORIES = [
  '👒', '🧢', '🕶️', '👓', '🧣', '🎀', '👑', '🎓', '🎩', '⛑️',
  '🎭', '🎨', '🎧', '🔭', '🩺', '🛡️', '⚔️', '🏹', '🪄', '💎', '📿', '💍', '💄', '🌂'
];

export const ITEM_PRICE = 500;

export const ROOF_COLORS = ['#ef4444', '#3b82f6', '#f59e0b', '#a855f7', '#10b981', '#ec4899', '#64748b', '#78350f'];
export const WALL_COLORS = ['#ffffff', '#f8fafc', '#fff7ed', '#f0fdf4', '#eff6ff', '#fdf2f8', '#f5f5f4', '#e2e8f0'];

export const INITIAL_VILLAGERS: Villager[] = [
  {
    id: 'v1',
    name: 'Apollo',
    species: 'Eagle',
    personality: 'cranky',
    position: { x: 5, y: 5 },
    color: '#374151',
    icon: '🦅',
    outfit: '👔'
  },
  {
    id: 'v2',
    name: 'Goldie',
    species: 'Dog',
    personality: 'normal',
    position: { x: 25, y: 8 },
    color: '#fbbf24',
    icon: '🐕',
    outfit: '👗'
  },
  {
    id: 'v3',
    name: 'Bob',
    species: 'Cat',
    personality: 'lazy',
    position: { x: 6, y: 24 },
    color: '#a78bfa',
    icon: '🐈',
    outfit: '👕'
  },
  {
    id: 'v4',
    name: 'Rodney',
    species: 'Mouse',
    personality: 'snooty',
    position: { x: 12, y: 22 },
    color: '#94a3b8',
    icon: '🐭',
    outfit: '👘'
  },
  {
    id: 'v5',
    name: 'Puddles',
    species: 'Frog',
    personality: 'peppy',
    position: { x: 22, y: 5 },
    color: '#4ade80',
    icon: '🐸',
    outfit: '👗'
  },
  {
    id: 'v6',
    name: 'Teddy',
    species: 'Bear',
    personality: 'jock',
    position: { x: 18, y: 26 },
    color: '#92400e',
    icon: '🐻',
    outfit: '🎽'
  },
  {
    id: 'v7',
    name: 'Bill',
    species: 'Duck',
    personality: 'jock',
    position: { x: 28, y: 15 },
    color: '#1e3a8a',
    icon: '🦆',
    outfit: '👕'
  },
  {
    id: 'v8',
    name: 'Drago',
    species: 'Alligator',
    personality: 'lazy',
    position: { x: 4, y: 12 },
    color: '#166534',
    icon: '🐊',
    outfit: '👘'
  }
];

export const POTENTIAL_VILLAGERS: Partial<Villager>[] = [
  { name: 'Chrissy', species: 'Rabbit', personality: 'peppy', icon: '🐰', color: '#f9a8d4' },
  { name: 'Bunnie', species: 'Rabbit', personality: 'peppy', icon: '🐇', color: '#fb923c' },
  { name: 'Stitches', species: 'Bear', personality: 'lazy', icon: '🧸', color: '#fdba74' },
  { name: 'Rosie', species: 'Cat', personality: 'peppy', icon: '🐱', color: '#93c5fd' },
  { name: 'Maple', species: 'Bear', personality: 'normal', icon: '🐻', color: '#b45309' },
  { name: 'Bluebear', species: 'Bear', personality: 'peppy', icon: '🧊', color: '#60a5fa' },
  { name: 'Francine', species: 'Rabbit', personality: 'snooty', icon: '🐰', color: '#38bdf8' },
];

export const SEEDS = [
  { id: 'seed_tomato', name: 'Tomato Seeds', icon: '🍅', harvestIcon: '🍅' },
  { id: 'seed_carrot', name: 'Carrot Seeds', icon: '🥕', harvestIcon: '🥕' },
  { id: 'seed_sunflower', name: 'Sunflower Seeds', icon: '🌻', harvestIcon: '🌻' },
  { id: 'seed_tulip', name: 'Tulip Seeds', icon: '🌷', harvestIcon: '🌷' },
];

export const INITIAL_ITEMS: IslandItem[] = [
  // Player House
  { id: 'h_player', ownerId: 'player', type: 'house', name: 'My Home', icon: '🏠', position: { x: 15, y: 18 }, color: '#ef4444', wallColor: '#ffffff' },
  // Able Sisters Shop
  { id: 's_able', type: 'shop', name: 'Able Sisters', icon: '🧥', position: { x: 22, y: 22 }, color: '#166534', wallColor: '#b91c1c' },
  // Nook's Cranny
  { id: 's_nook', type: 'general_store', name: "Nook's Cranny", icon: '🍃', position: { x: 8, y: 12 }, color: '#1e3a8a', wallColor: '#fde047' },
  // Resident Services
  { id: 's_townhall', type: 'town_hall', name: "Town Hall", icon: '🏛️', position: { x: 15, y: 8 }, color: '#4c1d95', wallColor: '#fbbf24' },
  // Museum
  { id: 's_museum', type: 'museum', name: "Museum", icon: '🦉', position: { x: 24, y: 15 }, color: '#94a3b8', wallColor: '#f1f5f9' },
  
  // Villager Houses
  { id: 'h_apollo', ownerId: 'v1', type: 'house', name: 'Apollo\'s House', icon: '🏠', position: { x: 4, y: 4 }, color: '#3b82f6', wallColor: '#e2e8f0' },
  { id: 'h_goldie', ownerId: 'v2', type: 'house', name: 'Goldie\'s House', icon: '🏠', position: { x: 26, y: 7 }, color: '#f59e0b', wallColor: '#fff7ed' },
  { id: 'h_bob', ownerId: 'v3', type: 'house', name: 'Bob\'s House', icon: '🏠', position: { x: 5, y: 25 }, color: '#a855f7', wallColor: '#f3e8ff' },
  { id: 'h_rodney', ownerId: 'v4', type: 'house', name: 'Rodney\'s House', icon: '🏠', position: { x: 13, y: 21 }, color: '#64748b', wallColor: '#f1f5f9' },
  { id: 'h_puddles', ownerId: 'v5', type: 'house', name: 'Puddles\' House', icon: '🏠', position: { x: 21, y: 4 }, color: '#10b981', wallColor: '#f0fdf4' },
  { id: 'h_teddy', ownerId: 'v6', type: 'house', name: 'Teddy\'s House', icon: '🏠', position: { x: 19, y: 25 }, color: '#78350f', wallColor: '#fff7ed' },
  { id: 'h_bill', ownerId: 'v7', type: 'house', name: 'Bill\'s House', icon: '🏠', position: { x: 27, y: 14 }, color: '#1d4ed8', wallColor: '#eff6ff' },
  { id: 'h_drago', ownerId: 'v8', type: 'house', name: 'Drago\'s House', icon: '🏠', position: { x: 3, y: 11 }, color: '#064e3b', wallColor: '#ecfdf5' },
  
  // Natural Decoration
  { id: 'i2', type: 'tree', name: 'Apple Tree', icon: '🌳', position: { x: 10, y: 5 } },
  { id: 'i3', type: 'tree', name: 'Apple Tree', icon: '🌳', position: { x: 20, y: 25 } },
  { id: 'i3b', type: 'tree', name: 'Apple Tree', icon: '🌳', position: { x: 4, y: 15 } },
  { id: 'i3c', type: 'tree', name: 'Apple Tree', icon: '🌳', position: { x: 25, y: 15 } },
  { id: 'i4', type: 'rock', name: 'Rock', icon: '🪨', position: { x: 28, y: 2 } },
  { id: 'i4b', type: 'rock', name: 'Rock', icon: '🪨', position: { x: 2, y: 28 } },
  { id: 'i5', type: 'flower', name: 'Red Tulips', icon: '🌷', position: { x: 14, y: 12 } },
  { id: 'i6', type: 'flower', name: 'White Lilies', icon: '🌼', position: { x: 16, y: 12 } },
  { id: 'i7', type: 'flower', name: 'Blue Roses', icon: '🌹', position: { x: 15, y: 22 } },
];

export const FISH_LIST: Fish[] = [
  { id: 'f1', name: 'Sea Bass', icon: '🐟', rarity: 'common', timeOfDay: ['morning', 'noon', 'evening', 'night'], value: 400 },
  { id: 'f2', name: 'Red Snapper', icon: '🐠', rarity: 'uncommon', timeOfDay: ['morning', 'noon', 'evening'], value: 3000 },
  { id: 'f3', name: 'Great White Shark', icon: '🦈', rarity: 'rare', timeOfDay: ['evening', 'night'], value: 15000 },
  { id: 'f4', name: 'Clown Fish', icon: '🤡', rarity: 'common', timeOfDay: ['noon', 'evening'], value: 650 },
  { id: 'f5', name: 'Squid', icon: '🦑', rarity: 'common', timeOfDay: ['night', 'morning'], value: 500 },
  { id: 'f6', name: 'Koi', icon: '🎏', rarity: 'uncommon', timeOfDay: ['evening', 'night'], value: 4000 },
];

export const MAP_LAYOUT: TileType[][] = Array(GRID_SIZE).fill(0).map((_, y) => 
  Array(GRID_SIZE).fill(0).map((_, x) => {
    if (x === 0 || x === GRID_SIZE - 1 || y === 0 || y === GRID_SIZE - 1) return 'water';
    if (x === 1 || x === GRID_SIZE - 2 || y === 1 || y === GRID_SIZE - 2) return 'sand';
    return 'grass';
  })
);
