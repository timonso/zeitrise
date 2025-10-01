'use client';

import Image from "next/image";
import styles from "./page.module.css";
import { Canvas, useLoader } from "@react-three/fiber";
import { GizmoHelper, GizmoViewport, OrbitControls } from "@react-three/drei";
import { SVGLoader } from "three/examples/jsm/Addons.js";
import * as THREE from 'three';
import dodecagonSvg from "./curves/dodecagon.svg";

function SVGCurve({ url, position, rotation }: { url: string, position?: [number, number, number], rotation?: [number, number, number] }) {
  const data = useLoader(SVGLoader, url);
  const shapes = data.paths.flatMap((path) => SVGLoader.createShapes(path));
  
  return (
    <group scale={0.005} position={position} rotation={rotation}>
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
                count={points.length}
                array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="black" />
          </line>
        );
      })}
    </group>
  );
}

function DodecagonSlice({height = 0}: {height?: number}) {
  return (
    <SVGCurve url={dodecagonSvg.src} rotation={[-Math.PI / 2, 0, 0]} position={[0, height, 0]} />
  );
}

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Canvas className={styles.canvas}>
          <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
            <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor='black'/>
          </GizmoHelper>
          <gridHelper args={[10, 10]}/>
          <axesHelper args={[5]}/>
          <OrbitControls maxPolarAngle={Math.PI / 2} enablePan={false} />
          <DodecagonSlice height={0} />
          <DodecagonSlice height={1} />
          <DodecagonSlice height={2} />
          <DodecagonSlice height={3} />
        </Canvas>
      </main>
      <footer className={styles.footer}>
      </footer>
    </div>
  );
}
