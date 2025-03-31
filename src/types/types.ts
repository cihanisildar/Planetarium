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

// Add enum for orbit speed modes
export enum OrbitSpeedMode {
  REALTIME = 1,
  FAST = 5,
  VERY_FAST = 15,
  PAUSED = 0
}

// Add enum for view perspectives
export enum ViewPerspective {
  FREE = "free",
  TOP_DOWN = "top-down",
  SIDE_VIEW = "side-view"
}

// Add orbit controls settings interface
export interface OrbitControlsSettings {
  speedMode: OrbitSpeedMode;
  viewPerspective: ViewPerspective;
}

export interface PlanetProps {
  data: PlanetData;
  isSelected: boolean;
  onClick: () => void;
  orbitSpeedMultiplier: number;
}

export interface SpaceSceneProps {
  onPlanetSelect: (planet: PlanetData | null) => void;
  orbitControlsSettings: OrbitControlsSettings;
}

export interface PlanetInfoProps {
  planet: PlanetData;
  onClose: () => void;
  textureUrl?: string;
}

export interface ControlPanelProps {
  settings: OrbitControlsSettings;
  onSettingsChange: (settings: OrbitControlsSettings) => void;
} 