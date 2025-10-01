'use client';

import Image from 'next/image';
import styles from './page.module.css';
import { Canvas, useLoader } from '@react-three/fiber';
import { GizmoHelper, GizmoViewport, OrbitControls } from '@react-three/drei';
import { SVGLoader, GLTFLoader } from 'three/examples/jsm/Addons.js';
import * as THREE from 'three';
import dodecagonSvg from './curves/dodecagon.svg';
import monthGridSvg from './curves/month_grid.svg';
import { useState } from 'react';
// import dodecagonMesh from './meshes/dodecagon.glb';

function SVGCurve({
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
            <axesHelper args={[40]} />
        </group>
    );
}

function GLBMesh({
    url,
    position,
    rotation,
    scale,
}: {
    url: string;
    position?: [number, number, number];
    rotation?: [number, number, number];
    scale?: number | [number, number, number];
}) {
    const gltf = useLoader(GLTFLoader, url);

    return (
        <primitive
            object={gltf.scene.clone()}
            position={position}
            rotation={rotation}
            scale={scale}
        />
    );
}

function DodecagonSlice({ height = 0 }: { height?: number }) {
  const offset = 0.12;
    return (
        <>
            <GLBMesh
                key={`dodecagon-${height}`}
                url={'./media/meshes/dodecagon.glb'}
                position={[0, height, 0]}
                scale={0.5}
            />
            {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * 2 * Math.PI) / 12;
                const distance = 2.43;
                
                return (
                    <group 
                        key={i}
                        position={[0, height + offset, 0]}
                        rotation={[0, angle, 0]}
                    >
                        <group position={[distance, 0, 0]}>
                            <SVGCurve
                                url={monthGridSvg.src}
                                rotation={[0, Math.PI / 2, 0]}
                                position={[0, 0, 0.51]}
                                scale={1.8}
                                lineColor={'#888888'}
                            />
                        </group>
                        {/* <axesHelper args={[40]} /> */}
                    </group>
                );
            })}
        </>
    );
}

function YearGroup({ year = 0 }: { year?: number }) {
  const offset = 0.1 * year;
    return (
        <>
            <DodecagonSlice height={year + offset} />
        </>
    );
}

function DecadeGroup({ decade = 0 }: { decade?: number }) {
    return (
      <>
        {Array.from({ length: 12 }).map((_, i) => (
          <YearGroup key={i} year={i} />
        ))}
      </>
    );
}

export default function Home() {
    const [isOrtho, setIsOrtho] = useState(false);
    return (
        <div className={styles.page}>
            <main className={styles.main}>
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
                        intensity={0.5}
                        position={[0, 10, 5]}
                    />
                    <OrbitControls
                        maxPolarAngle={Math.PI / 2}
                        enablePan={false}
                        target={[0, 7, 0]}
                        maxDistance={22}
                        minDistance={5}
                    />
                    <DecadeGroup decade={0} />
                </Canvas>
            </main>
            <footer className={styles.footer}></footer>
        </div>
    );
}
