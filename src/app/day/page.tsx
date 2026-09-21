'use client';

import React, { useEffect } from 'react';
import { useNavigationStore } from '@/context/scene-store';

export default function Day() {
    const { setCurrentMode } = useNavigationStore();

    useEffect(() => {
        setCurrentMode('DAY');
    }, []);

    return (
        <>

        </>
    );
}
