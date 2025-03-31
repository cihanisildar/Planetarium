export type OrbitSpeedMode = 'slow' | 'normal' | 'fast';
export type ViewPerspective = 'top' | 'side' | 'isometric';

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
  orbitSpeedMultiplier: number;
}

export interface SpaceSceneProps {
  onPlanetSelect: (planet: PlanetData | null) => void;
  orbitControlsSettings: {
    orbitSpeed: OrbitSpeedMode;
    viewPerspective: ViewPerspective;
    showOrbits: boolean;
    showLabels: boolean;
  };
}

// Helper function to convert OrbitSpeedMode to number
export const getSpeedMultiplier = (mode: OrbitSpeedMode): number => {
  switch (mode) {
    case 'fast': return 2;
    case 'slow': return 0.5;
    default: return 1;
  }
};

export interface PlanetInfoProps {
  planet: PlanetData;
  onClose: () => void;
  textureUrl?: string;
}

export interface ControlPanelProps {
  settings: {
    orbitSpeed: OrbitSpeedMode;
    viewPerspective: ViewPerspective;
    showOrbits: boolean;
    showLabels: boolean;
  };
  onSettingsChange: (settings: {
    orbitSpeed: OrbitSpeedMode;
    viewPerspective: ViewPerspective;
    showOrbits: boolean;
    showLabels: boolean;
  }) => void;
} 