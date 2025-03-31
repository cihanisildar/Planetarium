import React, { useState, useRef, useEffect } from 'react';
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { PlanetData, OrbitSpeedMode, ViewPerspective, getSpeedMultiplier } from '../types/types';
import Planet from './Planet';
import SimpleSun from './SimpleSun';
import '../styles/FixedSpaceScene.css';
import * as THREE from 'three';

// Interface for the component props
interface FixedSpaceSceneProps {
  onPlanetSelect: (planet: PlanetData | null) => void;
  orbitControlsSettings: {
    orbitSpeed: OrbitSpeedMode;
    viewPerspective: ViewPerspective;
    showOrbits: boolean;
    showLabels: boolean;
  };
}

// Moon data for details panel
export const moonData: PlanetData = {
  id: 'moon',
  name: 'Moon',
  position: [20.5, 0.5, 0.5], // Used for camera positioning when selected
  rotation: [0, 0, 0],
  radius: 0.27,
  color: '#CCCCCC',
  textureUrl: '/textures/2k_moon.jpg',
  description: 'The Moon is Earth\'s only natural satellite and the fifth largest moon in the Solar System.',
  facts: [
    'The Moon is gradually moving away from Earth at a rate of 3.8 cm per year.',
    'The Moon always shows the same face to Earth due to tidal locking.',
    'The Moon\'s surface gravity is about 1/6 that of Earth.',
    'The Moon has a very thin atmosphere called an exosphere.'
  ],
  orbitalSpeed: 0.015,
  rotationSpeed: 0.001,
  distanceFromSun: 150, // Same as Earth
  temperature: '-173°C to 127°C',
  moons: 0
};

// Sun data for details panel
export const sunData: PlanetData = {
  id: 'sun',
  name: 'Sun',
  position: [0, 0, 0],
  rotation: [0, 0, 0],
  radius: 3,
  color: '#FDB813',
  textureUrl: '/textures/2k_sun.jpg',
  description: 'The Sun is the star at the center of the Solar System. It is a nearly perfect sphere of hot plasma and accounts for about 99.86% of the total mass of the Solar System.',
  facts: [
    'The Sun is 109 times wider than Earth and 330,000 times as massive.',
    'The Sun\'s core reaches temperatures of 15 million °C.',
    'It takes light from the Sun about 8 minutes to reach Earth.',
    'The Sun has a powerful magnetic field that creates sunspots and solar flares.'
  ],
  orbitalSpeed: 0,
  rotationSpeed: 0.005,
  temperature: '5,500°C (surface), 15,000,000°C (core)',
  moons: 0
};

// Data for all planets
export const planetsData: PlanetData[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    position: [7, 0, 0],
    radius: 0.38,
    color: '#B5A192',
    rotation: [0, 0, 0],
    orbitalSpeed: 0.03,
    rotationSpeed: 0.005,
    rings: false,
    textureUrl: '/textures/2k_mercury.jpg',
    description: 'Mercury is the smallest planet in the Solar System and the closest to the Sun. Its orbit around the Sun takes only 87.97 Earth days, the shortest of all the planets. Mercury rotates in a way that is unique in the Solar System. It spins 3 times on its axis for every 2 orbits around the Sun, a 3:2 spin-orbit resonance.',
    distanceFromSun: '36-70 million km',
    temperature: '-173°C to 427°C',
    moons: 0,
    hasRings: false,
    orbitPeriod: '88 days',
    diameter: '4,879.4 km',
    facts: [
      'Mercury has no atmosphere, which results in the most extreme temperature variations in the Solar System.',
      'Mercury\'s surface resembles that of the Moon, with numerous impact craters.',
      'Despite being the closest planet to the Sun, Venus is hotter due to its thick atmosphere creating a greenhouse effect.',
      'Mercury has no moons or rings.',
      'The planet has a large iron core, making up about 60% of its mass.'
    ]
  },
  {
    id: 'venus',
    name: 'Venus',
    position: [10.5, 0, 0],
    radius: 0.95,
    color: '#E6C498',
    rotation: [0, 0, 0],
    orbitalSpeed: 0.02,
    rotationSpeed: 0.002,
    rings: false,
    textureUrl: '/textures/2k_venus_surface.jpg',
    description: 'Venus is the second planet from the Sun and is the hottest planet in our solar system. It has a thick atmosphere full of carbon dioxide and clouds of sulfuric acid. The atmosphere traps heat and creates a runaway greenhouse effect, making it the hottest planet in our solar system with surface temperatures hot enough to melt lead.',
    distanceFromSun: '108 million km',
    temperature: '462°C (average)',
    moons: 0,
    hasRings: false,
    orbitPeriod: '225 days',
    diameter: '12,104 km',
    facts: [
      'Venus rotates in the opposite direction to most planets, a phenomenon known as retrograde rotation.',
      'A day on Venus (243 Earth days) is longer than its year (225 Earth days).',
      'Venus is sometimes called Earth\'s "sister planet" because of their similar size and mass.',
      'The pressure on Venus\'s surface is 92 times that of Earth, equivalent to being 900 meters underwater.',
      'Venus is the brightest natural object in the night sky after the Moon.'
    ]
  },
  {
    id: 'earth',
    name: 'Earth',
    position: [14, 0, 0],
    radius: 1,
    color: '#2A82C9',
    rotation: [0, 0, 0],
    orbitalSpeed: 0.015,
    rotationSpeed: 0.01,
    rings: false,
    textureUrl: '/textures/2k_earth_daymap.jpg',
    description: 'Earth is the third planet from the Sun and the only astronomical object known to harbor life. Earth has a dynamic atmosphere, which sustains Earth\'s surface conditions and protects it from most meteoroids and UV light from the Sun. 71% of the Earth\'s surface is covered with water.',
    distanceFromSun: '149.6 million km',
    temperature: '-88°C to 58°C',
    moons: 1,
    hasRings: false,
    orbitPeriod: '365.25 days',
    diameter: '12,742 km',
    facts: [
      'Earth is the only planet not named after a god.',
      'The Earth\'s rotation is gradually slowing down, adding about 1.7 milliseconds to our day every 100 years.',
      'The Earth\'s core is as hot as the Sun\'s surface.',
      'Earth\'s magnetic field is generated by the movement of liquid iron in the outer core.',
      'The Earth\'s atmosphere extends to about 10,000 km above sea level.'
    ]
  },
  {
    id: 'mars',
    name: 'Mars',
    position: [18, 0, 0],
    radius: 0.53,
    color: '#E27B58',
    rotation: [0, 0, 0],
    orbitalSpeed: 0.012,
    rotationSpeed: 0.008,
    rings: false,
    textureUrl: '/textures/2k_mars.jpg',
    description: 'Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System, only being larger than Mercury. Mars has a thin atmosphere and its surface features are reminiscent of both the impact craters of the Moon and the valleys, deserts, and polar ice caps of Earth.',
    distanceFromSun: '227.9 million km',
    temperature: '-153°C to 20°C',
    moons: 2,
    hasRings: false,
    orbitPeriod: '687 days',
    diameter: '6,779 km',
    facts: [
      'Mars is home to Olympus Mons, the largest volcano and highest known mountain in our Solar System.',
      'Mars experiences violent dust storms which can sometimes engulf the entire planet.',
      'Pieces of Mars have been found on Earth as meteorites, ejected from Mars by asteroid impacts.',
      'The reddish appearance of Mars is due to iron oxide (rust) on its surface.',
      'Mars has seasons similar to Earth, but they last twice as long because Mars takes longer to orbit the Sun.'
    ]
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    position: [25, 0, 0],
    radius: 2.5,
    color: '#E6A479',
    rotation: [0, 0, 0],
    orbitalSpeed: 0.008,
    rotationSpeed: 0.04,
    rings: true,
    textureUrl: '/textures/2k_jupiter.jpg',
    description: 'Jupiter is the fifth planet from the Sun and the largest in the Solar System. It is a gas giant with a mass more than two and a half times that of all the other planets in the Solar System combined, but slightly less than one-thousandth the mass of the Sun.',
    distanceFromSun: '778.5 million km',
    temperature: '-145°C (cloud tops)',
    moons: 79,
    hasRings: true,
    orbitPeriod: '11.86 years',
    diameter: '139,820 km',
    facts: [
      'Jupiter has the shortest day of all the planets, rotating once every 9.8 hours.',
      'The Great Red Spot on Jupiter is a storm that has been raging for at least 350 years.',
      'Jupiter\'s four largest moons (Io, Europa, Ganymede, and Callisto) were discovered by Galileo Galilei in 1610.',
      'Jupiter\'s magnetic field is 14 times stronger than Earth\'s and the largest in the Solar System.',
      'Jupiter emits more heat than it receives from the Sun, suggesting an internal heat source.'
    ]
  },
  {
    id: 'saturn',
    name: 'Saturn',
    position: [33, 0, 0],
    radius: 2.2,
    color: '#E6CDC3',
    rotation: [0, 0, 0],
    orbitalSpeed: 0.006,
    rotationSpeed: 0.03,
    rings: true,
    textureUrl: '/textures/2k_saturn.jpg',
    description: 'Saturn is the sixth planet from the Sun and the second-largest in the Solar System, after Jupiter. It is a gas giant with an average radius about nine and a half times that of Earth. Saturn has a prominent ring system that consists of nine continuous main rings and three discontinuous arcs.',
    distanceFromSun: '1.4 billion km',
    temperature: '-178°C (cloud tops)',
    moons: 82,
    hasRings: true,
    orbitPeriod: '29.45 years',
    diameter: '116,460 km',
    facts: [
      'Saturn\'s rings are mostly made of ice chunks, with some rock and dust.',
      'Saturn has the second-shortest day in the Solar System, rotating once every 10.7 hours.',
      'Saturn is the least dense planet in our Solar System and would float in water if there were an ocean large enough.',
      'One of Saturn\'s moons, Titan, is the second-largest moon in the Solar System and has a thick atmosphere.',
      'Saturn has periodic giant storms that encircle the entire planet, occurring roughly once per Saturn year.'
    ]
  },
  {
    id: 'uranus',
    name: 'Uranus',
    position: [40, 0, 0],
    radius: 1.8,
    color: '#CAF8FF',
    rotation: [0, 0, 0],
    orbitalSpeed: 0.004,
    rotationSpeed: 0.02,
    rings: true,
    textureUrl: '/textures/2k_uranus.jpg',
    description: 'Uranus is the seventh planet from the Sun. It has the third-largest planetary radius and fourth-largest planetary mass in the Solar System. Uranus\'s atmosphere is similar to Jupiter\'s and Saturn\'s in its primary composition of hydrogen and helium, but it contains more "ices" such as water, ammonia, and methane.',
    distanceFromSun: '2.9 billion km',
    temperature: '-224°C (cloud tops)',
    moons: 27,
    hasRings: true,
    orbitPeriod: '84 years',
    diameter: '50,724 km',
    facts: [
      'Uranus rotates on its side with an axial tilt of 98 degrees, likely caused by a collision with an Earth-sized object.',
      'Uranus was the first planet discovered with the aid of a telescope, by William Herschel in 1781.',
      'The methane in Uranus\'s atmosphere gives it its distinctive blue-green color.',
      'Uranus\'s rings were the second set to be discovered in the Solar System, after Saturn\'s.',
      'Uranus has the coldest planetary atmosphere in the Solar System, with minimum temperatures of -224°C.'
    ]
  },
  {
    id: 'neptune',
    name: 'Neptune',
    position: [47, 0, 0],
    radius: 1.7,
    color: '#5089F3',
    rotation: [0, 0, 0],
    orbitalSpeed: 0.003,
    rotationSpeed: 0.01,
    rings: true,
    textureUrl: '/textures/2k_neptune.jpg',
    description: 'Neptune is the eighth and farthest known solar planet from the Sun. In the Solar System, it is the fourth-largest planet by diameter, the third-most-massive planet, and the densest giant planet. Neptune is 17 times the mass of Earth, slightly more massive than its near-twin Uranus.',
    distanceFromSun: '4.5 billion km',
    temperature: '-214°C (cloud tops)',
    moons: 14,
    hasRings: true,
    orbitPeriod: '164.8 years',
    diameter: '49,244 km',
    facts: [
      'Neptune was the first planet located through mathematical predictions rather than observation.',
      'Neptune has the strongest winds in the Solar System, reaching speeds of 2,100 km/h.',
      'Despite being farther from the Sun, Neptune has a hotter core than Uranus.',
      'Neptune has a Great Dark Spot, similar to Jupiter\'s Great Red Spot, which is a storm system.',
      'Neptune completes one orbit of the Sun every 164.8 years, meaning it has only completed one orbit since its discovery in 1846.'
    ]
  },
  {
    id: 'pluto',
    name: 'Pluto (Dwarf Planet)',
    position: [54, 0, 0],
    radius: 0.2,
    color: '#B3B3B3',
    rotation: [0, 0, 0],
    orbitalSpeed: 0.002,
    rotationSpeed: 0.004,
    rings: false,
    textureUrl: undefined,
    description: 'Pluto is a dwarf planet in the Kuiper belt, a ring of bodies beyond the orbit of Neptune. It was the first Kuiper belt object to be discovered and is the largest known dwarf planet. Pluto was discovered by Clyde Tombaugh in 1930 and declared to be the ninth planet from the Sun. After 1992, its status as a planet was questioned following the discovery of several objects of similar size in the Kuiper belt. In 2005, Eris, a dwarf planet in the scattered disc which is 27% more massive than Pluto, was discovered. This led the International Astronomical Union (IAU) to define the term "planet" formally in 2006, during their 26th General Assembly. That definition excluded Pluto and reclassified it as a dwarf planet.',
    distanceFromSun: '5.9 billion km (average)',
    temperature: '-233°C (average)',
    moons: 5,
    hasRings: false,
    orbitPeriod: '248.09 years',
    diameter: '2,376 km',
    facts: [
      'Pluto was reclassified from a planet to a dwarf planet in 2006.',
      'Pluto\'s orbit is highly elliptical, sometimes bringing it closer to the Sun than Neptune.',
      'Pluto\'s largest moon, Charon, is so big relative to Pluto that they orbit a point between them, making it a binary system.',
      'Pluto has a thin atmosphere that expands when it\'s closer to the Sun and collapses as it moves away.',
      'NASA\'s New Horizons spacecraft completed the first fly-by of Pluto in 2015, providing the first detailed images of its surface.'
    ]
  },
  {
    id: 'moon',
    name: 'Earth\'s Moon',
    position: [0, 0, 0], // Position is controlled by Earth-Moon system
    radius: 0.27,
    color: '#CCCCCC',
    rotation: [0, 0, 0],
    orbitalSpeed: 0,  // Handled by the EarthMoon component
    rotationSpeed: 0.01,
    rings: false,
    textureUrl: '/textures/2k_moon.jpg',
    description: 'The Moon is Earth\'s only natural satellite and the fifth largest moon in the Solar System. It formed about 4.5 billion years ago, likely from the debris left after a Mars-sized body collided with Earth. The Moon is in synchronous rotation with Earth, always showing the same face, with its near side marked by dark volcanic maria amid bright ancient crustal highlands and prominent impact craters.',
    distanceFromSun: '150 million km (same as Earth)',
    temperature: '-173°C to 127°C',
    moons: 0,
    hasRings: false,
    orbitPeriod: '27.3 days (around Earth)',
    diameter: '3,474 km',
    facts: [
      'The Moon is the only celestial body that humans have visited beyond Earth.',
      'The Moon is slowly moving away from Earth at a rate of about 3.8 cm per year.',
      'The Moon has no atmosphere, which means there\'s no weather, no sound can be heard, and the sky always appears black.',
      'The gravity on the Moon is about 1/6th of Earth\'s gravity.',
      'The presence of the Moon stabilizes Earth\'s axial tilt, which helps maintain a relatively stable climate for billions of years.'
    ]
  }
];

const FixedSpaceScene: React.FC<FixedSpaceSceneProps> = ({ 
  onPlanetSelect, 
  orbitControlsSettings 
}) => {
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 15, 35]);
  const [cameraTarget, setCameraTarget] = useState<[number, number, number]>([0, 0, 0]);
  // Add animation states
  const [isAnimating, setIsAnimating] = useState(false);
  const [targetCameraPosition, setTargetCameraPosition] = useState<[number, number, number]>([0, 15, 35]);
  const [targetCameraLookAt, setTargetCameraLookAt] = useState<[number, number, number]>([0, 0, 0]);
  const [animationStartTime, setAnimationStartTime] = useState(Date.now() / 1000); // Initialize with current time
  const animationDuration = 1.5; // Reduced duration for quicker transitions (was 2.5)
  // Add state to track control stability - starts disabled to give camera time to settle
  const [controlsEnabled, setControlsEnabled] = useState(false);
  
  // Use a ref to track if the component has mounted
  const hasMounted = useRef(false);
  
  const controlsRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const planetRefs = useRef<{[key: string]: THREE.Group | null}>({});
  
  // Set hasMounted ref on initial render
  useEffect(() => {
    hasMounted.current = true;
    
    // Add a small delay before enabling controls on mount to ensure proper initialization
    setTimeout(() => {
      if (controlsRef.current) {
        controlsRef.current.update();
      }
    }, 300);
  }, []);
  
  // Get the numeric speed multiplier
  const speedMultiplier = getSpeedMultiplier(orbitControlsSettings.orbitSpeed);

  // Register planet ref
  const registerPlanetRef = (id: string, ref: THREE.Group | null) => {
    planetRefs.current[id] = ref;
  };

  // Function to handle planet selection
  const handleSelectPlanet = (id: string) => {
    setSelectedPlanet(id);
    
    // Find the selected planet data
    const planet = planetsData.find(p => p.id === id);
    if (planet) {
      if (id === 'moon') {
        // For Moon, adjust camera to Earth's position plus Moon's relative position
        const earth = planetsData.find(p => p.id === 'earth');
        if (earth) {
          const earthPos = earth.position;
          // Calculate Earth's position in its orbit
          const earthOrbitRadius = Math.sqrt(earthPos[0] ** 2 + earthPos[1] ** 2 + earthPos[2] ** 2);
          // Set camera to look at Earth + Moon position
          setTargetCameraPosition([earthOrbitRadius + 3, 2, 0.5]);
          setTargetCameraLookAt([earthOrbitRadius, 0, 0]);
        }
      } else {
        // For regular planets, calculate the orbit radius and set the camera accordingly
        const orbitRadius = Math.sqrt(planet.position[0] ** 2 + planet.position[1] ** 2 + planet.position[2] ** 2);
        const distance = planet.radius * (planet.id === 'sun' ? 12 : 8);
        setTargetCameraPosition([orbitRadius + distance, 3, 0.5]);
        setTargetCameraLookAt([orbitRadius, 0, 0]);
      }
      
      // Start animation
      setIsAnimating(true);
      setAnimationStartTime(Date.now() / 1000); // Current time in seconds
      
      // Pass the selected planet data to the parent component
      if (id === 'sun') {
        onPlanetSelect(sunData);
      } else if (id === 'moon') {
        onPlanetSelect(moonData);
      } else {
        onPlanetSelect(planet);
      }
    }
  };

  // Handle selecting the Sun
  const handleSelectSun = () => {
    setSelectedPlanet('sun');
    setTargetCameraPosition([0, 3, 8]);
    setTargetCameraLookAt([0, 0, 0]);
    
    // Start animation
    setIsAnimating(true);
    setAnimationStartTime(Date.now() / 1000);
    
    onPlanetSelect(sunData);
  };

  // Handle selecting the Moon
  const handleSelectMoon = () => {
    setSelectedPlanet('moon');
    
    // Find Earth's position
    const earth = planetsData.find(p => p.id === 'earth');
    if (earth) {
      const earthPos = earth.position;
      // Calculate Earth's position in its orbit
      const earthOrbitRadius = Math.sqrt(earthPos[0] ** 2 + earthPos[1] ** 2 + earthPos[2] ** 2);
      // Position camera to focus on the Moon near Earth
      setTargetCameraPosition([earthOrbitRadius + 2.5, 1, 0.5]);
      setTargetCameraLookAt([earthOrbitRadius + 1.8, 0, 0]);
    }
    
    // Start animation
    setIsAnimating(true);
    setAnimationStartTime(Date.now() / 1000);
    
    onPlanetSelect(moonData);
  };

  // Close the planet info panel
  const handleClosePlanetInfo = () => {
    setSelectedPlanet(null);
    // Reset camera position to the default view with animation
    setTargetCameraPosition([0, 15, 35]);
    setTargetCameraLookAt([0, 0, 0]);
    
    // Start animation
    setIsAnimating(true);
    setAnimationStartTime(Date.now() / 1000);
    
    onPlanetSelect(null);
  };

  // Handle camera perspective changes
  useEffect(() => {
    // Don't change the camera if a planet is selected
    if (selectedPlanet) return;
    
    // Handle perspective changes
    switch(orbitControlsSettings.viewPerspective) {
      case 'top':
        // Make top-down view with less angle for more stability
        setTargetCameraPosition([0, 70, 0]); // Increased height for better overview
        setTargetCameraLookAt([0, 0, 0]);
        break;
      case 'side':
        // Adjust side view to a pure side perspective for stability
        setTargetCameraPosition([60, 0, 0]);
        setTargetCameraLookAt([0, 0, 0]);
        break;
      case 'isometric':
      default:
        // FREE view default position
        setTargetCameraPosition([0, 15, 35]);
        setTargetCameraLookAt([0, 0, 0]);
        break;
    }
    
    // Only animate if component has mounted (skip initial render)
    if (hasMounted.current) {
      setIsAnimating(true);
      setAnimationStartTime(Date.now() / 1000);
    }
    
    // Apply view-specific constraints immediately
    if (controlsRef.current) {
      switch(orbitControlsSettings.viewPerspective) {
        case 'top':
          // Top-down view constraints - Modified for better top-down control
          controlsRef.current.minPolarAngle = Math.PI / 3; // 60 degrees (slightly less restrictive)
          controlsRef.current.maxPolarAngle = Math.PI / 2 + 0.1; // Slightly more than 90 degrees
          controlsRef.current.minAzimuthAngle = -Infinity;
          controlsRef.current.maxAzimuthAngle = Infinity;
          break;
        case 'side':
          // Side view constraints
          controlsRef.current.minPolarAngle = Math.PI / 6; // 30 degrees
          controlsRef.current.maxPolarAngle = Math.PI - Math.PI / 6; // 150 degrees
          controlsRef.current.minAzimuthAngle = -Infinity;
          controlsRef.current.maxAzimuthAngle = Infinity;
          break;
        case 'isometric':
        default:
          // FREE view has no constraints
          controlsRef.current.minPolarAngle = 0;
          controlsRef.current.maxPolarAngle = Math.PI;
          controlsRef.current.minAzimuthAngle = -Infinity;
          controlsRef.current.maxAzimuthAngle = Infinity;
          break;
      }
      
      // Make sure controls are updated
      controlsRef.current.update();
    }
  }, [orbitControlsSettings.viewPerspective, selectedPlanet]);

  // Animate camera movement
  useFrame(() => {
    if (isAnimating) {
      const currentTime = Date.now() / 1000;
      const elapsedTime = currentTime - animationStartTime;
      const progress = Math.min(elapsedTime / animationDuration, 1);
      
      // Use a simpler easing function for more predictable motion
      const eased = progress; // Linear easing for more stable transitions
      
      // Interpolate between current position and target position
      const newX = cameraPosition[0] + (targetCameraPosition[0] - cameraPosition[0]) * eased;
      const newY = cameraPosition[1] + (targetCameraPosition[1] - cameraPosition[1]) * eased;
      const newZ = cameraPosition[2] + (targetCameraPosition[2] - cameraPosition[2]) * eased;
      
      // Interpolate between current target and destination target
      const newTargetX = cameraTarget[0] + (targetCameraLookAt[0] - cameraTarget[0]) * eased;
      const newTargetY = cameraTarget[1] + (targetCameraLookAt[1] - cameraTarget[1]) * eased;
      const newTargetZ = cameraTarget[2] + (targetCameraLookAt[2] - cameraTarget[2]) * eased;
      
      // Update camera position and target without shake
      setCameraPosition([newX, newY, newZ]);
      setCameraTarget([newTargetX, newTargetY, newTargetZ]);
      
      // Update controls target but keep them enabled during animation
      if (controlsRef.current) {
        controlsRef.current.target.set(newTargetX, newTargetY, newTargetZ);
        controlsRef.current.update();
      }
      
      // End animation when complete
      if (progress >= 1) {
        // Set final positions to ensure we're exactly at the target
        setCameraPosition([...targetCameraPosition]);
        setCameraTarget([...targetCameraLookAt]);
        
        // Apply view-specific constraints after animation completes
        if (controlsRef.current) {
          // Apply view-specific constraints based on the current perspective
          switch (orbitControlsSettings.viewPerspective) {
            case 'isometric':
              // Reset all constraints for free view
              controlsRef.current.minPolarAngle = 0;
              controlsRef.current.maxPolarAngle = Math.PI;
              controlsRef.current.minAzimuthAngle = -Infinity;
              controlsRef.current.maxAzimuthAngle = Infinity;
              break;
            case 'top':
              // Apply top-down view constraints - Match the same values as above
              controlsRef.current.minPolarAngle = Math.PI / 3; // 60 degrees (slightly less restrictive)
              controlsRef.current.maxPolarAngle = Math.PI / 2 + 0.1; // Slightly more than 90 degrees
              break;
            case 'side':
              // Apply side view constraints
              controlsRef.current.minPolarAngle = Math.PI / 6; // 30 degrees
              controlsRef.current.maxPolarAngle = Math.PI - Math.PI / 6; // 150 degrees
              break;
          }
          
          // Update the controls
          controlsRef.current.update();
        }
        
        // Finally set the animation state to false
        setIsAnimating(false);
      }
    }
  });

  // Update the camera controls whenever camera position or target changes
  useEffect(() => {
    if (controlsRef.current && !isAnimating) {
      controlsRef.current.target.set(...cameraTarget);
      controlsRef.current.update();
    }
  }, [cameraPosition, cameraTarget, isAnimating]);

  return (
    <>
      {/* THREE.js content */}
      <PerspectiveCamera makeDefault position={cameraPosition} fov={50} ref={cameraRef} />
      
      {/* Controls for camera movement */}
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.1}
        rotateSpeed={0.5}
        zoomSpeed={0.7}
        panSpeed={0.5}
        minDistance={3}
        maxDistance={100}
        enabled={true} // Always keep enabled
        enableRotate={true}
        enableZoom={true}
        enablePan={orbitControlsSettings.viewPerspective === 'isometric'}
        // Use simpler button mappings
        mouseButtons={{
          LEFT: THREE.MOUSE.ROTATE,
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: orbitControlsSettings.viewPerspective === 'isometric' ? THREE.MOUSE.PAN : THREE.MOUSE.ROTATE
        }}
        // Add additional settings for smoother control
        touches={{
          ONE: THREE.TOUCH.ROTATE,
          TWO: THREE.TOUCH.DOLLY_PAN
        }}
        screenSpacePanning={true} // More intuitive panning
      />
      
      {/* Stars background */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Ambient light for basic scene illumination */}
      <ambientLight intensity={0.3} />
      
      {/* Sun with light */}
      <group position={[0, 0, 0]}>
        <pointLight intensity={2} distance={100} decay={0.5} />
        <SimpleSun 
          position={[0, 0, 0]} 
          isSelected={selectedPlanet === 'sun'} 
          onClick={handleSelectSun} 
          orbitSpeedMultiplier={speedMultiplier}
          ref={(ref) => registerPlanetRef('sun', ref)}
        />
      </group>
      
      {/* Render all planets */}
      {planetsData.map((planet) => {
        if (planet.id !== 'moon') { // Don't render Moon as a separate planet
          return (
            <Planet 
              key={planet.id}
              data={planet}
              isSelected={selectedPlanet === planet.id}
              onClick={() => handleSelectPlanet(planet.id)}
              onMoonClick={planet.id === 'earth' ? handleSelectMoon : undefined}
              orbitSpeedMultiplier={speedMultiplier}
              ref={(ref) => registerPlanetRef(planet.id, ref)}
            />
          );
        }
        return null;
      })}
    </>
  );
};

export default FixedSpaceScene; 