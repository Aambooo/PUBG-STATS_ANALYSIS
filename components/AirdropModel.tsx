'use client';

import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import type { GLTF } from 'three-stdlib'; // optional typing helper

function AirdropModel() {
  // load from the public folder path
  const gltf = useGLTF('/models/pubg_mobile_air_drop.glb') as GLTF & { scene: any };
  const ref = useRef<any>();

  // optional slow rotation
  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.004;
  });

  return <primitive ref={ref} object={gltf.scene} scale={1.2} />;
}

export default function AirdropViewer() {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas camera={{ position: [0, 1, 3], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 4, 5]} intensity={1} />
        <Suspense fallback={null}>
          <AirdropModel />
        </Suspense>
        <OrbitControls enablePan={true} />
      </Canvas>
    </div>
  );
}
