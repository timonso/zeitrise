"use client";

import styles from './toast-panel.module.css';
import buttons from '@/styles/buttons.module.css';
import { useUIStore } from '@/context/scene-store';
import InfoIcon from '@/media/curves/symbols/info.svg';
import IssueIcon from '@/media/curves/symbols/issue.svg';
import { scaled } from '@/styles/constants';

export type ToastMessage = {
    message: string;
    category: 'info' | 'issue' | 'error';
};

export const ToastPanel = () => {
    const { toast, setToast } = useUIStore();

    if (!toast) {
        return null;
    }

    const { message, category } = toast;

    const handleClose = () => {
        setToast(null);
    };

    const getIcon = (category: 'info' | 'issue' | 'error') => {
        switch (category) {
            case 'info':
                return <InfoIcon className={styles.toast_icon} fill="currentColor" width={scaled(18)} height={scaled(18)} />;
            case 'issue':
                return <IssueIcon className={styles.toast_icon} fill="currentColor" width={scaled(18)} height={scaled(18)} />;
            case 'error':
                return <InfoIcon className={styles.toast_icon} fill="currentColor" width={scaled(18)} height={scaled(18)} />;
            default:
                return null;
        }
    }

    return (
        <div className={`${styles.toast_panel}`}>
            <div className={`${styles.toast_panel_icon}`}>
                {getIcon(category)}
            </div>
            {message}
            <button className={`${buttons.close_button} ${buttons.clickable}`} onClick={handleClose}>
                &times;
            </button>
        </div>
    )
}