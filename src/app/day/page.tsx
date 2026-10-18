'use client';

import React, { useEffect, useState } from 'react';
import { dateToDecade, EventCategory, useDateStore, useEventFilterStore, useEventStore, useNavigationStore } from '@/context/scene-store';
import styles from './day.module.css';
import buttons from '@/styles/buttons.module.css';
import loading from '@/styles/loading.module.css';

import StackLoop from '../../media/curves/animated/stack_loop_scale.svg';
import ArrowRight from '../../media/curves/symbols/arrow_right_dot.svg';
import Cross from '@/media/curves/symbols/cross.svg';
import FilterAll from '@/media/curves/symbols/filter_all.svg';
import { scaled } from '@/styles/constants';
import { EventCard, EventProps, sampleEvent } from '@/components/content/event';

const WIKIPEDIA_OTD_URL = "https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/";

interface WikiEvent {
    text: string;
    year: number;
    pages: {
        title: string;
        description: string;
        extract: string;
        thumbnail?: {
            source: string;
        };
        content_urls: {
            desktop: {
                page: string;
            };
        };
    }[];
}


const EventFilter = () => {
    const availableCategories: EventCategory[] = ['People', 'Nature', 'Movies', 'Music', 'Literature', 'Politics', 'Science', 'Other'];
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
                <div className={styles.chip_separator} />
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
            <div className={`${styles.category_dot} cat_${category.toLocaleLowerCase()}`} />
            <div>{category}</div>
        </div>
    )
}

const YearDrawer = ({ year }: { year: number }) => {
    const [isFocused, setIsFocused] = useState(false)
    const { selectedDate } = useDateStore();

    const { selectedCategories } = useEventFilterStore();
    const { events } = useEventStore();

    const yearElements = events.filter(event => event.date.getFullYear() === year);
    const filteredEvents = yearElements.filter(event => selectedCategories.includes(event.category as EventCategory));

    const eventElements = filteredEvents.map(event => (
        <EventCard key={event.id} {...event} />
    ));

    const elementCount = filteredEvents.length;

    useEffect(() => {
        if (selectedDate) setIsFocused(elementCount > 0 && selectedDate && selectedDate.getFullYear() === year);
    }, [selectedDate, year, elementCount]);

    const focusedClassName = isFocused ? styles.focused : '';
    const emptyClassName = elementCount === 0 ? styles.empty : '';

    return (
        <div className={`${styles.year_drawer_wrapper} ${focusedClassName}`}>
            <div className={`${styles.year_drawer_header} ${emptyClassName} ${focusedClassName}`} onClick={() => setIsFocused(!isFocused)}>
                <div className={styles.header_left}>
                    <div className={styles.arrow_icon}>
                        <ArrowRight width={scaled(18)} fill="currentColor" />
                    </div>
                    <div className={styles.header_text}>
                        {year}
                    </div>
                </div>
                {elementCount > 0 && (
                    <div className={styles.event_counter}>
                        {elementCount}
                    </div>
                )}
            </div>
            {isFocused && (
                <div className={styles.year_drawer_content}>
                    {...eventElements}
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
    const { setEvents } = useEventStore();
    const { selectedDate } = useDateStore();
    const { setCurrentMode } = useNavigationStore();
    const { currentDecade } = useDateStore();
    const [ eventsLoaded, setEventsLoaded ] = useState(false);

    async function fetchDayEvents(date: Date = new Date()): Promise<EventProps[]> {
        const decade = dateToDecade(date);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const query = `${WIKIPEDIA_OTD_URL}${month}/${day}`;

        const yearToDecade = (year: number): number => {
            return Math.floor(year / 10) * 10;
        }

        const response = await fetch(query);

        if (!response.ok) {
            console.error(`Failed to fetch events: ${response.statusText}`);
            return [];
        }

        const data = await response.json();
        console.log("Fetched events:", data);

        const decadeEvents =
            data.events.filter(event => yearToDecade(event.year) === decade)
                .map(event => {
                    const page = event.pages[0];
                    return {
                        id: `${event.year}-${page.title}`,
                        date: new Date(event.year, month - 1, day),
                        title: event.text,
                        category: 'Other',
                        description: page.extract,
                        thumbnail: page.thumbnail ? page.thumbnail.source : null,
                        link: page.content_urls.desktop.page,
                    } as EventProps;
                });

        return decadeEvents;
    }

    useEffect(() => {
        setCurrentMode('DAY');
    }, []);

    useEffect(() => {
        if (selectedDate) {
            setEventsLoaded(false);
            fetchDayEvents(selectedDate).then((events) => {
                setEvents(events);
                setEventsLoaded(true);
            })
        }
    }, [selectedDate]);

    return (
        eventsLoaded ? (
        <div className={styles.day_panel}>
            <EventFilter />
                <DecadeAccordion decade={currentDecade} />
        </div>
    ) : (
        <div className={styles.loading_panel}>
            <StackLoop width={scaled(128)} fill="currentColor" className={loading.stack_loading_icon} />
        </div>
    ));
}
