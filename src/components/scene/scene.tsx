"use client";

import { GizmoHelper, GizmoViewport, OrbitControls, Html } from '@react-three/drei';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { DecadeGroup } from '../meshes/year-dodecagon';
import styles from './scene.module.css';
import { useRef, useState, useEffect, RefObject, Suspense } from 'react';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';

import { useCameraStore, useCameraWriter, useDateStore, useUIStore } from '@/context/scene-store';
// import { ThreeDom } from '@react-three-dom/core';

const HORIZON_ANGLE = Math.PI / 2
const MIN_POLAR_ANGLE = Math.PI / 4;
const MAX_POLAR_ANGLE = Math.PI - Math.PI / 4;
const INIT_CAM_POS = [0, 0, 24] as [number, number, number];

const centerSelectedMonth = (controlsRef: RefObject<OrbitControlsImpl | null>, selectedDate: Date) => {
    controlsRef.current?.setPolarAngle(HORIZON_ANGLE);
    const currentMonth = selectedDate?.getMonth() ?? 3
    const currentAngle = THREE.MathUtils.degToRad((currentMonth * 360) / 12);
    controlsRef.current?.setAzimuthalAngle(currentAngle)
}

function CameraDriver({ controlsRef }: { controlsRef: RefObject<OrbitControlsImpl | null> }) {
    const cameraDriver = useCameraWriter
    const selectedDate = useDateStore((state) => state.selectedDate)

    // init
    useEffect(() => {
        centerSelectedMonth(controlsRef, selectedDate ?? new Date());
    }, [])

    useEffect(() => {
        const unsubscribe = cameraDriver.subscribe(
            (state) => state.rotation,
            (rotation) => {
                // console.log('CameraDriver received rotation update:', rotation);
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

        setRotation({ x: 0, y: euler.y, z: 0 })
        // camera.position.x = INIT_CAM_POS[0];
        // camera.position.z = INIT_CAM_POS[2];
    })

    return null
}

export function Scene() {
    const [isOrtho, setIsOrtho] = useState(false);
    const [targetHeight, setTargetHeight] = useState(7);
    const orbitControlsRef = useRef<OrbitControlsImpl>(null);

    const isSidePanelExpanded = useUIStore((state) => state.isSidePanelExpanded);
    const className = `${styles.canvas} ${!isSidePanelExpanded ? styles.wide : ''}`;

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
        scene.fog = new THREE.Fog(0xcccccc, 22, 40);
    };

    return (
        <Canvas
            className={className}
            camera={{ fov: 45, position: INIT_CAM_POS }}
            orthographic={isOrtho}
            onCreated={setupScene}
        >
            {/* <ThreeDom /> */}
            <Suspense fallback={<Html center>Loading...</Html>}>
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
                    maxPolarAngle={MAX_POLAR_ANGLE}
                    minPolarAngle={MIN_POLAR_ANGLE}
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
            </Suspense>
        </Canvas>
    );
}
