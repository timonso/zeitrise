'use client';

import React, { useEffect, useState } from 'react';
import { EventCategory, useDateStore, useEventFilterStore, useNavigationStore } from '@/context/scene-store';
import styles from './day.module.css';
import buttons from '@/styles/buttons.module.css';

import ArrowRight from '../../media/curves/symbols/arrow_right.svg';
import Cross from '@/media/curves/symbols/cross.svg';
import FilterAll from '@/media/curves/symbols/filter_all.svg';
import { scaled } from '@/styles/constants';
import { EventCard, sampleEvent } from '@/components/content/event';


const EventFilter = () => {
    const availableCategories: EventCategory[] = ['People', 'Nature', 'Movies', 'Music', 'Literature', 'Politics', 'Science'];
    const { selectedCategories, setSelectedCategories } = useEventFilterStore();
    const someCategoriesSelected = selectedCategories.length < availableCategories.length;
    
    const toggleAllCategories = () => {
        if (someCategoriesSelected) {
            setSelectedCategories(availableCategories);
        } else {
            setSelectedCategories([]);
        }
    }

    return (
        <div className={styles.event_filter_wrapper}>
            <div className={styles.event_filter_header}>
                Filter events by category:
            </div>
            <div className={`${styles.chip_wrapper}`}>
                <div className={`${styles.category_chip} ${buttons.clickable} ${styles.toggle_all} ${!someCategoriesSelected ? styles.selected : ''}`} onClick={toggleAllCategories}>
                    <FilterAll width={scaled(14)} />
                </div>
                <div className={styles.chip_separator}/>
                <div className={`${styles.event_filter_categories} scroll_x fade_x`}>
                    {availableCategories.map((category) => (
                        <CategoryChip key={category} category={category} />
                    ))}
                </div>
            </div>
        </div>
    )
}

const CategoryChip = ({ category }: { category: EventCategory }) => {
    const { selectedCategories, toggleCategory } = useEventFilterStore();
    const isSelected = selectedCategories.includes(category)
    const className = `${styles.category_chip} ${buttons.clickable} cat_${category.toLowerCase()} ${isSelected ? styles.selected : ''}`;

    return (
        <div className={className} onClick={() => toggleCategory(category)}>
            <div className={`${styles.category_dot} cat_${category.toLocaleLowerCase()}`}/>
            <div>{category}</div>
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
                        <ArrowRight width={scaled(12)} fill="currentColor" />
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
                    <EventCard {...sampleEvent} />
                    <EventCard {...sampleEvent} />
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
        <div className={`${styles.decade_accordion} scroll_y`}>
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
