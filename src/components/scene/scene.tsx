"use client";

import { GizmoHelper, GizmoViewport, OrbitControls, Html } from '@react-three/drei';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { DecadeTower } from '../meshes/year-dodecagon';
import styles from './scene.module.css';
import { useRef, useState, useEffect, RefObject, Suspense, useLayoutEffect } from 'react';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
// import { suspend } from 'suspend-react';

import { monthToRotation, useCameraStore, useCameraWriter, useDateStore, useUIStore } from '@/context/scene-store';
// import { ThreeDom } from '@react-three-dom/core';

export const HORIZON_ANGLE = Math.PI / 2
const MIN_POLAR_ANGLE = Math.PI / 4;
const MAX_POLAR_ANGLE = Math.PI * 3 / 4;
const INIT_CAM_POS = [0, 0, 24] as [number, number, number];
export const BACKGROUND_COLOR = new THREE.Color(0.9, 0.9, 0.9);

function LoadingOverlay() {
    return (
        <Html>
            <div className={styles.loading_overlay} />
        </Html>
    );
}

function LoadingBox() {
    return (
        <div className={styles.loading_overlay}>
            {/* <div className={styles.loading_box}>
                <p>Loading...</p>
            </div> */}
        </div>
    )
}

const centerSelectedMonth = (controlsRef: RefObject<OrbitControlsImpl | null>, selectedDate: Date) => {
    controlsRef.current?.setPolarAngle(HORIZON_ANGLE);
    const currentMonth = selectedDate?.getMonth() ?? 3
    const currentAngle = THREE.MathUtils.degToRad((currentMonth * 360) / 12);
    controlsRef.current?.setAzimuthalAngle(currentAngle)
}

function CameraDriver({ controlsRef, cameraSpotlight }: { controlsRef: RefObject<OrbitControlsImpl | null>; cameraSpotlight?: THREE.DirectionalLight }) {
    const { camera } = useThree()
    const cameraWriter = useCameraWriter
    const setRotation = useCameraWriter((state) => state.setRotation);
    const cameraTarget = useCameraStore((state) => state.cameraTarget);
    const selectedDate = useDateStore((state) => state.selectedDate)
    const selectedIsFocused = useDateStore((state) => state.selectedIsFocused)
    const setSelectedIsFocused = useDateStore((state) => state.setSelectedIsFocused)

    
    // init and listen for manual recentering
    useEffect(() => {
        centerSelectedMonth(controlsRef, selectedDate ?? new Date());
        setSelectedIsFocused(true)
    }, [selectedIsFocused])

    function centerMonth(
        date: Date,
        setter: (rotation: { x: number; y: number; z: number }) => void,
    ) {
        const monthRotation = monthToRotation(date.getMonth());
        setter({ x: 0, y: monthRotation, z: 0 });
    }

    useEffect(() => {
        if (!selectedDate) return;
        centerMonth(selectedDate, setRotation);
    }, [selectedDate]);

    useEffect(() => {
        const controls = controlsRef.current;
        if (!controls || !cameraTarget) return;
        controls.target.set(cameraTarget[0], cameraTarget[1], cameraTarget[2]);
        controls.update();
        controls.setPolarAngle(HORIZON_ANGLE);
        cameraSpotlight?.target.position.set(cameraTarget[0], cameraTarget[1], cameraTarget[2]);
    }, [cameraTarget, controlsRef]);

    const setCamera = useCameraStore((s) => s.setCamera)
    const setOrbitControls = useCameraStore((s) => s.setOrbitControls)

    // init
    useEffect(() => {
        if (!camera || !controlsRef.current) return;
        setCamera(camera)
        setOrbitControls(controlsRef.current)
    }, [camera, setCamera, controlsRef])

    useEffect(() => {
        const unsubscribe = cameraWriter.subscribe(
            (state) => state.rotation,
            (rotation) => {
                // console.log('CameraDriver received rotation update:', rotation);
                const controls = controlsRef.current;
                if (!controls) return;
                controls.setAzimuthalAngle(rotation.y);
                controls.update();
            })
        return () => unsubscribe();
    }, [cameraWriter, controlsRef])

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
    // const [targetHeight, setTargetHeight] = useState(2);
    // const cameraTarget = useCameraStore((state) => state.cameraTarget);
    const orbitControlsRef = useRef<OrbitControlsImpl>(null);

    const { sceneLoading, setSceneLoading } = useUIStore((state) => state);

    const { isSidePanelExpanded, isInterfaceVisible } = useUIStore();

    const className = `${styles.canvas_container} ${!isSidePanelExpanded ? styles.wide : ''}`;

    const cameraSpotlight = new THREE.DirectionalLight('white', 0.1);
    cameraSpotlight.position.set(0, 0, 1);
    cameraSpotlight.castShadow = false;

    const currentDecade = useDateStore((state) => state.currentDecade);

    function setCameraOffset(camera: THREE.PerspectiveCamera, xOffset: number, yOffset: number) {
        if (!camera) return;
        const { aspect } = camera
        camera.setViewOffset(
            aspect * 2, 2,
            xOffset * aspect, -yOffset,
            aspect * 2, 2
        )
        camera.updateProjectionMatrix()
    }

    // shift the whole scene to the right

    const setOffsetFromSidePanel = (camera: THREE.PerspectiveCamera) => {
        if (isSidePanelExpanded) {
            setCameraOffset(camera, -0.36, 0)
        } else {
            setCameraOffset(camera, -0.16, 0)
        }
    }

    useEffect(() => {
        setSceneLoading(true);
        const timer = setTimeout(() => setSceneLoading(false), 5000);
        return () => clearTimeout(timer);
    }, [currentDecade]);

    useEffect(() => {
        setOffsetFromSidePanel(orbitControlsRef.current?.object as THREE.PerspectiveCamera);
    }, [isSidePanelExpanded]);

    useEffect(() => {
        if (!isInterfaceVisible) {
            setCameraOffset(orbitControlsRef.current?.object as THREE.PerspectiveCamera, 0, 0)
        } else {
            setOffsetFromSidePanel(orbitControlsRef.current?.object as THREE.PerspectiveCamera);
        }
    }, [isInterfaceVisible]);


    const setupScene = ({
        camera,
        scene,
    }: {
        camera: THREE.Camera;
        scene: THREE.Scene;
    }) => {
        cameraSpotlight.position.set(...camera.position.toArray());
        // camera.add(cameraSpotlight);
        // scene.add(cameraSpotlight.target);
        scene.add(camera);
        // scene.fog = new THREE.FogExp2(BACKGROUND_COLOR, 0.04);
        // scene.fog = new THREE.Fog(BACKGROUND_COLOR, 26, 36);
        scene.background = new THREE.Color(BACKGROUND_COLOR);
        setOffsetFromSidePanel(camera as THREE.PerspectiveCamera);
        // setCameraOffset(camera as THREE.PerspectiveCamera, -0.36, 0)
    };

    return (
        <div className={className}>
            {sceneLoading && <LoadingBox />}
            <Canvas
                className={styles.canvas}
                camera={{ fov: 45, position: INIT_CAM_POS }}
                orthographic={isOrtho}
                onCreated={setupScene}
            >
                <Suspense fallback={<LoadingOverlay />}>
                    {/* <ThreeDom /> */}
                    <CameraSync />
                    <CameraDriver controlsRef={orbitControlsRef} cameraSpotlight={cameraSpotlight} />
                    {/* <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
                <GizmoViewport
                    axisColors={['red', 'green', 'blue']}
                    labelColor="black"
                />
            </GizmoHelper>
            <gridHelper args={[10, 10]} />
            <axesHelper args={[5]} /> */}
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
                        // target={cameraTarget}
                        maxDistance={24}
                        minDistance={6}
                        enablePan={false}
                        enableZoom={true}
                        maxZoom={0}
                        minZoom={0}
                        panSpeed={0.5}
                        screenSpacePanning={true}
                        enableDamping={true}
                    />
                    <DecadeTower decade={currentDecade} />
                    {/* <ArtificialDelay ms={2000} decade={currentDecade} /> */}
                </Suspense>
            </Canvas>
        </div>
    );
}
