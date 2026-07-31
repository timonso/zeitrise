import * as THREE from 'three';
import React, { JSX, useMemo } from 'react';
import { useGLTF, Text } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { DaySquare } from './day-square';
import { SVGCurve } from '../utils/mesh';
import { RadialDistribution } from '../layout/distribution';
import { useDateStore } from '@/context/scene-store';
import { BACKGROUND_COLOR } from '../scene/scene';
// import monthGridSvg from './curves/month_grid.svg';

useGLTF.preload('./media/meshes/year_dodecagon.glb');
useGLTF.preload('./media/meshes/year_separator.glb');

const gridColors = {
    regular: '#494949',
    hovered: '#ffffff',
    selected: '#707070',
}

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
        color: '#8e8e8e',
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

const addFogToShader = (
    material: THREE.MeshStandardMaterial,
    fogNear: number = 8,
    fogFar: number = 20,
    center: number[] = [0, 7.0, 0],
    color: THREE.Color = BACKGROUND_COLOR.clone().convertLinearToSRGB(),
) => {
    material.onBeforeCompile = (shader) => {
        shader.uniforms.fogDensity = { value: 0.04 };
        shader.uniforms.fogOrigin = { value: new THREE.Vector3(...center) };
        shader.uniforms.fogColor = { value: color };
        shader.uniforms.fogRange = { value: new THREE.Vector2(fogNear, fogFar) };

        shader.vertexShader = shader.vertexShader.replace(
            '#include <fog_pars_vertex>',
            `
            #include <fog_pars_vertex>
            varying vec3 vWorldPos;
            `
        );

        shader.vertexShader = shader.vertexShader.replace(
            '#include <fog_vertex>',
            `
            #include <fog_vertex>
            vWorldPos = ( modelMatrix * vec4( transformed, 1.0 ) ).xyz;
            `
        );

        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <fog_pars_fragment>',
            `
            #include <fog_pars_fragment>
            varying vec3 vWorldPos;
            uniform vec3 fogOrigin;
            uniform vec3 fogColor;
            uniform float fogDensity;
            uniform vec2 fogRange;
            `
        );

        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <fog_fragment>',
            `
            
            float distToOrigin = distance( vWorldPos, fogOrigin );
            // float fogFactor = 1.0 - exp( - fogDensity * fogDensity * distToOrigin * distToOrigin );
            float fogFactor = smoothstep( fogRange.x, fogRange.y, distToOrigin );
            gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );

            // gl_FragColor.a = mix( gl_FragColor.a, fogColor.r, fogFactor );
            `
        );
    };

}

function DecadePlinthMesh(props: YearDodecagonMeshProps) {
    const { nodes } = useGLTF(
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

    addFogToShader(plinthMaterial);
    addFogToShader(bevelMaterial);

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

const generatePlinthSteps = (direction: number = -1,
    length: number = 30,
    start: number = -2.0,
    stepWidth: number = 0.1,
    stepHeight: number = 2.5) => Array.from({ length: length }).map((_, i) => (
        <PlinthStep key={i} scale={[1.0 + stepWidth + stepWidth * i, direction, 1.0 + stepWidth + stepWidth * i]} height={start + direction * stepHeight * i} />
    ));

const plinthSteps = generatePlinthSteps();

export function LowerDecadePlinth() {
    const elements = Object.keys(Month).map((month, index) => (
        <Text
            key={month}
            color="white"
            anchorX="center"
            anchorY="middle"
            font="./media/fonts/mono/geist_mono.ttf"
            // font="./media/fonts/mono/DMMono-Medium.ttf"
            fontSize={0.4}
            position={[3.25, 1.4, 0]}
            rotation={[0, Math.PI / 2, 0]}
        >
            {`${(index + 1).toString().padStart(2, '0')} • ${month}`}
        </Text>
    ));

    return (
        <group position={[0, -1.1, 0]} scale={0.5}>
            <DecadePlinthMesh />
            <RadialDistribution
                segments={12}
                radius={2.43}
                position={[0, 0, 0]}
                elements={elements}
            />
            {plinthSteps}
        </group>
    );
}

export function UpperDecadePlinth() {
    const { selectedDate } = useDateStore((state) => state);
    const elements = Object.keys(Month).map((month, index) => (
        <Text
            key={month}
            color="white"
            anchorX="center"
            anchorY="middle"
            font="./media/fonts/mono/geist_mono.ttf"
            // font="./media/fonts/mono/DMMono-Medium.ttf"
            fontSize={0.4}
            position={[3.25, 1.4, 0]}
            rotation={[Math.PI, Math.PI / 2, 0]}
        >
            {`${selectedDate?.getFullYear().toString().slice(0, -1)}"X`}
        </Text>
    )).reverse();
    return (
        <group position={[0, 14.5, 0]} rotation={[Math.PI, Math.PI, 0]} scale={0.5}>
            <DecadePlinthMesh />
            <RadialDistribution
                segments={12}
                radius={2.43}
                position={[0, 0, 0]}
                elements={elements}
            />
            {plinthSteps}
        </group>
    );
}

export function PlinthStep({ scale, height }: { scale: number[], height: number }) {
    return (
        <group position={[0, height, 0]} rotation={[Math.PI, Math.PI, 0]} scale={new THREE.Vector3(...scale)}>
            <DecadePlinthMesh />
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

    const monthElements: JSX.Element[] = [];
    Object.values(Month).forEach((month, i) => {
        monthElements.push(
            <MonthGroup key={month} year={year} month={i} />
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

function MonthGroup({ year, month }: { year: number, month: number }) {
    const dayElements: JSX.Element[][] = Array.from({ length: 12 }, () => []);
    const isSelectedd = useDateStore((state) => state.selectedDate?.getMonth() === month && state.selectedDate?.getFullYear() === year);

    const gridColor = useMemo(() => {
        if (isSelectedd) {
            return gridColors.selected;
        }
        return gridColors.regular;
    }, [isSelectedd]);

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

    return (
        <group position={[0, 0, 0.51]}>
            <SVGCurve
                url={'./media/curves/month_grid.svg'}
                rotation={[0, Math.PI / 2, 0]}
                position={[0, 0, 0]}
                scale={1.8}
                lineColor={gridColor}
            />
            {dayElements[month]}
        </group>
    )

}

function YearGroup({ year = 0, height = 0 }: { year?: number; height?: number }) {
    const offset = 0.35 * height;
    return (
        <YearDodecagonSlice height={height + offset} year={year} />
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
