
export type TileType = 'grass' | 'water' | 'sand' | 'dirt';

export interface Position {
  x: number;
  y: number;
}

export type ItemType = 'tree' | 'flower' | 'rock' | 'tent' | 'furniture' | 'fossil' | 'fruit' | 'house' | 'fish' | 'tool' | 'crop' | 'seed' | 'shop' | 'general_store' | 'town_hall' | 'museum';

export interface IslandItem {
  id: string;
  type: ItemType;
  name: string;
  icon: string;
  position: Position;
  color?: string; // Roof color
  wallColor?: string; // Wall color
  ownerId?: string; // Link to villager id
  growthStage?: number; // 0: Sprout, 1: Small, 2: Medium, 3: Mature
  isWatered?: boolean;
  harvestIcon?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  icon: string;
  count: number;
  type: ItemType;
}

export interface Fish {
  id: string;
  name: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare';
  timeOfDay: ('morning' | 'noon' | 'evening' | 'night')[];
  value: number;
}

export interface Villager {
  id: string;
  name: string;
  species: string;
  personality: 'lazy' | 'jock' | 'snooty' | 'cranky' | 'peppy' | 'normal';
  position: Position;
  targetPosition?: Position;
  color: string;
  icon: string;
  outfit?: string;
  accessory?: string;
  isFishing?: boolean;
}

export interface GameState {
  playerPos: Position;
  islandItems: IslandItem[];
  inventory: InventoryItem[];
  villagers: Villager[];
  dayTime: 'morning' | 'noon' | 'evening' | 'night';
  bells: number;
  location: 'main' | 'mystery' | 'shop' | 'nook_cranny' | 'resident_services' | 'museum';
  mysteryVillager?: Villager | null;
  ownedOutfits: string[];
  ownedAccessories: string[];
  playerOutfit: string;
  playerAccessory: string;
}

export interface FishingState {
  status: 'idle' | 'casting' | 'waiting' | 'biting' | 'caught';
  bobberPos?: Position;
  caughtFish?: Fish;
}
