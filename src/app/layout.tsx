import type { Metadata } from 'next';
import localFont from 'next/font/local';
import styles from './layout.module.css';
import './globals.css';
import { Scene } from './components/scene/scene';
import { DatePanel } from './components/panels/date-panel';
import FullLogo from '../../public/media/curves/logos/zr-full-color.svg';

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

const MainMenu = () => {
    return (
        <div className={styles.main_menu}>
            <div className={styles.logo_group}>
                <div className={`${styles.main_chip} ${styles.left_chip}`}>
                    <FullLogo width={120} />
                </div>
                <div className={`${styles.main_chip} ${styles.right_chip}`}>
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: 'red' }}>W.I.P.</div>
                </div>
            </div>
        </div>
    );
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
                    <Scene />
                    <div className={styles.side_panel}>
                      <div className={styles.menu_panel}>
                        <MainMenu />
                        <DatePanel />
                      </div>
                    </div>
                    {children}
                </div>
            </body>
        </html>
    );
}
