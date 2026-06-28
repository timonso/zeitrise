"use client";

import styles from './navigation-panel.module.css'
import CenterSelected from '@/media/curves/symbols/center_selected.svg';
import ZoomIn from '@/media/curves/symbols/zoom_in.svg';
import ZoomOut from '@/media/curves/symbols/zoom_out.svg';
import ZoomAll from '@/media/curves/symbols/zoom_all.svg';

const CenterSelectionButton = () => {
    return (
        <div className={styles.navigation_panel_group}>
            <div className={styles.navigation_panel_button}>
                <CenterSelected />
            </div>
        </div>
    )
}

const ZoomControls = () => {
    return (
        <div className={styles.navigation_panel_group}>
            <div className={styles.navigation_panel_button}>
                <ZoomIn />
            </div>
            <div className={styles.separator}/>
            <div className={styles.navigation_panel_button}>
                <ZoomOut />
            </div>
            <div className={styles.separator}/>
            <div className={styles.navigation_panel_button}>
                <ZoomAll />
            </div>
        </div>
    )
}

export const NavigationPanel = () => {
    return (
        <div className={styles.navigation_panel_wrapper}>
            <CenterSelectionButton />
            <ZoomControls />
        </div>
    )
}