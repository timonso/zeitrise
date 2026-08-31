import '../styles/globals.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import styles from './layout.module.css';
import { Scene } from '../components/scene/scene';
import { Suspense } from 'react';
import { URLDateSync } from '@/components/utils/url-sync';
import { SidePanel } from '@/components/panels/side-panel';
import { NavigationPanel } from '@/components/panels/navigation-panel';
import { INTERFACE_SCALE } from '@/styles/constants';

// const geistSans = localFont({
//   src: "/media/fonts/serif/dm_serif.ttf",
//   variable: "--font-geist-sans",
// });

const geistMono = localFont({
    src: '../../public/media/fonts/mono/geist_mono.ttf',
    // src: '../../public/media/fonts/mono/DMMono-Medium.ttf',
    variable: '--font-geist-mono',
});

const geistSans = localFont({
    src: '../../public/media/fonts/sans/geist_sans.ttf',
    variable: '--font-geist-sans'
})

const InterfaceScale = ({ scale }: { scale: number }) => (
    <style>{`
            :root {
                --interface-scale: ${scale};
            }
    `}</style>
)


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
            <body className={`${geistMono.variable} ${geistSans.variable}`}>
                <InterfaceScale scale={INTERFACE_SCALE} />
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
