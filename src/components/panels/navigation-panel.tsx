"use client";

import styles from './navigation-panel.module.css'
import CenterSelected from '@/media/curves/symbols/center_selected.svg';
import ZoomIn from '@/media/curves/symbols/zoom_in.svg';
import ZoomOut from '@/media/curves/symbols/zoom_out.svg';
import ZoomAll from '@/media/curves/symbols/zoom_all.svg';
import NextDecade from '@/media/curves/symbols/next_decade.svg';
import PreviousDecade from '@/media/curves/symbols/previous_decade.svg';
import YearPlateShape from '@/media/curves/year_plate.svg';
import { useCameraStore, useDateStore, useUIStore } from '@/context/scene-store';
import { HORIZON_ANGLE } from '../scene/scene';

const yearToTargetY = (year: number) => {
    return year + 0.35 * year + 0.5;
}

const setCameraTargetToYear = (year: number) => {
    const cameraTarget = useCameraStore.getState().cameraTarget;
    const setCameraTarget = useCameraStore.getState().setCameraTarget;
    setCameraTarget([cameraTarget[0], yearToTargetY(year), cameraTarget[2]]);
}

const CenterSelectionButton = () => {
    const { selectedDate, setSelectedDate } = useDateStore((state) => state);
    const { setSelectedIsFocused } = useDateStore((state) => state);

    const selectedYear = (selectedDate?.getFullYear() ?? 0) % 10;

    return (
        <div className={styles.navigation_panel_group} onClick={() => {
            setSelectedIsFocused(false);
            // setCameraTargetToYear(selectedYear);
        }}>
            <div className={styles.navigation_panel_button}>
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
        orbitControls?.update();
    }

    return (
        <div className={styles.navigation_panel_group}>
            <div className={styles.navigation_panel_button} onClick={zoomIn}>
                <ZoomIn />
            </div>
            <div className={styles.separator} />
            <div className={styles.navigation_panel_button} onClick={zoomOut}>
                <ZoomOut />
            </div>
            <div className={styles.separator} />
            <div className={styles.navigation_panel_button} onClick={zoomAll}>
                <ZoomAll />
            </div>
        </div>
    )
}

const YearPlate: React.FC<{ year: number }> = ({ year }) => {
    const orbitControls = useCameraStore((state) => state.orbitControls);
    const cameraTarget = useCameraStore((state) => state.cameraTarget);

    const scrollToYear = (year: number) => {
        setCameraTargetToYear(year);
        if (!orbitControls) return;
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
    const { currentDecade, setCurrentDecade } = useDateStore((state) => state);
    const {selectedDate, setSelectedDate} = useDateStore((state) => state);

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
            <div className={styles.navigation_panel_button} onClick={setNextDecade}>
                <NextDecade width="22px" height="22px" />
            </div>
            <div className={styles.separator} />
            <DecadeScroller />
            <div className={styles.separator} />
            <div className={styles.navigation_panel_button} onClick={setPrevDecade}>
                <PreviousDecade width="22px" height="22px" />
            </div>

        </div>
    )
}

export const NavigationPanel = () => {
    const { sceneLoading, setSceneLoading } = useUIStore((state) => state);
    const className = `${styles.navigation_panel_wrapper} ${sceneLoading ? styles.disabled : ''}`;

    return (
        <div className={className}>
            <CenterSelectionButton />
            <ZoomControls />
            <DecadeNavigationGroup />
        </div>
    )
}