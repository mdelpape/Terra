/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
import React, { useRef } from 'react';
import { useLoader, useFrame, useThree } from '@react-three/fiber';
import { TextureLoader } from 'three';

export default function Moon(props) {
  const displacementTexture = useLoader(TextureLoader, '/assets/moon_displacment_map.jpeg');
  const normalTexture = useLoader(TextureLoader, '/assets/moon.jpeg');
  const objectRef = useRef();
  const { camera } = useThree();

  const orbitRadius = 40;
  const cameraOrbitRadius = 100; // Larger radius for the camera
  const speed = 0.2;
  const earthPosition = [0, 0, 0];

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    const x = earthPosition[2] + orbitRadius * Math.sin(elapsedTime * speed);
    const z = earthPosition[1] + orbitRadius * Math.cos(elapsedTime * speed);

    objectRef.current.position.set(x, 0, z);

    const cameraX = earthPosition[2] + cameraOrbitRadius * Math.sin(elapsedTime * speed);
    const cameraZ = earthPosition[1] + cameraOrbitRadius * Math.cos(elapsedTime * speed);

    camera.position.set(cameraX, 0, cameraZ);
    camera.lookAt(earthPosition[0], earthPosition[1], earthPosition[2]);
  });

  return (
    <group position={[0, 0, 30]} ref={objectRef}>
      <mesh {...props} castShadow>
        <sphereGeometry args={[5, 20, 100]} />
        <meshStandardMaterial
          map={normalTexture}
          displacementMap={displacementTexture}
          displacementScale={0.4}
        />
      </mesh>
    </group>
  );
}
