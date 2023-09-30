/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react/no-unknown-property */
import { useState, useEffect, useRef } from 'react';
import { OrbitControls } from "@react-three/drei";
import { TextureLoader, Vector3, Group } from "three";
import { useLoader, useFrame, useThree } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { Matrix4, Quaternion } from 'three';
import Plane from './Plane';


export default function Experience() {
  const ref = useRef();
  const sunRef = useRef();
  const earthRef = useRef();
  const groupRef = useRef();

  useEffect(() => {
    groupRef.current.add(earthRef.current);
  }, []);

  const [isUpArrowPressed, setIsUpArrowPressed] = useState(false);
  const [isDownArrowPressed, setIsDownArrowPressed] = useState(false);
  const [isLeftArrowPressed, setIsLeftArrowPressed] = useState(false);
  const [isRightArrowPressed, setIsRightArrowPressed] = useState(false);

  const displacementTexture = useLoader(TextureLoader, '/assets/World_elevation_map.png');
  const texture = useLoader(TextureLoader, '/assets/earth.jpg');
  texture.anisotropy = 16;

  const { camera } = useThree();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowUp') {
        setIsUpArrowPressed(true);
      }
      if (event.key === 'ArrowDown') {
        setIsDownArrowPressed(true);
      }
      if (event.key === 'ArrowLeft') {
        setIsLeftArrowPressed(true);
      }
      if (event.key === 'ArrowRight') {
        setIsRightArrowPressed(true);
      }
    };
    const handleKeyUp = (event) => {
      if (event.key === 'ArrowUp') {
        setIsUpArrowPressed(false);
      }
      if (event.key === 'ArrowDown') {
        setIsDownArrowPressed(false);
      }
      if (event.key === 'ArrowLeft') {
        setIsLeftArrowPressed(false);
      }
      if (event.key === 'ArrowRight') {
        setIsRightArrowPressed(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // rotate the earth left and right
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime() * 0.1;
    if (isLeftArrowPressed) {
      earthRef.current.rotation.y += 0.01;
    }
    if (isRightArrowPressed) {
      earthRef.current.rotation.y -= 0.01;
    }
    if (isUpArrowPressed) {
      earthRef.current.rotation.x += 0.01;
    }
    if (isDownArrowPressed) {
      earthRef.current.rotation.x -= 0.01;
    }
  });



  // rotate a sun around the earth
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime() * 1;
    sunRef.current.position.x = 300 * Math.cos(time);
    sunRef.current.position.z = 300 * Math.sin(time);
  });

  return (
    <>
      <EffectComposer>
        <Bloom
          luminanceThreshold={1}
          luminanceSmoothing={0.075}
          height={0}
        />
        <ambientLight intensity={3} />
        <group ref={groupRef}
          position={[0, 0, -10]}
          rotation={[0, 0, 0]}
        >
          <mesh ref={earthRef} position={[0, 0, -25]}
            rotation={[0, -.1, 0]}
            receiveShadow
          >
            <sphereGeometry args={[15, 1000, 100]} />
            <meshPhongMaterial
              shininess={200}
              displacementMap={displacementTexture}
              displacementScale={3}
              displacementBias={2}
              map={texture}
            />
          </mesh>
          <Plane />
        </group>
      </EffectComposer>
      <OrbitControls />
      <mesh ref={sunRef} position={[0, 0, -10]}
      >
        <pointLight ref={sunRef} position={[10, 10, 10]} intensity={20} decay={.1} castShadow
          shadow-mapSize-width={5000}
          shadow-mapSize-height={5000}
        />
        <sphereGeometry args={[10, 32, 100]} />
        <meshStandardMaterial
          color={0xffff00}
          emissive={0xffffff}
          emissiveIntensity={1.5}
        />
      </mesh>
    </>
  );
}