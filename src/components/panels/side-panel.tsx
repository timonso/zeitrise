"use client";

import { ComponentType, useState } from 'react';
import styles from './side-panel.module.css';
import buttons from '@/styles/buttons.module.css';
import { DatePanel } from './date-panel';

import FullLogo from '@/media/curves/logos/zr-full-color.svg';
import ThisDay from '@/media/curves/symbols/this_day.svg';
import Dive from '@/media/curves/symbols/dive.svg';
import Heatmap from '@/media/curves/symbols/heatmap.svg';
import Collapse from '@/media/curves/symbols/collapse.svg';
import Expand from '@/media/curves/symbols/expand.svg';
import { useUIStore } from '@/context/scene-store';
import { scaled } from '@/styles/constants';

const NavButton = ({ label, Icon }: { label: string; Icon?: ComponentType<{ width?: number, className?: string, fill?: string }> }) => {
    return (
        <button className={`${buttons.nav_button}`}>
            {Icon ? <Icon width={scaled(32)} className={`${buttons.nav_button_icon}`} fill="currentColor" /> : null}
            <span className={`${buttons.nav_button_label}`}>{label}</span>
        </button>
    );
};

const MainMenu = () => {
    const { isSidePanelExpanded, setIsSidePanelExpanded } = useUIStore();

    const toggleSidepanel = () => {
        setIsSidePanelExpanded(!isSidePanelExpanded);
    };

    return (
        <div className={styles.main_menu}>
            <div className={styles.logo_group}>
                <div className={`${styles.main_chip} ${styles.left_chip}`}>
                    <FullLogo width={scaled(120)} />
                </div>
                <div className={`${styles.main_chip} ${styles.right_chip}`} onClick={toggleSidepanel}>
                    {isSidePanelExpanded ? <Collapse width={scaled(32)} /> : <Expand width={scaled(32)} />}
                    {/* <div style={{ fontSize: 24, fontWeight: 'bold', color: 'red' }}>
                        W.I.P.
                    </div> */}
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

export const SidePanel = () => {
    const { isSidePanelExpanded, setIsSidePanelExpanded } = useUIStore();

    return (
        <div className={styles.side_panel}>
            <div className={styles.menu_panel}>
                <MainMenu />
                <DatePanel />
            </div>
            {isSidePanelExpanded && (
                <div className={styles.content_panel}>
                    {/* content */}
                </div>
            )}
        </div>
    )
}