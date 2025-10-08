import { useGLTF } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { useMemo } from 'react';
import { Material } from 'three';
import { SVGLoader } from 'three/examples/jsm/Addons.js';
import * as THREE from 'three';

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
                        mesh.material = mesh.material.map((mat) => {
                            return materialOverrides[mat.name] || mat;
                        });
                    } else {
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
