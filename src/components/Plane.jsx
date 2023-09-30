/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.13 public/assets/uploads_files_4140769_plane.glb --transform
Files: public/assets/uploads_files_4140769_plane.glb [1.77MB] > uploads_files_4140769_plane-transformed.glb [407.43KB] (77%)
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

export default function Plane(props) {
  const { nodes, materials } = useGLTF('/public/assets/uploads_files_4140769_plane-transformed.glb')
  const objectRef = useRef();

  const orbitRadius = 20;
  const speed = 1;
  const earthPosition = [0, 0, 0];

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    objectRef.current.position.y = earthPosition[1] + orbitRadius * Math.cos(elapsedTime * speed);
    objectRef.current.position.z = earthPosition[2] + orbitRadius * Math.sin(elapsedTime * speed);

    const angle = Math.atan2(
      objectRef.current.position.y - earthPosition[1],
      objectRef.current.position.z - earthPosition[2]
    );
    objectRef.current.rotation.x = -angle + Math.PI / 2;
  });

  return (
    <group dispose={null}
      scale={[0.2, 0.2, 0.2]}
      position={[0, 0, -4]}
      rotation={[Math.PI / 2, 0, 0]}
      ref={objectRef}
      castShadow
    >
      <mesh geometry={nodes.Air_Plane.geometry} material={materials.PaletteMaterial001} position={[0, -1.244, -0.187]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.46, 1.46, 1.392]} castShadow />
      <mesh geometry={nodes.Cylinder007.geometry} material={materials.PaletteMaterial002} position={[-0.027, -2.182, 6.773]} rotation={[-0.1, 0, -1.566]} scale={[0.243, 0.069, 0.243]} castShadow />
    </group>
  )
}

useGLTF.preload('/uploads_files_4140769_plane-transformed.glb')
