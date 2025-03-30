import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PlanetProps } from '../types/types';
import { Sphere, Ring, Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Types for the Moon component props
interface EarthMoonProps {
  isEarthSelected: boolean;
  onMoonClick: (e: React.MouseEvent) => void;
}

// Component for Earth's Moon
const EarthMoon: React.FC<EarthMoonProps> = ({ isEarthSelected, onMoonClick }) => {
  const moonRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const { gl } = useThree();
  
  // Load moon texture
  const moonTexture = useTexture('/textures/2k_moon.jpg');
  
  // Handle cursor style changes for moon hover
  useEffect(() => {
    const canvas = gl.domElement;
    if (hovered) {
      canvas.classList.add('planet-hover');
    } else {
      canvas.classList.remove('planet-hover');
    }
    
    return () => {
      if (hovered) canvas.classList.remove('planet-hover');
    };
  }, [hovered, gl]);
  
  // Animate moon orbit around Earth
  useFrame((_, delta) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y += delta * 0.2; // Moon orbit speed
    }
    if (moonRef.current) {
      moonRef.current.rotation.y += delta * 0.01; // Moon rotation speed
    }
  });
  
  return (
    <group ref={orbitRef}>
      <group position={[1.8, 0, 0]}> {/* Moon's distance from Earth */}
        <Sphere 
          ref={moonRef}
          args={[0.27, 32, 32]} 
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={onMoonClick}
        >
          <meshStandardMaterial
            map={moonTexture}
            color="white"
            metalness={0.05}
            roughness={0.8}
            emissive={hovered ? "#444" : "#222"}
            emissiveIntensity={0.3}
          />
        </Sphere>
        
        {/* Moon name label that always faces the camera */}
        {hovered && (
          <Html position={[0, 0.4, 0]} center>
            <div style={{
              background: 'rgba(0,0,0,0.7)',
              padding: '6px 10px',
              borderRadius: '4px',
              color: 'white',
              fontSize: '12px',
              fontFamily: 'var(--primary-font), Arial',
              userSelect: 'none',
              whiteSpace: 'nowrap'
            }}>
              Moon
            </div>
          </Html>
        )}
      </group>
    </group>
  );
};

// Update the PlanetProps interface
interface PlanetPropsWithMoon extends PlanetProps {
  onMoonClick?: () => void;
}

const Planet: React.FC<PlanetPropsWithMoon> = ({ data, isSelected, onClick, onMoonClick }) => {
  const { id, name, position, radius, color, rotation, orbitalSpeed, rotationSpeed, rings, textureUrl } = data;
  
  const planetRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [pulseScale, setPulseScale] = useState(1);
  
  // Get the document body to change cursor style
  const { gl } = useThree();
  
  // Handle cursor style changes
  useEffect(() => {
    const canvas = gl.domElement;
    if (hovered) {
      canvas.classList.add('planet-hover');
    } else {
      canvas.classList.remove('planet-hover');
    }
    
    return () => {
      canvas.classList.remove('planet-hover');
    };
  }, [hovered, gl]);
  
  // Calculate orbit radius based on position
  const orbitRadius = Math.sqrt(position[0] ** 2 + position[1] ** 2 + position[2] ** 2);
  
  // Determine texture path
  const texturePath = textureUrl || (() => {
    switch(id) {
      case 'mercury': return '/textures/2k_mercury.jpg';
      case 'venus': return '/textures/2k_venus_surface.jpg';
      case 'earth': return '/textures/2k_earth_daymap.jpg';
      case 'mars': return '/textures/2k_mars.jpg';
      case 'jupiter': return '/textures/2k_jupiter.jpg';
      case 'saturn': return '/textures/2k_saturn.jpg';
      case 'uranus': return '/textures/2k_uranus.jpg';
      case 'neptune': return '/textures/2k_neptune.jpg';
      default: return '/textures/2k_stars.jpg';
    }
  })();
  
  // Always load ring texture path, but only use it when needed
  const ringTexturePath = '/textures/2k_saturn_ring_alpha.png';
  
  // Load textures using drei's useTexture hook - no conditional calls
  const planetTexture = useTexture(texturePath);
  const saturnRingTexture = useTexture(ringTexturePath);
  
  // Animation for planet orbit and rotation
  useFrame((_, delta) => {
    // Orbit and rotation animations
    if (orbitRef.current) {
      orbitRef.current.rotation.y += delta * orbitalSpeed;
    }
    
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * rotationSpeed;
    }
    
    // Pulse animation for selected planet
    if (isSelected && pulseRef.current) {
      // Oscillate the pulse scale between 1 and 1.2
      const newScale = 1 + 0.2 * Math.sin(Date.now() * 0.003);
      setPulseScale(newScale);
      pulseRef.current.scale.set(newScale, newScale, newScale);
    }
  });
  
  // Draw the orbit path
  const orbitPoints = [];
  const orbitSegments = 64;
  for (let i = 0; i <= orbitSegments; i++) {
    const angle = (i / orbitSegments) * Math.PI * 2;
    orbitPoints.push(
      new THREE.Vector3(
        orbitRadius * Math.cos(angle),
        0,
        orbitRadius * Math.sin(angle)
      )
    );
  }
  
  const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
  
  // Function to handle moon click
  const handleMoonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Pass the moon click to parent if callback is provided
    if (onMoonClick) {
      onMoonClick();
    } else {
      // Otherwise just select the Earth
      onClick();
    }
  };
  
  return (
    <>
      {/* Orbit path */}
      <primitive object={new THREE.Line(orbitGeometry, new THREE.LineBasicMaterial({ color: "#666", transparent: true, opacity: 0.2 }))} />
      
      {/* Planet with orbit */}
      <group ref={orbitRef}>
        <group position={[orbitRadius, 0, 0]}>
          <Sphere
            ref={planetRef}
            args={[radius, 32, 32]}
            onClick={onClick}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
          >
            <meshStandardMaterial
              map={planetTexture}
              color="white" 
              metalness={0.05}
              roughness={0.6}
              emissive={hovered || isSelected ? "#444" : "#222"}
              emissiveIntensity={0.3}
            />
          </Sphere>
          
          {/* Add Moon for Earth */}
          {id === 'earth' && <EarthMoon isEarthSelected={isSelected} onMoonClick={handleMoonClick} />}
          
          {/* Display rings for planets that have them */}
          {id === 'saturn' && (
            <>
              <Ring 
                args={[radius * 1.5, radius * 2.5, 64]} 
                rotation={[Math.PI / 2, 0, 0]}
              >
                <meshStandardMaterial 
                  color="white"
                  map={saturnRingTexture}
                  side={THREE.DoubleSide} 
                  transparent 
                  opacity={1.0}
                  alphaTest={0.1}
                  depthWrite={false}
                  metalness={0.1}
                  roughness={0.6}
                />
              </Ring>
            </>
          )}
          
          {/* Show selection indicator when planet is selected */}
          {isSelected && (
            <>
              {/* Inner glow */}
              <Sphere args={[radius * 1.1, 32, 32]}>
                <meshBasicMaterial
                  color="#4fc3f7"
                  transparent
                  opacity={0.2}
                />
              </Sphere>
              
              {/* Outer highlight ring */}
              <Sphere args={[radius * 1.25, 32, 32]}>
                <meshBasicMaterial
                  color="#81d4fa"
                  transparent
                  opacity={0.1}
                  wireframe
                />
              </Sphere>
              
              {/* Pulsing effect */}
              <mesh ref={pulseRef}>
                <ringGeometry args={[radius * 1.4, radius * 1.45, 64]} />
                <meshBasicMaterial
                  color="#29b6f6"
                  transparent
                  opacity={0.3}
                  side={THREE.DoubleSide}
                />
              </mesh>
            </>
          )}
          
          {/* Planet name label that always faces the camera */}
          {(hovered || isSelected) && (
            <Html position={[0, radius * 1.5, 0]} center>
              <div style={{
                background: 'rgba(0,0,0,0.7)',
                padding: '6px 10px',
                borderRadius: '4px',
                color: 'white',
                fontSize: '12px',
                fontFamily: 'var(--primary-font), Arial',
                userSelect: 'none',
                whiteSpace: 'nowrap'
              }}>
                {name}
              </div>
            </Html>
          )}
        </group>
      </group>
    </>
  );
};

export default Planet; 