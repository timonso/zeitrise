"use client";

import * as THREE from 'three';
import React, { JSX, useEffect, useMemo, useRef, useState } from 'react';
import { useGLTF, Text } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import { GLTF } from 'three-stdlib';
import { useDateStore } from '@/context/scene-store';
// import { centerMonth } from '../panels/date-panel';

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
    future?: boolean;
    children?: React.ReactNode | React.ReactNode[];
};

const COLORS = {
        outer: {
            regular: '#00ffdd',
            selected: '#eefffc',
            hovered: '#eefffc',
            future: '#a0a0a0',
        },
        inner: {
            regular: '#00d0b4',
            selected: '#00d0b4',
            hovered: '#00d0b4',
            future: '#7f7f7f',
        },
    };

export function DaySquareMesh(props: DaySquareMeshProps) {
    const { nodes } = useGLTF(
        './media/meshes/day_square.glb',
    ) as unknown as SquareMesh;

    const outerColor = useMemo(() => {
        if (props.future) return COLORS.outer.future;
        if (props.selected) return COLORS.outer.selected;
        if (props.hovered) return COLORS.outer.hovered;
        return COLORS.outer.regular;
    }, [props.selected, props.hovered, props.future]);

    const innerColor = useMemo(() => {
        if (props.future) return COLORS.inner.future;
        if (props.selected) return COLORS.inner.selected;
        if (props.hovered) return COLORS.inner.hovered;
        return COLORS.inner.regular;
    }, [props.selected, props.hovered, props.future]);

    const outerMaterial = useMemo(
        () => new THREE.MeshStandardMaterial({
        color: outerColor,
        roughness: 0.5,
        metalness: 0.0,
    }), [outerColor]);

    const innerMaterial = useMemo(() => {
        return new THREE.MeshStandardMaterial({
            color: innerColor,
            roughness: 0.2,
            metalness: 0.0,
        });
    }, [innerColor]);

    useEffect(() => {
        return () => {
            outerMaterial.dispose();
            innerMaterial.dispose();
        };
    }, [outerMaterial, innerMaterial]);

    return (
        <group {...props} dispose={null}>
            <group scale={[0.117, 0.117, 0.04]}>
                <mesh geometry={nodes.Cube.geometry} material={outerMaterial}/>
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

export function DaySquare({ date }: { date: Date }) {
    // const [isSelected, setIsSelected] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const meshGroupRef = useRef<THREE.Group>(null);
    const dateKey = useMemo(
        () => new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime(),
        [date],
    );
    const isSelected = useDateStore((state) => state.selectedDateKey === dateKey);
    const setSelectedDate = useDateStore((state) => state.setSelectedDate);
    const setHoveredDate = useDateStore((state) => state.setHoveredDate);
    const ignoreRaycast: THREE.Object3D['raycast'] = () => {
        // Keep hover handling on the tile mesh instead of the overlay text mesh.
    };

    const dayOffset = [0.105, 0.105];
    const day = date.getDay();
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstDayWeekday = firstDayOfMonth.getDay();
    const week = Math.floor((date.getDate() - 1 + firstDayWeekday) / 7);
    const padding = [day * 0.036, week * 0.036];

    const meshDepth = useMemo(() => {
        if (isSelected) return 0.4;
        if (isHovered) return 0.3;
        return 0.15;
    }, [isSelected, isHovered]);

    const facesCamera = (e: ThreeEvent<MouseEvent | PointerEvent>) => {
        const group = meshGroupRef.current;
        if (!group) return false;

        const worldPosition = new THREE.Vector3();
        const worldQuaternion = new THREE.Quaternion();

        group.getWorldPosition(worldPosition);
        group.getWorldQuaternion(worldQuaternion);

        const groupPositiveXAxis = new THREE.Vector3(1, 0, 0)
            .applyQuaternion(worldQuaternion)
            .normalize();

        const toCamera = e.camera.position.clone().sub(worldPosition).normalize();
        return groupPositiveXAxis.dot(toCamera) > 0;
    };

    const handlePointerEnter = (e: ThreeEvent<PointerEvent>) => {
        if (!facesCamera(e)) return;
        e.stopPropagation();
        setIsHovered(true);
        setHoveredDate(date);
    };

    const handlePointerLeave = (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setIsHovered(false);
        setHoveredDate(null);
    };

    const handleClick = (e: ThreeEvent<MouseEvent>) => {
        if (!facesCamera(e)) return;
        e.stopPropagation();
        if (isSelected) {
            return;
        }
        setSelectedDate(date);
        // centerMonth(date, setRotation);
        // console.log(date);
    };

    return (
        <group
            ref={meshGroupRef}
            key={`day:${day}.week:${week}`}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
            onClick={handleClick}
            position={[0, dayOffset[1], -dayOffset[0]]}
        >
            {/* <axesHelper args={[0.2]} /> */}
            <DaySquareMesh
                position={[0, week * 0.1 + padding[1], -day * 0.1 - padding[0]]}
                rotation={[0, Math.PI / 2, 0]}
                scale={[0.47, 0.47, meshDepth]}
                selected={isSelected}
                hovered={isHovered}
                future={date > new Date()}
            >
                {(isHovered || isSelected) && (
                    <Text
                        raycast={ignoreRaycast}
                        color="white"
                        anchorX="center"
                        anchorY="middle"
                        font="./media/fonts/mono/DMMono-Regular.ttf"
                        fontSize={0.8}
                        position={[0, 0, 1]}
                    >
                        {date.getDate().toString().padStart(2, '0')}
                    </Text>
                )}
            </DaySquareMesh>
        </group>
    );
}
