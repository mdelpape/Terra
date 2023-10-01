/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
import React, {useRef} from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { useFrame } from '@react-three/fiber';

export default function Moon(props) {
  const displacementTexture = useLoader(TextureLoader, '/assets/moon_displacment_map.jpeg');
  const normalTexture = useLoader(TextureLoader, '/assets/moon.jpeg');
  const objectRef = useRef();

  const orbitRadius = 40;
  const speed = 1;
  const earthPosition = [0, 0, 0];

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    objectRef.current.position.z = earthPosition[1] + orbitRadius * Math.cos(elapsedTime * speed);
    objectRef.current.position.x = earthPosition[2] + orbitRadius * Math.sin(elapsedTime * speed);
  });


  return (
    <group position={[0, 0, 30]}
      ref={objectRef}
    >
      <mesh {...props}
        castShadow
      >
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
