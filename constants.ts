import { LocationType, MineralType, MapLocation } from './types';

// Approximate coordinates for key locations in DRC
export const DRC_CENTER = { lat: -2.98, lng: 23.82 };
export const DEFAULT_ZOOM = 6;

export const LOCATIONS: MapLocation[] = [
  // MINERALS
  {
    id: 'm1',
    name: 'Tenke Fungurume Mine',
    type: LocationType.MINERAL,
    mineralType: MineralType.COPPER,
    description: 'One of the largest copper and cobalt mines in the world. Located in Lualaba Province.',
    coordinates: { lat: -10.52, lng: 26.13 },
  },
  {
    id: 'm2',
    name: 'Kibali Gold Mine',
    type: LocationType.MINERAL,
    mineralType: MineralType.GOLD,
    description: 'A large gold mine in the Haute-Uele province, northeast DRC.',
    coordinates: { lat: 3.12, lng: 29.58 },
  },
  {
    id: 'm3',
    name: 'Rubaya Coltan Mines',
    type: LocationType.MINERAL,
    mineralType: MineralType.COLTAN,
    description: 'Key coltan mining area in Masisi territory, North Kivu. Strategic importance for electronics.',
    coordinates: { lat: -1.38, lng: 28.87 },
  },
  {
    id: 'm4',
    name: 'Mbuji-Mayi Diamond Fields',
    type: LocationType.MINERAL,
    mineralType: MineralType.DIAMOND,
    description: 'Historic diamond mining capital in Kasai-Oriental.',
    coordinates: { lat: -6.13, lng: 23.60 },
  },
  {
    id: 'm5',
    name: 'Mutanda Mine',
    type: LocationType.MINERAL,
    mineralType: MineralType.COBALT,
    description: 'Major producer of cobalt and copper, located in Lualaba.',
    coordinates: { lat: -10.78, lng: 25.80 },
  },
  
  // CONFLICT ZONES (Approximate locations based on recent history)
  {
    id: 'c1',
    name: 'Rutshuru Territory Instability',
    type: LocationType.CONFLICT,
    description: 'Area of recurring clashes involving M23 rebels and FARDC. High displacement of civilians.',
    coordinates: { lat: -1.18, lng: 29.45 },
    severity: 'CRITICAL',
    updatedAt: '2024-05'
  },
  {
    id: 'c2',
    name: 'Ituri ADF Activity',
    type: LocationType.CONFLICT,
    description: 'Active zone for Allied Democratic Forces (ADF) operations near Beni and Irumu.',
    coordinates: { lat: 1.50, lng: 29.90 },
    severity: 'HIGH',
    updatedAt: '2024-04'
  },
  {
    id: 'c3',
    name: 'South Kivu Highlands',
    type: LocationType.CONFLICT,
    description: 'Presence of various local armed groups (Mai-Mai) disputing resource control.',
    coordinates: { lat: -3.50, lng: 28.80 },
    severity: 'MEDIUM',
    updatedAt: '2024-03'
  },
  {
    id: 'c4',
    name: 'Kwango Security Incident',
    type: LocationType.CONFLICT,
    description: 'Mobondo militia activity reported closer to Kinshasa outskirts.',
    coordinates: { lat: -4.80, lng: 16.80 },
    severity: 'MEDIUM',
    updatedAt: '2024-01'
  },
  
  // CITIES (Reference)
  {
    id: 'city1',
    name: 'Kinshasa',
    type: LocationType.CITY,
    description: 'Capital city of DRC.',
    coordinates: { lat: -4.44, lng: 15.26 },
  },
  {
    id: 'city2',
    name: 'Goma',
    type: LocationType.CITY,
    description: 'Capital of North Kivu, strategic hub for humanitarian aid and mineral trade.',
    coordinates: { lat: -1.65, lng: 29.22 },
  },
  {
    id: 'city3',
    name: 'Lubumbashi',
    type: LocationType.CITY,
    description: 'Mining capital in the southeast.',
    coordinates: { lat: -11.66, lng: 27.47 },
  }
];

export const MAP_TILE_URL = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
export const MAP_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
