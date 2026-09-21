'use client';

import { AboutContent } from '@/components/content/about';
import { useNavigationStore } from '@/context/scene-store';
import React, { useEffect } from 'react';

export default function About() {
    const { setCurrentMode } = useNavigationStore();

    useEffect(() => {
        setCurrentMode('ABOUT');
    }, []);

    return (
        <>
            <AboutContent />
        </>
    );
}
