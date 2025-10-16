 'use client';

import React, { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

// Airdrop model component that clones the scene
function AirdropModel() {
  const ref = useRef<any>(null);
  const { scene } = useGLTF('/models/example1.glb');

  // Clone the scene to allow multiple instances
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.003;
    }
  });

  return <primitive ref={ref} object={clonedScene} scale={1.5} position={[0, 0, 0]} />;
}

// Preload the model
useGLTF.preload('/models/example1.glb');

export default function AirdropViewer() {
  return (
    <div 
      style={{ 
        width: '100%', 
        height: '100%', 
        background: 'transparent',
        position: 'relative'
      }}
    >
      <Canvas 
        camera={{ position: [0, 0.5, 2.5], fov: 50 }}
        gl={{ 
          antialias: true,
          alpha: true
        }}
        style={{ 
          width: '100%', 
          height: '100%',
          display: 'block',
          touchAction: 'none',
          background: 'transparent'
        }}
      >
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <directionalLight position={[-5, 3, -5]} intensity={0.8} />
        <spotLight position={[0, 5, 0]} intensity={0.5} />
        <Suspense fallback={null}>
          <AirdropModel />
        </Suspense>
        <OrbitControls 
          makeDefault
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={1.5}
          maxDistance={5}
          enableDamping={true}
          dampingFactor={0.05}
          rotateSpeed={1}
        />
      </Canvas>
    </div>
  );
}