import * as THREE from 'three';
import React, { JSX, useMemo } from 'react';
import { useGLTF, Text } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { DaySquare } from './day-square';
import { SVGCurve } from '../utils/mesh';
import { RadialDistribution } from '../layout/distribution';
// import monthGridSvg from './curves/month_grid.svg';

useGLTF.preload('./media/meshes/year_dodecagon.glb');
useGLTF.preload('./media/meshes/year_separator.glb');

type DodecagonMesh = GLTF & {
    nodes: {
        dodecagon_1: THREE.Mesh;
        dodecagon_2: THREE.Mesh;
    };
    materials: {
        dodecagon: THREE.MeshStandardMaterial;
        bevel: THREE.MeshStandardMaterial;
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
        plinth_1: THREE.Mesh;
        plinth_2: THREE.Mesh;
    };
    materials: {
        plinth: THREE.MeshStandardMaterial;
        bevel: THREE.MeshStandardMaterial;
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

    const bevelMaterial = new THREE.MeshStandardMaterial({
        color: '#888888',
        roughness: 0.5,
        metalness: 0.3,
    });

    return (
        <group {...props} dispose={null}>
            <mesh
                geometry={nodes.dodecagon_1.geometry}
                material={dodecagonMaterial}
                position={[0, 0, 0]}
                rotation={[0, 0, 0]}
                
            />
            <mesh
                geometry={nodes.dodecagon_2.geometry}
                material={bevelMaterial}
                position={[0, 0, 0]}
                rotation={[0, 0, 0]}
            />
        </group>
    );
}

export function YearSeparatorMesh(props: JSX.IntrinsicElements['group']) {
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

    const bevelMaterial = new THREE.MeshStandardMaterial({
        color: '#888888',
        roughness: 0.5,
        metalness: 0.3,
    });

    return (
        <group {...props} dispose={null}>
            <mesh
                geometry={nodes.plinth_1.geometry}
                material={plinthMaterial}
                position={[0, 1, 0]}
                rotation={[0, 0, 0]}
            />
            <mesh
                geometry={nodes.plinth_2.geometry}
                material={bevelMaterial}
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
            {`${(index + 1).toString().padStart(2, '0')} \' ${month}`}
        </Text>
    ));

    return (
        <group position={[0, -1, 0]} scale={0.5}>
            <DecadePlinthMesh />
            {/* <YearSeparatorMesh position={[0, -25, 0]} scale={[1, 10, 1]} /> */}
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
        <group position={[0, 14.4, 0]} rotation={[Math.PI, 0, 0]} scale={0.5}>
            <DecadePlinthMesh />
            {/* <YearSeparatorMesh position={[0, -25, 0]} scale={[1, 10, 1]} /> */}
        </group>
    );
}

export function YearDodecagonSlice({
    height = 0,
    year = 1984,
}: {
    height?: number;
    year?: number;
}) {
    const offset = 0.19;

    const dayElements: JSX.Element[][] = Array.from({ length: 12 }, () => []);

    const dates = useMemo(() => {
        const dates: Date[] = [];
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year + 1, 0, 1);
        for (
            let d = new Date(startDate);
            d < endDate;
            d.setDate(d.getDate() + 1)
        ) {
            dates.push(new Date(d));
        }
        // console.log(dates);
        return dates;
    }, [year]);


    Object.values(dates).forEach((date) => {
        const element = (
            <DaySquare
                key={`day:${date.getDate()}.month:${date.getMonth()}`}
                date={date}
            />
        );
        dayElements[date.getMonth()].push(element);
    });

    // console.log(dayElements);

    const monthElements: JSX.Element[] = [];
    Object.values(Month).forEach((month, i) => {
        monthElements.push(
            <group position={[0, 0, 0.51]}>
                <SVGCurve
                    url={'./media/curves/month_grid.svg'}
                    rotation={[0, Math.PI / 2, 0]}
                    position={[0, 0, 0]}
                    scale={1.8}
                    lineColor={'#494949'}
                />
                {dayElements[i]}
            </group>
        );
    });

    return (
        <>
            <YearDodecagonMesh position={[0, height, 0]} scale={0.5} />
            <RadialDistribution
                segments={12}
                radius={2.43}
                position={[0, height + offset, 0]}
                elements={monthElements}
            />
        </>
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

export function DecadeGroup({ decade = 1980 }: { decade?: number }) {
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
