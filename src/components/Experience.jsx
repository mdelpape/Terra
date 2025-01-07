/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react/no-unknown-property */
import { useState, useEffect, useRef, useMemo } from 'react';
import { OrbitControls, Stars, Clouds, Cloud } from "@react-three/drei";
import { TextureLoader, Vector3, Group } from "three";
import { useLoader, useFrame, useThree } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { Matrix4, Quaternion } from 'three';
import * as THREE from 'three';
import { useGesture } from '@use-gesture/react';
import { useSpring, a } from '@react-spring/three';
import { useDrag } from 'react-use-gesture';
import Plane from './Plane';
import Moon from './Moon';
// import Stars from './Stars';


function EarthInspector({ responsiveness = 20, children, orbitControlsRef }) {
  const { size } = useThree();
  const euler = useMemo(() => new THREE.Euler(), []);
  const [spring, api] = useSpring(() => ({
    rotation: [0, 0, 0],
  }));

  const bind = useDrag(({ delta: [dx, dy], down, first, last }) => {
    if (first) {
      if (orbitControlsRef.current) {
        orbitControlsRef.current.enabled = false;
      }
    }

    euler.y += (dx / size.width) * responsiveness;
    euler.x += (dy / size.width) * responsiveness;
    euler.x = THREE.MathUtils.clamp(euler.x, -Math.PI / 2, Math.PI / 2);
    api.start({ rotation: euler.toArray().slice(0, 3) });

    if (last) {
      if (orbitControlsRef.current) {
        orbitControlsRef.current.enabled = true;
      }
    }
  });


  return (
    <a.group {...bind()} {...spring}>
      {children}
    </a.group>
  );
}


export default function Experience(props) {
  const { camera } = useThree();
  const groupRef = useRef();
  const orbitControlsRef = useRef();

  const renderer = new THREE.WebGLRenderer();
  renderer.shadowMap.enabled = true;


  useEffect(() => {
    // Set the camera's initial position
    camera.position.set(0, 0, 75);
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
      groupRef.current.rotation.y += 0.01;
    }
    if (isRightArrowPressed) {
      groupRef.current.rotation.y -= 0.01;
    }
    if (isUpArrowPressed) {
      groupRef.current.rotation.x += 0.01;
    }
    if (isDownArrowPressed) {
      groupRef.current.rotation.x -= 0.01;
    }
  });

  return (
    <>
      <ambientLight intensity={3} />
      <EarthInspector orbitControlsRef={orbitControlsRef}>
        <group ref={groupRef}>
          <a.mesh ref={earthRef} position={[0, 0, 0]}
            {...props}
            receiveShadow
          >
            <sphereGeometry args={[15, 50, 100]} />
            <meshPhongMaterial
              shininess={200}
              displacementMap={displacementTexture}
              displacementScale={3}
              displacementBias={2}
              map={texture}
            />
          </a.mesh>
          <Plane />
        </group>
      </EarthInspector>
      <mesh ref={sunRef} position={[0, 0, -10]}>
        <pointLight ref={sunRef} intensity={20} decay={.1}

          castShadow
          shadow-mapSize-width={5000}
          shadow-mapSize-height={5000}
          shadow-camera-far={5000}

        />
        <sphereGeometry args={[10, 32, 100]} />
        <meshStandardMaterial
          color={0xffff00}
          emissive={0xffffff}
          emissiveIntensity={1.5}
        />
      </mesh>
      <Stars radius={100} depth={50} count={5000} factor={15} saturation={0} fade speed={0} />
      <Moon />
    </>
  );
}