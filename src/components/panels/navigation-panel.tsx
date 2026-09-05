"use client";

import styles from './navigation-panel.module.css'
import buttons from '@/styles/buttons.module.css';
import CenterSelected from '@/media/curves/symbols/center_selected.svg';
import ZoomIn from '@/media/curves/symbols/zoom_in.svg';
import ZoomOut from '@/media/curves/symbols/zoom_out.svg';
import ZoomAll from '@/media/curves/symbols/zoom_all.svg';
import NextDecade from '@/media/curves/symbols/next_decade.svg';
import PreviousDecade from '@/media/curves/symbols/previous_decade.svg';
import YearPlateShape from '@/media/curves/year_plate.svg';
import StackLoop from '../../media/curves/animated/stack_loop_scale.svg';
import { incOrDecTarget, resetCameraTarget, setCameraTargetToYear, useCameraStore, useDateStore, useUIStore, yearToTargetY, rotationToMonth, monthToRotation, useCameraWriter } from '@/context/scene-store';
import { scaled } from '@/styles/constants';

const navPanelButtonStyle = `${styles.navigation_panel_button} ${buttons.clickable}`;

import { useEffect } from "react";
import { ToastPanel } from './toast-panel';

export function KeyboardShortcuts() {
    const setRotation = useCameraWriter((state) => state.setRotation);

    useEffect(() => {

        function getViewedMonth() {
            const rotation = useCameraStore.getState().rotation;
            const month = rotationToMonth(rotation.y);
            return month;
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.defaultPrevented) {
                return;
            }
            const target = event.target as HTMLElement;
            if (
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.tagName === "SELECT" ||
                target.isContentEditable
            ) {
                return;
            }

            if (event.key >= '0' && event.key <= '9') {
                setCameraTargetToYear(parseInt(event.key));
            }

            else if (event.key === 'ArrowUp') {
                incOrDecTarget('up');
            }

            else if (event.key === 'ArrowDown') {
                incOrDecTarget('down');
            }

            else if (event.key === 'ArrowLeft') {
                const month = getViewedMonth();
                const newMonth = (month - 1 + 12) % 12;
                const newRotation = monthToRotation(newMonth);
                setRotation({ x: 0, y: newRotation, z: 0 });
            }

            else if (event.key === 'ArrowRight') {
                const month = getViewedMonth();
                const newMonth = (month + 1) % 12;
                const newRotation = monthToRotation(newMonth);
                setRotation({ x: 0, y: newRotation, z: 0 });
            }
        }
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return null;
}

const CenterSelectionButton = () => {
    const { selectedDate } = useDateStore((state) => state);
    const { setSelectedIsFocused } = useDateStore((state) => state);

    return (
        <div className={styles.navigation_panel_group} onClick={() => {
            setSelectedIsFocused(false);
            setCameraTargetToYear(selectedDate?.getFullYear() ?? 0);
        }}>
            <div className={navPanelButtonStyle}>
                <CenterSelected />
            </div>
        </div>
    )
}

const ZoomControls = () => {
    const orbitControls = useCameraStore((state) => state.orbitControls);

    const zoomIn = () => {
        orbitControls?.dollyIn();
        orbitControls?.update();
    }

    const zoomOut = () => {
        orbitControls?.dollyOut();
        orbitControls?.update();
    }

    const zoomAll = () => {
        orbitControls?.dollyIn(999);
        resetCameraTarget();
        orbitControls?.update();
    }

    return (
        <div className={styles.navigation_panel_group}>
            <div className={navPanelButtonStyle} onClick={zoomIn}>
                <ZoomIn />
            </div>
            <div className={styles.separator} />
            <div className={navPanelButtonStyle} onClick={zoomOut}>
                <ZoomOut />
            </div>
            <div className={styles.separator} />
            <div className={navPanelButtonStyle} onClick={zoomAll}>
                <ZoomAll />
            </div>
        </div>
    )
}

const SceneLoadingIndicator = () => {
    return (
        <div className={`${styles.navigation_panel_group} ${styles.ext} ${styles.bottom_right_floater}`}>
            <div className={styles.navigation_panel_loading_indicator}>
                <StackLoop width={scaled(128)} fill="currentColor" className={styles.stack_loading_icon} />
            </div>
        </div>
    )
}

const YearPlate: React.FC<{ year: number }> = ({ year }) => {
    const orbitControls = useCameraStore((state) => state.orbitControls);
    const cameraTarget = useCameraStore((state) => state.cameraTarget);

    const scrollToYear = (year: number) => {
        setCameraTargetToYear(year);
        // if (!orbitControls) return;
        // orbitControls.setPolarAngle(HORIZON_ANGLE);
        // orbitControls.update();
    }

    const className = `${styles.navigation_panel_year_plate} ${yearToTargetY(year) === cameraTarget[1] ? styles.active : ''}`;

    return (
        <div className={className} onClick={() => scrollToYear(year)}>
            <YearPlateShape fill="currentColor" />
            <div className={styles.navigation_panel_year_plate_text}>
                {"'" + year}
            </div>
            <div className={styles.indicator} />
        </div>
    )
}

const DecadeScroller = () => {
    const yearPlates = [];
    for (let i = 9; i >= 0; i--) {
        const year = i;
        yearPlates.push(<YearPlate key={year} year={year} />);
    }
    return (<div className={styles.navigation_panel_decade_scroller}>
        {yearPlates}
    </div>)
}

const DecadeNavigationGroup = () => {
    const { selectedDate, setSelectedDate } = useDateStore((state) => state);

    const setNextDecade = () => {
        if (!selectedDate) return;
        const currentYear = selectedDate.getFullYear();
        const newDecadeDate = new Date(currentYear + 10, selectedDate.getMonth(), selectedDate.getDate());
        setSelectedDate(newDecadeDate);
    }

    const setPrevDecade = () => {
        if (!selectedDate) return;
        const currentYear = selectedDate.getFullYear();
        const newDecadeDate = new Date(currentYear - 10, selectedDate.getMonth(), selectedDate.getDate());
        setSelectedDate(newDecadeDate);
    }

    return (
        <div className={styles.navigation_panel_group}>
            <div className={navPanelButtonStyle} onClick={setNextDecade}>
                <NextDecade width={scaled(22)} />
            </div>
            <div className={styles.separator} />
            <DecadeScroller />
            <div className={styles.separator} />
            <div className={navPanelButtonStyle} onClick={setPrevDecade}>
                <PreviousDecade width={scaled(22)} />
            </div>

        </div>
    )
}

export const NavigationPanel = () => {
    const { sceneLoading, isInterfaceVisible } = useUIStore((state) => state);
    const className = `${styles.navigation_panel_wrapper} ${sceneLoading ? styles.disabled : ''} ${isInterfaceVisible ? '' : styles.hidden}`;

    return (
        <>
        <div className={className}>
            <CenterSelectionButton />
            <DecadeNavigationGroup />
            <ZoomControls />
            <KeyboardShortcuts />
            <ToastPanel />
        </div>
        {sceneLoading && <SceneLoadingIndicator />}
        </>
    )
}