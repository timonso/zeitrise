import React from "react";

export function RadialDistribution({
    segments = 12,
    radius = 1,
    position,
    elements,
}: {
    segments?: number;
    radius?: number;
    position: [number, number, number];
    elements: React.ReactNode[];
}) {
    return (
        <>
    {
        Array.from({ length: segments }).map((_, i) => {
            const angle = (i * 2 * Math.PI) / segments;
            const distance = radius;

            return (
                <group key={i} rotation={[0, angle, 0]} position={position}>
                    <group position={[distance, 0, 0]}>{elements[i]}</group>
                    {/* <axesHelper args={[40]} /> */}
                </group>
            );
        })
    }
        </>
    );
}