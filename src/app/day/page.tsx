'use client';

import React, { useEffect, useState } from 'react';
import { useDateStore, useNavigationStore } from '@/context/scene-store';
import styles from './day.module.css';

import ArrowRight from '../../media/curves/symbols/arrow_right.svg';
import { scaled } from '@/styles/constants';

const EventFilter = () => {
    return (
        <div className={styles.event_filter_wrapper}>
            
        </div>
    )
}

const YearDrawer = ({ year }: { year: number }) => {
    const [isFocused, setIsFocused] = useState(false)
    const { selectedDate } = useDateStore();

    useEffect(() => {
        if (selectedDate) setIsFocused(selectedDate && selectedDate.getFullYear() === year);
    }, [selectedDate, year]);

    const focusedClassName = isFocused ? styles.focused : '';

    return (
        <div className={`${styles.year_drawer_wrapper} ${focusedClassName}`}>
            <div className={`${styles.year_drawer_header} ${focusedClassName}`} onClick={() => setIsFocused(!isFocused)}>
                <div className={styles.header_left}>
                <div className={styles.arrow_icon}>
                    <ArrowRight width={scaled(12)} fill="currentColor"/>
                </div>
                <div className={styles.header_text}>
                    {year}
                </div>
                </div>
                <div className={styles.event_counter}>
                    57
                </div>
            </div>
            {isFocused && (
                <div className={styles.year_drawer_content}>
                    {/* Render months or other content for the year */}
                </div>
            )}
        </div>
    )
}

const DecadeAccordion = ({ decade }: { decade: number }) => {
    const drawers: React.ReactNode[] = [];

    for (let year = decade; year < decade + 10; year++) {
        drawers.push(<YearDrawer key={year} year={year} />);
    }

    return (
        <div className={styles.decade_accordion}>
            {...drawers.reverse()}
        </div>
    )
}

export default function Day() {
    const { setCurrentMode } = useNavigationStore();
    const { currentDecade } = useDateStore();

    useEffect(() => {
        setCurrentMode('DAY');
    }, []);

    return (
        <div className={styles.day_panel}>
            <EventFilter />
            <DecadeAccordion decade={currentDecade} />
        </div>
    );
}
