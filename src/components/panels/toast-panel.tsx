"use client";

import styles from './toast-panel.module.css';
import buttons from '@/styles/buttons.module.css';
import { useUIStore } from '@/context/scene-store';
import { scaled } from '@/styles/constants';

export const ToastPanel = () => {
    const { toastMessage, setShowToast } = useUIStore();

    const handleClose = () => {
        setShowToast(false);
    };

    return (
        <div className={`${styles.toast_panel}`}>
            {toastMessage}
            <button className={`${buttons.close_button} ${buttons.clickable}`} onClick={handleClose}>
                &times;
            </button>
        </div>
    )
}