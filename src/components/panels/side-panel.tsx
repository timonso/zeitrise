"use client";

import { ComponentType } from 'react';
import styles from './side-panel.module.css';
import buttons from '@/styles/buttons.module.css';
import { DatePanel } from './date-panel';
import Link from 'next/link'

import IconLogo from '@/media/curves/logos/zr-icon-color.svg';
import WordmarkLogo from '@/media/curves/logos/zr-wordmark-color.svg';
import Explore from '@/media/curves/symbols/explore.svg';
import ThisDay from '@/media/curves/symbols/this_day.svg';
import Dive from '@/media/curves/symbols/dive.svg';
import Heatmap from '@/media/curves/symbols/heatmap.svg';
import Collapse from '@/media/curves/symbols/collapse.svg';
import Expand from '@/media/curves/symbols/expand.svg';
import { NavigationMode, useNavigationStore, useUIStore } from '@/context/scene-store';
import { scaled } from '@/styles/constants';

const NavButton = ({ label, mode, Icon, disabled }: { label: string; mode: NavigationMode; disabled?: boolean; Icon?: ComponentType<{ width?: number, className?: string, fill?: string }> }) => {
    const { currentMode } = useNavigationStore();
    const { setIsSidePanelExpanded } = useUIStore();
    const className = `${buttons.nav_button} ${buttons.clickable} ${currentMode === mode ? buttons.focused : ''} ${disabled ? buttons.disabled : ''}`;

    return (
        <Link href={`/${mode.toLowerCase()}`}>
            <button className={className} onClick={() => setIsSidePanelExpanded(true)} disabled={disabled}>
                {Icon ? <Icon width={scaled(32)} className={`${buttons.nav_button_icon}`} fill="currentColor" /> : null}
                <span className={`${buttons.nav_button_label}`}>{label}</span>
            </button>
        </Link>
    );
};

const MinorMenuButton = ({ label, mode, onClick, disabled }: { label: string; mode?: NavigationMode; onClick?: () => void; disabled?: boolean }) => {
    const { currentMode } = useNavigationStore();
    const { setIsSidePanelExpanded } = useUIStore();
    const className = `${buttons.minor_menu_button} ${buttons.clickable} ${currentMode === mode ? buttons.focused : ''} ${disabled ? buttons.disabled : ''}`;

    return (
        <Link href={`/${mode?.toLowerCase()}`}>
        <button className={className} onClick={() => setIsSidePanelExpanded(true)} disabled={disabled}>
            <span className={`${buttons.minor_menu_button_label}`}>{label}</span>
        </button>
        </Link>
    );
}

const LogoChip = () => {
    const { isInterfaceVisible, setIsInterfaceVisible } = useUIStore();
    const wrapperClassName = `${!isInterfaceVisible ? styles.logo_chip_wrapper : ''}`;
    const className = `${styles.main_chip} ${styles.logo_chip} ${isInterfaceVisible ? styles.left_chip : ''}`;

    return (
        <div className={wrapperClassName}>
            <div className={className} onClick={() => setIsInterfaceVisible(!isInterfaceVisible)}>
                {/* <FullLogo width={scaled(120)} /> */}
                <IconLogo width={scaled(54)} />
                {isInterfaceVisible && <WordmarkLogo width={scaled(64)} />}
            </div>
        </div>
    )
}

const MainMenu = () => {
    const { isSidePanelExpanded, setIsSidePanelExpanded } = useUIStore();

    const toggleSidepanel = () => {
        setIsSidePanelExpanded(!isSidePanelExpanded);
    };

    return (
        <div className={styles.main_menu}>
            <div className={styles.logo_group}>
                <LogoChip />
                <div className={`${styles.main_chip} ${styles.right_chip}`} onClick={toggleSidepanel}>
                    {isSidePanelExpanded ? <Collapse width={scaled(32)} /> : <Expand width={scaled(32)} />}
                </div>
            </div>
            <div className={`${styles.main_nav_group} scroll_y fade_y`}>
                <NavButton mode='EXPLORE' label='Explore' Icon={Explore} disabled/>
                <NavButton mode='DAY' label='On this Day' Icon={ThisDay} />
                <NavButton mode='DIVE' label='Decade Dive' Icon={Dive} disabled />
                <NavButton mode='MAP' label='Heatmap' Icon={Heatmap} disabled />
            </div>
            <div className={`${styles.secondary_nav_group}`}>
                <MinorMenuButton label='About' mode='ABOUT' />
                <MinorMenuButton label='Blog' disabled />
                <MinorMenuButton label='Help' disabled />
            </div>
        </div>
    );
};

export const SidePanel = ({ children }: { children: React.ReactNode }) => {
    const { isSidePanelExpanded, isInterfaceVisible } = useUIStore();

    const className = `${styles.side_panel} ${isInterfaceVisible ? '' : styles.hidden} scroll_y`;

    if (!isInterfaceVisible) {
        return (
            <LogoChip />
        )
    }

    return (
        <div className={className}>
            <div className={styles.menu_panel}>
                <MainMenu />
                <DatePanel />
            </div>
            {isSidePanelExpanded && (
                <div className={styles.content_panel}>
                    {children}
                </div>
            )}
        </div>
    )
}