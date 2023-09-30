/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react/no-unknown-property */
import { useState, useEffect, useRef, useMemo } from 'react';
import { OrbitControls } from "@react-three/drei";
import { TextureLoader, Vector3, Group } from "three";
import { useLoader, useFrame, useThree } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { Matrix4, Quaternion } from 'three';
import * as THREE from 'three';
import { useGesture } from '@use-gesture/react';
import { useSpring, a } from '@react-spring/three';
import { useDrag } from 'react-use-gesture';
import Plane from './Plane';

function EarthInspector({ responsiveness = 20, children }) {
  const { size } = useThree();
  const euler = useMemo(() => new THREE.Euler(), []);
  const [spring, api] = useSpring(() => ({
    rotation: [0, 0, 0],
  }));

  const bind = useDrag(({ delta: [dx, dy] }) => {
    euler.y += (dx / size.width) * responsiveness;
    euler.x += (dy / size.width) * responsiveness;
    euler.x = THREE.MathUtils.clamp(euler.x, -Math.PI / 2, Math.PI / 2);
    api.start({ rotation: euler.toArray().slice(0, 3) });  // Updated line
  });

  return (
    <a.group {...bind()} {...spring}>
      {children}
    </a.group>
  );
}


export default function Experience(props) {
  const { camera } = useThree();

  useEffect(() => {
    // Set the camera's initial position
    camera.position.set(0, 0, 50);
    camera.lookAt(0, 0, 0);  // Make the camera look at the origin
  }, [camera]);

  const ref = useRef();
  const sunRef = useRef();
  const earthRef = useRef();

  const displacementTexture = useLoader(TextureLoader, '/assets/World_elevation_map.png');
  const texture = useLoader(TextureLoader, '/assets/earth.jpg');
  texture.anisotropy = 16;

  // rotate a sun around the earth
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime() * 1;
    sunRef.current.position.x = 300 * Math.cos(time);
    sunRef.current.position.z = 300 * Math.sin(time);
  });

  const [isUpArrowPressed, setIsUpArrowPressed] = useState(false);
  const [isDownArrowPressed, setIsDownArrowPressed] = useState(false);
  const [isLeftArrowPressed, setIsLeftArrowPressed] = useState(false);
  const [isRightArrowPressed, setIsRightArrowPressed] = useState(false);


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

  return (
    <>
      <ambientLight intensity={3} />
      <EarthInspector>
        <a.mesh ref={earthRef} position={[0, 0, 0]}
          {...props}
        >
          <sphereGeometry args={[15, 100, 100]} />
          <meshPhongMaterial
            shininess={200}
            displacementMap={displacementTexture}
            displacementScale={3}
            displacementBias={2}
            map={texture}
          />
        </a.mesh>
      </EarthInspector>
      <mesh ref={sunRef} position={[0, 0, -10]}>
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
      <Plane />
    </>
  );
}