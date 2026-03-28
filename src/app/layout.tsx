import type { Metadata } from 'next';
import localFont from 'next/font/local';
import styles from './layout.module.css';
import './globals.css';
import { Scene } from './components/scene/scene';
import { DatePanel } from './components/panels/date-panel';

// const geistSans = localFont({
//   src: "/media/fonts/serif/dm_serif.ttf",
//   variable: "--font-geist-sans",
// });

const geistMono = localFont({
    src: '../../public/media/fonts/mono/geist_mono.ttf',
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
                <div className={styles.page}>
                    <main className={styles.main}>
                        <DatePanel />
                        <Scene />
                        {children}
                    </main>
                </div>
            </body>
        </html>
    );
}
