import { GizmoHelper, GizmoViewport, OrbitControls } from '@react-three/drei';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { DecadeGroup } from '../meshes/year-dodecagon';
import styles from '../../page.module.css';
import { useRef, useState, useEffect, RefObject } from 'react';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';

import { useCameraStore, useCameraWriter, useDateStore } from '@/context/scene-store';
import { ThreeDom } from '@react-three-dom/core';

function CameraDriver({ controlsRef }: { controlsRef: RefObject<OrbitControlsImpl | null> }) {
    const cameraDriver = useCameraWriter

    useEffect(() => {
        const unsubscribe = cameraDriver.subscribe(
            (state) => state.rotation,
            (rotation) => {
                console.log('CameraDriver received rotation update:', rotation);
                const controls = controlsRef.current;
                if (!controls) return;
                controls.setAzimuthalAngle(rotation.y);
                controls.update();
            })
            return () => unsubscribe();
    }, [cameraDriver, controlsRef])
    
    return null;
}

function CameraSync() {
  const { camera } = useThree()
  const setRotation = useCameraStore((s) => s.setRotation)

  useFrame(() => {
    // const { x, y, z } = camera.rotation

    const euler = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ');

    setRotation({ x:0, y:euler.y, z:0 })
  })

  return null
}


export function Scene() {
    const [isOrtho, setIsOrtho] = useState(false);
    const [targetHeight, setTargetHeight] = useState(7);
    const orbitControlsRef = useRef<OrbitControlsImpl>(null);
 
    const cameraSpotlight = new THREE.DirectionalLight('white', 0.1);
    cameraSpotlight.position.set(0, 0, 1);
    cameraSpotlight.castShadow = false;

    const currentDecade = useDateStore((state) => state.currentDecade);


    const setupScene = ({
        camera,
        scene,
    }: {
        camera: THREE.Camera;
        scene: THREE.Scene;
    }) => {
        // camera.add(cameraSpotlight);
        scene.add(camera);
        scene.fog = new THREE.Fog( 0xcccccc, 25, 40 );
    };

    return (
        <Canvas
            className={styles.canvas}
            camera={{ fov: 45, position: [0, 0, 24] }}
            orthographic={isOrtho}
            onCreated={setupScene}
        >
            <ThreeDom />
            <CameraSync />
            <CameraDriver controlsRef={orbitControlsRef} />
            {/* <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
                <GizmoViewport
                    axisColors={['red', 'green', 'blue']}
                    labelColor="black"
                />
            </GizmoHelper> */}
            {/* <gridHelper args={[10, 10]} /> */}
            {/* <axesHelper args={[5]} /> */}
            <ambientLight color="white" intensity={0.5} />
            <directionalLight
                color="white"
                intensity={0.7}
                position={[0, 10, 0]}
            />
            <directionalLight
                color="white"
                intensity={0.7}
                position={[0, -10, 0]}
            />
            <OrbitControls
                ref={orbitControlsRef}
                maxPolarAngle={Math.PI / 2}
                target={[0, targetHeight, 0]}
                maxDistance={22}
                minDistance={6}
                enablePan={false}
                enableZoom={true}
                maxZoom={0}
                minZoom={0}
                panSpeed={0.5}
                screenSpacePanning={true}
                enableDamping={true}
            />
            <DecadeGroup decade={currentDecade} />
        </Canvas>
    );
}
