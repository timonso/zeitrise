"use client";

import {
    useDateStore,
} from '@/context/scene-store';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const QUERY_KEY = 'd';

const parseDateParam = (dateParam: string | null): Date | null => {
    if (!dateParam) return null;
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateParam);
    if (!match) return null;

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const parsedDate = new Date(year, month - 1, day);

    if (
        parsedDate.getFullYear() !== year ||
        parsedDate.getMonth() !== month - 1 ||
        parsedDate.getDate() !== day
    ) {
        return null;
    }

    return parsedDate;
}

const formatDateParam = (date: Date): string => {
    const year = String(date.getFullYear()).padStart(4, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export function setURLDate(date: Date) {
    const params = new URLSearchParams(window.location.search);
    params.set(QUERY_KEY, formatDateParam(date));
    const newURL = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newURL);
}

export function URLDateSync() {
    const searchParams = useSearchParams();
    const selectedDate = useDateStore((state) => state.selectedDate);
    const setSelectedDateFromURL = useDateStore((state) => state.setSelectedDateFromURL);
    const dateParam = searchParams.get(QUERY_KEY);

    useEffect(() => {
        const queryDate = parseDateParam(dateParam);
        if (queryDate) return;
        setURLDate(selectedDate!);
    }, []);

    useEffect(() => {
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
    }, [dateParam, selectedDate, setSelectedDateFromURL]);
}
