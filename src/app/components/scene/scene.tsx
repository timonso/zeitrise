import { GizmoHelper, GizmoViewport, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { DecadeGroup } from '../meshes/year-dodecagon';
import styles from '../../page.module.css';
import { useState } from 'react';
import * as THREE from 'three';
import { useCanvasContext } from '@/context/canvas-context';

export function Scene() {
    const [isOrtho, setIsOrtho] = useState(false);
    const [targetHeight, setTargetHeight] = useState(7);

    const cameraSpotlight = new THREE.DirectionalLight('white', 0.1);
    cameraSpotlight.position.set(0, 0, 1);
    cameraSpotlight.castShadow = false;

    const { currentDecade, setCurrentDecade } = useCanvasContext();

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
            camera={{ fov: 45, position: [24, 6, 0] }}
            orthographic={isOrtho}
            onCreated={setupScene}
        >
            <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
                <GizmoViewport
                    axisColors={['red', 'green', 'blue']}
                    labelColor="black"
                />
            </GizmoHelper>
            {/* <gridHelper args={[10, 10]} /> */}
            <axesHelper args={[5]} />
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
                maxPolarAngle={Math.PI / 2}
                target={[0, targetHeight, 0]}
                maxDistance={22}
                minDistance={6}
                // enablePan={true}
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
