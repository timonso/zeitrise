import '../styles/globals.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import styles from './layout.module.css';
import buttons from '../styles/buttons.module.css';
import { Scene } from '../components/scene/scene';
import { DatePanel } from '../components/panels/date-panel';
import FullLogo from '../media/curves/logos/zr-full-color.svg';
import ThisDay from '../media/curves/symbols/this_day.svg';
import Dive from '../media/curves/symbols/dive.svg';
import Heatmap from '../media/curves/symbols/heatmap.svg';
import { ComponentType, Suspense } from 'react';
import { URLDateSync } from '@/components/utils/url-sync';
import { SidePanel } from '@/components/panels/side-panel';
import { NavigationPanel } from '@/components/panels/navigation-panel';

// const geistSans = localFont({
//   src: "/media/fonts/serif/dm_serif.ttf",
//   variable: "--font-geist-sans",
// });

const geistMono = localFont({
    src: '../../public/media/fonts/mono/geist_mono.ttf',
    // src: '../../public/media/fonts/mono/DMMono-Medium.ttf',
    variable: '--font-geist-mono',
});

export const metadata: Metadata = {
    title: 'ZeitRise',
    description: 'Decade',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${geistMono.variable}`}>
                <Suspense fallback={null}>
                    <URLDateSync />
                </Suspense>
                <div className={styles.page}>
                    <Scene />
                    <SidePanel />
                    <NavigationPanel />
                    {children}
                </div>
            </body>
        </html>
    );
}
