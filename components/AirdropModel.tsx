'use client';

import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

// Fallback box component
function FallbackBox() {
  const meshRef = useRef<any>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.004;
      meshRef.current.rotation.x += 0.002;
    }
  });
  
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1.2, 1.2, 1.2]} />
      <meshStandardMaterial 
        color="#8B4513" 
        metalness={0.3} 
        roughness={0.7}
      />
    </mesh>
  );
}

// Airdrop model component
function AirdropModel() {
  const ref = useRef<any>(null);
  
  let gltf;
  try {
    gltf = useGLTF('/models/pubg_mobile_air_drop.glb');
  } catch (error) {
    console.error('Failed to load GLB model:', error);
    return <FallbackBox />;
  }

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.004;
    }
  });

  if (!gltf || !gltf.scene) {
    return <FallbackBox />;
  }

  return <primitive ref={ref} object={gltf.scene} scale={1.2} />;
}

export default function AirdropViewer() {
  return (
    <div style={{ width: '100%', height: '100%', background: '#000' }}>
      <Canvas 
        camera={{ position: [0, 1, 3], fov: 50 }}
        gl={{ alpha: false, antialias: true }}
      >
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <directionalLight position={[-5, 3, -5]} intensity={0.5} />
        <Suspense fallback={<FallbackBox />}>
          <AirdropModel />
        </Suspense>
        <OrbitControls 
          enablePan={false}
          enableZoom={true}
          minDistance={2}
          maxDistance={5}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}