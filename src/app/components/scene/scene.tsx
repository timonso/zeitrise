import { GizmoHelper, GizmoViewport, OrbitControls } from '@react-three/drei';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { DecadeGroup } from '../meshes/year-dodecagon';
import styles from '../../page.module.css';
import { useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { useCanvasContext } from '@/context/canvas-context';
import debounce from 'lodash.debounce';

import { useCameraStore } from '@/context/scene-store';

function CameraSync() {
  const { camera } = useThree()
  const setRotation = useCameraStore((s) => s.setRotation)

  useFrame(() => {
    // const { x, y, z } = camera.rotation

    const euler = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ');
    const yRotation = euler.y;

    setRotation({ x:0, y:euler.y, z:0 })
  })

  return null
}


export function Scene() {
    const [isOrtho, setIsOrtho] = useState(false);
    const [targetHeight, setTargetHeight] = useState(7);
    const [cameraRotation, setCameraRotation] = useState([0,0,0]);
    const rotationRef = useRef<[number, number, number]>([0, 0, 0]);
 
    const cameraSpotlight = new THREE.DirectionalLight('white', 0.1);
    cameraSpotlight.position.set(0, 0, 1);
    cameraSpotlight.castShadow = false;

    const { currentDecade, setCurrentDecade, currentRotation, setCurrentRotation } = useCanvasContext(); 
    const debouncedSetCameraRotation = useMemo(() => debounce((rotation: [number, number, number]) => {
        // setCameraRotation(rotation)
        setCurrentRotation(rotation);
    }, 500), [setCurrentRotation]);


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
        <main className={styles.main}>
        <Canvas
            className={styles.canvas}
            camera={{ fov: 45, position: [24, 6, 0] }}
            orthographic={isOrtho}
            onCreated={setupScene}
        >
            <CameraSync />
            <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
                <GizmoViewport
                    axisColors={['red', 'green', 'blue']}
                    labelColor="black"
                />
            </GizmoHelper>
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
                onChange={(e) => {
                    if (!e?.target) return;
                    const { x, y, z } = e.target.object.rotation;
                    console.log('Camera rotation:', { x, y, z });
                    // rotationRef.current = [x, y, z];
                    // setCurrentRotation([x, y, z]);
                    // debouncedSetCameraRotation([x, y, z]);
                    }
                }
            />
            <DecadeGroup decade={currentDecade} />
        </Canvas>
        </main>
    );
}
