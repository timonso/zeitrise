'use client';

import Image from 'next/image';
import styles from './page.module.css';
import { Canvas, useLoader } from '@react-three/fiber';
import {
    Environment,
    GizmoHelper,
    GizmoViewport,
    OrbitControls,
    useGLTF,
} from '@react-three/drei';
import { SVGLoader, GLTFLoader } from 'three/examples/jsm/Addons.js';
import * as THREE from 'three';
import dodecagonSvg from './curves/dodecagon.svg';
import monthGridSvg from './curves/month_grid.svg';
import { JSX, useState, useMemo, useContext } from 'react';
import { MeshStandardMaterial, Material } from 'three';
import { CanvasProvider, useCanvasContext } from '@/context/canvas-context';
import { DaySquare, DaySquareMesh } from './meshes/day-square';
import { YearDodecagonSlice } from './meshes/year-dodecagon';
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

function YearGroup({ year = 0 }: { year?: number }) {
    const offset = 0.1 * year;
    return (
        <>
            <YearDodecagonSlice height={year + offset} />
        </>
    );
}

function DecadeGroup({ decade = 0 }: { decade?: number }) {
    return (
        <>
            {Array.from({ length: 10 }).map((_, i) => (
                <YearGroup key={i} year={i} />
            ))}
        </>
    );
}

export default function Home() {
    const [isOrtho, setIsOrtho] = useState(false);
    const [targetHeight, setTargetHeight] = useState(7);

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <CanvasProvider>
                    <Canvas
                        className={styles.canvas}
                        camera={{ fov: 45, position: [0, 6, 10] }}
                        orthographic={isOrtho}
                    >
                        <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
                            <GizmoViewport
                                axisColors={['red', 'green', 'blue']}
                                labelColor="black"
                            />
                        </GizmoHelper>
                        <gridHelper args={[10, 10]} />
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
                        <DecadeGroup decade={0} />
                    </Canvas>
                </CanvasProvider>
            </main>
            <footer className={styles.footer}></footer>
        </div>
    );
}
