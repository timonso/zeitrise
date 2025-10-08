'use client';

import styles from './page.module.css';
import { CanvasProvider } from '@/context/canvas-context';
import React from 'react';
import { Scene } from './components/scene/scene';
import { DatePanel } from './components/panels/date-panel';

export default function Home() {
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <CanvasProvider>
                    <DatePanel />
                    <Scene />
                </CanvasProvider>
            </main>
            <footer className={styles.footer}></footer>
        </div>
    );
}
