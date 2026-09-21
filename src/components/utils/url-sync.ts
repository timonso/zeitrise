'use client';

import { useDateStore } from '@/context/scene-store';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const QUERY_KEY = 'd';

const parseDateParam = (dateParam: string | null): Date | null => {
    if (!dateParam) return null;
    const dateArray = dateParam.split('-');

    if (dateArray.length == 1 && dateArray[0].toUpperCase().endsWith('X')) {
        dateArray[0] = dateArray[0].replace(/X|x/g, '0');
    }

    const year = Number(dateArray[0]);
    const month = Number(dateArray[1] ? dateArray[1] : 1);
    const day = Number(dateArray[2] ? dateArray[2] : 1);

    const parsedDate = new Date(year, month - 1, day);

    if (
        parsedDate.getFullYear() !== year ||
        parsedDate.getMonth() !== month - 1 ||
        parsedDate.getDate() !== day
    ) {
        return null;
    }

    return parsedDate;
};

const formatDateParam = (date: Date): string => {
    const year = String(date.getFullYear()).padStart(4, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export function setURLDate(date: Date) {
    // const params = new URLSearchParams(window.location.search);
    // params.set(QUERY_KEY, formatDateParam(date));
    // const newURL = `${window.location.pathname}?${params.toString()}`;
    // window.history.pushState({}, '', newURL);
    if (window) window.location.hash = formatDateParam(date);
}

export function URLDateSync() {
    // const searchParams = useSearchParams();
    const selectedDate = useDateStore((state) => state.selectedDate);
    const setSelectedDateFromURL = useDateStore(
        (state) => state.setSelectedDateFromURL,
    );
    // const dateParam = searchParams.get(QUERY_KEY);

    useEffect(() => {
        if (!window) return;
        const dateParam = window?.location.hash
            ? window.location.hash.substring(1)
            : null;
        const queryDate = parseDateParam(dateParam);
        if (queryDate) return;
        setURLDate(selectedDate!);
    }, []);

    useEffect(() => {
        const onHashChange = () => {
            if (!window) return;
            const dateParam = window?.location.hash
                ? window.location.hash.substring(1)
                : null;
            const urlDate = parseDateParam(dateParam);
            if (urlDate) {
                if (
                    selectedDate &&
                    selectedDate.getFullYear() === urlDate.getFullYear() &&
                    selectedDate.getMonth() === urlDate.getMonth() &&
                    selectedDate.getDate() === urlDate.getDate()
                ) {
                    return;
                }
                setSelectedDateFromURL(urlDate);
            }
        };

        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, [selectedDate, setSelectedDateFromURL]);
    return null;
}
