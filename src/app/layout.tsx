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
import { ComponentType } from 'react';

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
            <div className={`${styles.main_nav_group}`}>
                <NavButton label='On this Day' Icon={ThisDay} />
                <NavButton label='Decade Dive' Icon={Dive} />
                <NavButton label='Heatmap' Icon={Heatmap} />
            </div>
        </div>
    );
};

const NavButton = ({ label, Icon }: { label: string; Icon?: ComponentType<{ width?: number, className?: string, fill?: string }> }) => {
    return (
    <button className={`${buttons.nav_button}`}>
        {Icon ? <Icon width={32} className={`${buttons.nav_button_icon}`} fill="currentColor" /> : null}
        <span className={`${buttons.nav_button_label}`}>{label}</span>
    </button>
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
