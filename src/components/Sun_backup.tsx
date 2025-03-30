import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface SunProps {
  position: [number, number, number];
}

const Sun: React.FC<SunProps> = ({ position }) => {
  const sunRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  // Animate sun rotation and glow
  useFrame((_, delta) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += delta * 0.05;
    }
    
    if (glowRef.current) {
      glowRef.current.rotation.y -= delta * 0.03;
      glowRef.current.rotation.z += delta * 0.02;
    }
  });
  
  return (
    <group position={position}>
      {/* Sun core */}
      <Sphere ref={sunRef} args={[3, 32, 32]}>
        <meshStandardMaterial
          color="#FDB813"
          emissive="#FF5E13"
          emissiveIntensity={1}
        />
      </Sphere>
      
      {/* Sun glow effect */}
      <Sphere ref={glowRef} args={[3.5, 32, 32]}>
        <meshBasicMaterial
          color="#FF7E00"
          transparent
          opacity={0.2}
        />
      </Sphere>
      
      {/* Sun light source */}
      <pointLight
        intensity={3}
        distance={100}
        decay={2}
        color="#FFF5F2"
      />
      
      {/* Light flare effect */}
      <mesh>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial
          map={new THREE.TextureLoader().load('https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Lens_Flare_-_Hayden_Planetarium.jpg/640px-Lens_Flare_-_Hayden_Planetarium.jpg')}
          transparent
          opacity={0.1}
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

export default Sun; 