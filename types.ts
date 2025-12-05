export enum LocationType {
  MINERAL = 'MINERAL',
  CONFLICT = 'CONFLICT',
  CITY = 'CITY'
}

export enum MineralType {
  COBALT = 'Cobalt',
  COPPER = 'Copper',
  GOLD = 'Gold',
  DIAMOND = 'Diamond',
  COLTAN = 'Coltan',
  LITHIUM = 'Lithium'
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface MapLocation {
  id: string;
  name: string;
  type: LocationType;
  mineralType?: MineralType;
  description: string;
  coordinates: Coordinates;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'; // For conflicts
  updatedAt?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isError?: boolean;
}
