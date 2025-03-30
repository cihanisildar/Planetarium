import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sphere, useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';

interface SunProps {
  position: [number, number, number];
  isSelected: boolean;
  onClick: () => void;
}

const SimpleSun: React.FC<SunProps> = ({ position, isSelected, onClick }) => {
  const sunRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [pulseScale, setPulseScale] = useState(1);
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
      if (hovered) canvas.classList.remove('planet-hover');
    };
  }, [hovered, gl]);
  
  // Load sun texture using drei's useTexture hook
  const sunTexture = useTexture('/textures/2k_sun.jpg');
  
  // Animate sun rotation and pulse effect
  useFrame((_, delta) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += delta * 0.005;
    }
    
    // Pulse animation for selected sun
    if (isSelected && pulseRef.current) {
      // Oscillate the pulse scale between 1 and 1.2
      const newScale = 1 + 0.2 * Math.sin(Date.now() * 0.003);
      setPulseScale(newScale);
      pulseRef.current.scale.set(newScale, newScale, newScale);
    }
  });
  
  return (
    <group position={position}>
      {/* Main sun sphere */}
      <Sphere 
        ref={sunRef} 
        args={[3, 32, 32]}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial 
          map={sunTexture}
          emissive={hovered || isSelected ? "#FF8040" : "#FF5E13"}
          emissiveIntensity={hovered || isSelected ? 2 : 1.5}
          emissiveMap={sunTexture}
        />
      </Sphere>
      
      {/* Add glow effect */}
      <Sphere args={[3.2, 32, 32]}>
        <meshBasicMaterial 
          color="#FF7B00"
          transparent={true}
          opacity={0.3}
        />
      </Sphere>
      
      {/* Add stronger outer glow */}
      <Sphere args={[3.5, 32, 32]}>
        <meshBasicMaterial 
          color="#FFCC33"
          transparent={true}
          opacity={0.15}
        />
      </Sphere>
      
      {/* Show selection indicator when sun is selected */}
      {isSelected && (
        <>
          {/* Outer highlight ring */}
          <Sphere args={[4, 32, 32]}>
            <meshBasicMaterial
              color="#FFCC33"
              transparent
              opacity={0.1}
              wireframe
            />
          </Sphere>
          
          {/* Pulsing effect */}
          <mesh ref={pulseRef}>
            <ringGeometry args={[4.5, 4.6, 64]} />
            <meshBasicMaterial
              color="#FF9933"
              transparent
              opacity={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
        </>
      )}
      
      {/* Sun name label that always faces the camera */}
      {(hovered || isSelected) && (
        <Html position={[0, 4.5, 0]} center>
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
            Sun
          </div>
        </Html>
      )}
      
      <pointLight intensity={4} distance={120} color="#FFF5F2" />
    </group>
  );
};

export default SimpleSun; 