export interface PlanetData {
  id: string;
  name: string;
  position: [number, number, number];
  rotation: [number, number, number];
  radius: number;
  textureUrl?: string; // Will be added later
  color: string; // Temporary color until textures are provided
  description: string;
  facts: string[];
  orbitalSpeed: number;
  rotationSpeed: number;
  distanceFromSun?: string | number; // Allow string format like "150 million km"
  temperature?: string;
  moons?: number;
  rings?: boolean;
  hasRings?: boolean;
  orbitPeriod?: string;
  diameter?: string;
}

export interface PlanetProps {
  data: PlanetData;
  isSelected: boolean;
  onClick: () => void;
}

export interface SpaceSceneProps {
  onPlanetSelect: (planet: PlanetData) => void;
  selectedPlanet: PlanetData | null;
}

export interface PlanetInfoProps {
  planet: PlanetData;
  onClose: () => void;
  textureUrl?: string;
} 