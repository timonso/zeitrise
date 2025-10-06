import * as THREE from 'three';
import React, { JSX, use, useMemo, useState } from 'react';
import { useGLTF, Text } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { useCanvasContext } from '@/context/canvas-context';

type SquareMesh = GLTF & {
    nodes: {
        Cube: THREE.Mesh;
        Cube_1: THREE.Mesh;
    };
    materials: {
        outer: THREE.MeshStandardMaterial;
        inner: THREE.MeshStandardMaterial;
    };
};

type DaySquareMeshProps = JSX.IntrinsicElements['group'] & {
    selected: boolean;
    hovered: boolean;
    children?: React.ReactNode | React.ReactNode[];
};

export function DaySquareMesh(props: DaySquareMeshProps) {
    const { nodes, materials } = useGLTF(
        './media/meshes/day_square.glb'
    ) as unknown as SquareMesh;

    const colors = {
        outer: {
            regular: '#00ffdd',
            selected: '#eefffc',
            hovered: '#eefffc',
        },
        inner: {
            regular: '#00d0b4',
            selected: '#00d0b4',
            hovered: '#00d0b4',
        },
    };

    const outerColor = useMemo(() => {
        if (props.selected) return colors.outer.selected;
        if (props.hovered) return colors.outer.hovered;
        return colors.outer.regular;
    }, [colors.outer, props.selected, props.hovered]);

    const innerColor = useMemo(() => {
        if (props.selected) return colors.inner.selected;
        if (props.hovered) return colors.inner.hovered;
        return colors.inner.regular;
    }, [colors.inner, props.selected, props.hovered]);

    const outerMaterial = new THREE.MeshStandardMaterial({
        color: outerColor,
        roughness: 0.5,
        metalness: 0.0,
    });

    const innerMaterial = new THREE.MeshStandardMaterial({
        color: innerColor,
        roughness: 0.2,
        metalness: 0.0,
    });

    return (
        <group {...props} dispose={null}>
            <group scale={[0.117, 0.117, 0.04]}>
                <mesh geometry={nodes.Cube.geometry} material={outerMaterial} />
                <mesh
                    geometry={nodes.Cube_1.geometry}
                    material={innerMaterial}
                />
                {props.children}
            </group>
        </group>
    );
}

useGLTF.preload('./media/meshes/day_square.glb');

export function DaySquare({ day, week }: { day: number; week: number }) {
    const [isSelected, setIsSelected] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const { dayHovered, setDayHovered } = useCanvasContext();

    const dayOffset = [0.105, 0.105];
    const dayOfYear = week * 7 + day;
    const padding = [day * 0.036, week * 0.036];

    const meshDepth = useMemo(() => {
        if (isSelected) return 0.4;
        if (isHovered) return 0.3;
        return 0.15;
    }, [isSelected, isHovered]);

    return (
        <group
            key={`day-${dayOfYear}`}
            onPointerEnter={() => {
                // if (dayHovered) return;
                // setDayHovered(true);
                setIsHovered(true);
            }}
            onPointerLeave={() => {
                // setDayHovered(false);
                setIsHovered(false);
            }}
            onClick={() => setIsSelected(!isSelected)}
            position={[0, dayOffset[1], -dayOffset[0]]}
        >
            <DaySquareMesh
                position={[0, week * 0.1 + padding[1], -day * 0.1 - padding[0]]}
                rotation={[0, Math.PI / 2, 0]}
                scale={[0.47, 0.47, meshDepth]}
                selected={isSelected}
                hovered={isHovered}
            >
                {isHovered && (
                    <Text
                        color="white"
                        anchorX="center"
                        anchorY="middle"
                        font="./media/fonts/mono/DMMono-Regular.ttf"
                        fontSize={0.8}
                        position={[0, 0, 1]}
                        // rotation={[0, Math.PI / 2, 0]}
                    >
                        {(day + 1).toString().padStart(2, '0')}
                    </Text>
                )}
            </DaySquareMesh>
        </group>
    );
}
