'use client';

import styles from './page.module.css';
import { Canvas, useLoader } from '@react-three/fiber';
import {
    GizmoHelper,
    GizmoViewport,
    OrbitControls,
    useGLTF,
} from '@react-three/drei';
import { SVGLoader } from 'three/examples/jsm/Addons.js';
import * as THREE from 'three';
import { useState, useMemo } from 'react';
import { Material } from 'three';
import { CanvasProvider } from '@/context/canvas-context';
import { YearDodecagonSlice, LowerDecadePlinth, UpperDecadePlinth, YearSeparatorMesh } from './components/meshes/year-dodecagon';
import React from 'react';
// import dodecagonMesh from './meshes/dodecagon.glb';

export function SVGCurve({
    url,
    position,
    rotation,
    lineColor = 'black',
    scale = 1,
}: {
    url: string;
    position?: [number, number, number];
    rotation?: [number, number, number];
    lineColor?: [number, number, number] | string;
    scale?: number;
}) {
    const data = useLoader(SVGLoader, url);
    const shapes = data.paths.flatMap((path) => SVGLoader.createShapes(path));

    return (
        <group scale={0.005 * scale} position={position} rotation={rotation}>
            {shapes.map((shape, index) => {
                const points: THREE.Vector3[] = [];
                shape.curves.forEach((curve) => {
                    const curvePoints = curve.getPoints(64);
                    curvePoints.forEach((point) => {
                        points.push(new THREE.Vector3(point.x, point.y, 0));
                    });
                });

                return (
                    <line key={index}>
                        <bufferGeometry>
                            <bufferAttribute
                                attach="attributes-position"
                                args={[
                                    new Float32Array(
                                        points.flatMap((p) => [p.x, p.y, p.z])
                                    ),
                                    3,
                                ]}
                            />
                        </bufferGeometry>
                        <lineBasicMaterial color={lineColor} />
                    </line>
                );
            })}
            {/* <axesHelper args={[40]} /> */}
        </group>
    );
}

function GLBMesh({
    url,
    position,
    rotation,
    scale,
    materialOverrides,
}: {
    url: string;
    position?: [number, number, number];
    rotation?: [number, number, number];
    scale?: number | [number, number, number];
    materialOverrides?: { [materialName: string]: Material };
}) {
    const { scene } = useGLTF(url);
    const clonedScene = useMemo(() => scene.clone(), [scene]);

    useMemo(() => {
        if (materialOverrides) {
            clonedScene.traverse((child: THREE.Object3D) => {
                if ((child as THREE.Mesh).isMesh) {
                    const mesh = child as THREE.Mesh;

                    if (Array.isArray(mesh.material)) {
                        // Handle multi-material meshes
                        mesh.material = mesh.material.map((mat) => {
                            return materialOverrides[mat.name] || mat;
                        });
                    } else {
                        // Handle single material meshes
                        const materialName = mesh.material.name;
                        if (materialName && materialOverrides[materialName]) {
                            mesh.material = materialOverrides[materialName];
                        }
                    }
                }
            });
        }
    }, [clonedScene, materialOverrides]);

    return (
        <primitive
            object={clonedScene}
            position={position}
            rotation={rotation}
            scale={scale}
        />
    );
}

function YearGroup({ year = 0, height = 0 }: { year?: number; height?: number }) {
    const offset = 0.35 * height;
    return (
        <>
            <YearDodecagonSlice height={height + offset} year={year} />
        </>
    );
}

function DecadeGroup({ decade = 1980 }: { decade?: number }) {
    return (
        <>
            <YearSeparatorMesh position={[0, 6, 0]} scale={[0.5, 30, 0.5]} />
            <LowerDecadePlinth />
            {Array.from({ length: 10 }).map((_, i) => {
                const year = decade + i;
                return <YearGroup key={i} height={i} year={year} />
})}
            <UpperDecadePlinth />
        </>
    );
}

export default function Home() {
    const [isOrtho, setIsOrtho] = useState(false);
    const [targetHeight, setTargetHeight] = useState(7);

    const cameraSpotlight = new THREE.DirectionalLight("white", 0.1);
    cameraSpotlight.position.set(0, 0, 1);
    cameraSpotlight.castShadow = false;

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <CanvasProvider>
                    <Canvas
                        className={styles.canvas}
                        camera={{ fov: 45, position: [10, 6, 0] }}
                        orthographic={isOrtho}
                        onCreated={({ camera, scene }: { camera: THREE.Camera, scene: THREE.Scene }) => {
                                // camera.add(cameraSpotlight);
                                scene.add(camera);
                                
                        }}
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
                            enablePan={false}
                            target={[0, targetHeight, 0]}
                            maxDistance={22}
                            minDistance={6}
                        />
                        <DecadeGroup decade={1980} />
                    </Canvas>
                </CanvasProvider>
            </main>
            <footer className={styles.footer}></footer>
        </div>
    );
}
