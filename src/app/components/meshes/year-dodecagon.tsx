import * as THREE from 'three';
import React, { JSX, use, useMemo, useState } from 'react';
import { Html, useGLTF, Text } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { DaySquare } from './day-square';
import { SVGCurve } from '../../page';
import { RadialDistribution } from '../layout/distribution';
// import monthGridSvg from './curves/month_grid.svg';

useGLTF.preload('./media/meshes/year_dodecagon.glb');
useGLTF.preload('./media/meshes/year_separator.glb');

type DodecagonMesh = GLTF & {
    nodes: {
        decagon: THREE.Mesh;
    };
    materials: {
        dodecagon: THREE.MeshStandardMaterial;
    };
};

type SeparatorMesh = GLTF & {
    nodes: {
        separator: THREE.Mesh;
    };
    materials: {
        separator: THREE.MeshStandardMaterial;
    };
};

type PlinthMesh = GLTF & {
    nodes: {
        plinth: THREE.Mesh;
    };
    materials: {
        plinth: THREE.MeshStandardMaterial;
    };
};

type YearDodecagonMeshProps = JSX.IntrinsicElements['group'] & {
    // selected: boolean;
    // hovered: boolean;
};

function YearDodecagonMesh(props: YearDodecagonMeshProps) {
    const { nodes, materials } = useGLTF(
        './media/meshes/year_dodecagon.glb'
    ) as unknown as DodecagonMesh;

    const dodecagonMaterial = new THREE.MeshStandardMaterial({
        color: '#777777',
        roughness: 0.5,
        metalness: 0.3,
    });

    return (
        <group {...props} dispose={null}>
            <mesh
                geometry={nodes.decagon.geometry}
                material={dodecagonMaterial}
                position={[0, 1, 0]}
                rotation={[0, 0.262, 0]}
            />
        </group>
    );
}

function YearSeparatorMesh(props: JSX.IntrinsicElements['group']) {
    const { nodes, materials } = useGLTF(
        './media/meshes/year_separator.glb'
    ) as unknown as SeparatorMesh;

    const separatorMaterial = new THREE.MeshStandardMaterial({
        color: '#777777',
        roughness: 0.5,
        metalness: 0.3,
        side: THREE.DoubleSide,
    });

    return (
        <group {...props} dispose={null}>
            <mesh
                geometry={nodes.separator.geometry}
                material={separatorMaterial}
                position={[0, 0, 0]}
                rotation={[0, 0, 0]}
            />
        </group>
    );
}

function DecadePlinthMesh(props: YearDodecagonMeshProps) {
    const { nodes, materials } = useGLTF(
        './media/meshes/decade_plinth.glb'
    ) as unknown as PlinthMesh;

    const plinthMaterial = new THREE.MeshStandardMaterial({
        color: '#777777',
        roughness: 0.5,
        metalness: 0.3,
    });

    return (
        <group {...props} dispose={null}>
            <mesh
                geometry={nodes.plinth.geometry}
                material={plinthMaterial}
                position={[0, 1, 0]}
                rotation={[0, 0, 0]}
            />
        </group>
    );
}

enum Month {
    JAN = 'January',
    FEB = 'February',
    MAR = 'March',
    APR = 'April',
    MAY = 'May',
    JUN = 'June',
    JUL = 'July',
    AUG = 'August',
    SEP = 'September',
    OCT = 'October',
    NOV = 'November',
    DEC = 'December',
}

export function LowerDecadePlinth() {
    const elements = Object.keys(Month).map((month, index) => (
        <Text
            key={month}
            color="white"
            anchorX="center"
            anchorY="middle"
            font="./media/fonts/mono/DMMono-Medium.ttf"
            fontSize={0.4}
            position={[3.25, 1.4, 0]}
            rotation={[0, Math.PI / 2, 0]}
        >
            {`${(index + 1).toString().padStart(2, '0')} : ${month}`}
        </Text>
    ));

    return (
        <group position={[0, -1, 0]} scale={0.5}>
            <DecadePlinthMesh />
            <RadialDistribution
                segments={12}
                radius={2.43}
                position={[0, 0, 0]}
                elements={elements}
            />
        </group>
    );
}

export function UpperDecadePlinth() {
    return (
        <group position={[0, 12, 0]} rotation={[Math.PI, 0, 0]} scale={0.5}>
            <DecadePlinthMesh />
        </group>
    );
}

export function YearDodecagonSlice({ height = 0 }: { height?: number }) {
    const offset = 0.12;

    const dayElements: JSX.Element[] = [];
    for (let week = 0; week < 5; week++) {
        const lastWeekDays = week > 3 ? 3 : 7;
        for (let day = 0; day < lastWeekDays; day++) {
            const element = (
                <DaySquare
                    key={`day-${day}-week-${week}`}
                    day={day}
                    week={week}
                />
            );
            dayElements.push(element);
        }
    }

    const monthElements: JSX.Element[] = [];
    Object.values(Month).forEach((month, i) => {
        monthElements.push(
            <group position={[0, 0, 0.51]}>
                <SVGCurve
                    url={'./media/curves/month_grid.svg'}
                    rotation={[0, Math.PI / 2, 0]}
                    position={[0, 0, 0]}
                    scale={1.8}
                    lineColor={'#888888'}
                />
                {dayElements}
            </group>
        );
    });

    return (
        <>
            <YearDodecagonMesh position={[0, height, 0]} scale={0.5} />

            {height < 9 ? (
                <YearSeparatorMesh position={[0, height, 0]} scale={0.5} />
            ) : null}
            <RadialDistribution
                segments={12}
                radius={2.43}
                position={[0, height + offset, 0]}
                elements={monthElements}
            />
        </>
    );
}
