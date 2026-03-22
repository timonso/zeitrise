import {
    useCameraStore,
    useCameraWriter,
    useDateStore,
} from '@/context/scene-store';
import Image from 'next/image';
import styles from '../../page.module.css';
import Dial from '../../../../public/media/curves/dial.svg';
import DialRim from '../../../../public/media/curves/dial_rim.svg';
import TodayIcon from '../../../../public/media/curves/symbols/today.svg';
import RandomIcon from '../../../../public/media/curves/symbols/random.svg';
import { useEffect, useState } from 'react';

enum Weekday {
    'SUN',
    'MON',
    'TUE',
    'WED',
    'THU',
    'FRI',
    'SAT',
}

export function centerMonth(
    date: Date,
    setter: (rotation: { x: number; y: number; z: number }) => void,
) {
    const monthRotation = (date.getMonth() * Math.PI * 2) / 12;
    setter({ x: 0, y: monthRotation, z: 0 });
}

function sameDayLocal(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const YearDial = () => {
    const rotation = useCameraStore((state) => state.rotation);
    const setRotation = useCameraWriter((state) => state.setRotation);
    const { selectedDate, setSelectedDate } = useDateStore();
    const todayDate = new Date();
    const isToday = sameDayLocal(selectedDate, todayDate);

    return (
        <div className={styles.dial_group}>
            <div className={styles.dial_wrapper}>
                <div className={styles.year_dial_display}>
                    {selectedDate?.getFullYear()}
                </div>
                <div
                    className={styles.dial_container}
                    style={{
                        transform: `rotateZ(${rotation.y}rad) rotateY(0rad) rotateX(0rad)`,
                    }}
                >
                    {Array.from({ length: 12 }).map((_, i) => {
                        const index = 6 - i;
                        const angle = (index * 360) / 12;

                        return (
                            <div
                                key={index}
                                className={styles.year_dial_tick}
                                style={{
                                    transform: `rotateZ(${180 - angle}deg)`,
                                }}
                                onClick={() => {
                                    console.log(`Clicked on month ${index}`);
                                    setRotation({
                                        x: 0,
                                        y: (angle * Math.PI) / 180,
                                        z: 0,
                                    });
                                }}
                            />
                        );
                    })}
                    <Dial
                        fill="black"
                        aria-hidden="true"
                        className={`${styles.nodrag}`}
                    />
                    <DialRim
                        width={"100%"}
                        className={`${styles.dial_rim} ${styles.nodrag}`}
                    />
                </div>
            </div>
            <div className={styles.dial_options}>
                <div
                    className={`${styles.dial_button} ${styles.nodrag} ${styles.clickable} ${isToday ? styles.active : ''}`}
                    onClick={() => {
                        setSelectedDate(todayDate);
                    }}
                >
                    <TodayIcon
                        width={24}
                        height={24}
                        fill="currentColor"
                        aria-hidden="true"
                        className={`${styles.nodrag} ${styles.dial_icon}`}
                    />
                </div>
                <div className={styles.dial_dot} />
                <div className={`${styles.dial_button} ${styles.nodrag} ${styles.clickable}`}>
                    <RandomIcon
                        width={24}
                        height={24}
                        fill="currentColor"
                        aria-hidden="true"
                        className={`${styles.nodrag} ${styles.dial_icon}`}
                    />
                </div>
            </div>
        </div>
    );
};

const DateSelector = ({
    currentDecade,
    setCurrentDecade,
    selectedDate,
    setSelectedDate,
    hoveredDate,
}: {
    currentDecade: number;
    setCurrentDecade: (value: number) => void;
    selectedDate: Date | null;
    setSelectedDate: (date: Date) => void;
    hoveredDate: Date | null;
}) => {
    const formatTwoDigits = (value: number) => String(value).padStart(2, '0');
    const formatFourDigits = (value: number) => String(value).padStart(4, '0');
    const [dayDisplay, setDayDisplay] = useState(() =>
        selectedDate ? formatTwoDigits(selectedDate.getDate()) : '',
    );
    const [monthDisplay, setMonthDisplay] = useState(() =>
        selectedDate ? formatTwoDigits(selectedDate.getMonth() + 1) : '',
    );
    const [yearDisplay, setYearDisplay] = useState(() =>
        selectedDate ? formatFourDigits(selectedDate.getFullYear()) : '',
    );

    const handleDayChange = (value: string) => {
        const sanitized = value.replace(/\D/g, '').slice(0, 2);
        setDayDisplay(sanitized);
    };

    const handleMonthChange = (value: string) => {
        const sanitized = value.replace(/\D/g, '').slice(0, 2);
        setMonthDisplay(sanitized);
    };

    const handleYearChange = (value: string) => {
        const sanitized = value.replace(/\D/g, '').slice(0, 4);
        setYearDisplay(sanitized);
    };

    const isHovering = hoveredDate !== undefined && hoveredDate !== null;

    useEffect(() => {
        if (!selectedDate) {
            setDayDisplay('');
            setMonthDisplay('');
            setYearDisplay('');
            return;
        }

        if (isHovering) {
            setDayDisplay(formatTwoDigits(hoveredDate.getDate()));
            setMonthDisplay(formatTwoDigits(hoveredDate.getMonth() + 1));
            setYearDisplay(formatFourDigits(hoveredDate.getFullYear()));
            return;
        }

        setDayDisplay(formatTwoDigits(selectedDate.getDate()));
        setMonthDisplay(formatTwoDigits(selectedDate.getMonth() + 1));
        setYearDisplay(formatFourDigits(selectedDate.getFullYear()));
    }, [selectedDate, isHovering]);

    useEffect(() => {
        if (!selectedDate) return;
        centerMonth(selectedDate, useCameraWriter.getState().setRotation);
    }, [selectedDate]);

    useEffect(() => {
        if (isHovering || !selectedDate || dayDisplay.trim() === '') return;

        const timeoutId = setTimeout(() => {
            const parsedDay = parseInt(dayDisplay, 10);
            if (Number.isNaN(parsedDay)) return;

            const maxDay = new Date(
                selectedDate.getFullYear(),
                selectedDate.getMonth() + 1,
                0,
            ).getDate();
            const normalizedDay = Math.min(Math.max(parsedDay, 1), maxDay);

            if (selectedDate.getDate() !== normalizedDay) {
                const newDate = new Date(selectedDate);
                newDate.setDate(normalizedDay);
                setSelectedDate(newDate);
            }

            setDayDisplay(formatTwoDigits(normalizedDay));
        }, 800);

        return () => clearTimeout(timeoutId);
    }, [dayDisplay, selectedDate, setSelectedDate]);

    useEffect(() => {
        if (isHovering || !selectedDate || monthDisplay.trim() === '') return;

        const timeoutId = setTimeout(() => {
            const parsedMonth = parseInt(monthDisplay, 10);
            if (Number.isNaN(parsedMonth)) return;

            const normalizedMonth = Math.min(Math.max(parsedMonth, 1), 12);
            const targetMonthIndex = normalizedMonth - 1;

            const maxDayInTargetMonth = new Date(
                selectedDate.getFullYear(),
                targetMonthIndex + 1,
                0,
            ).getDate();
            const normalizedDay = Math.min(
                selectedDate.getDate(),
                maxDayInTargetMonth,
            );

            if (
                selectedDate.getMonth() !== targetMonthIndex ||
                selectedDate.getDate() !== normalizedDay
            ) {
                const newDate = new Date(selectedDate);
                newDate.setMonth(targetMonthIndex, normalizedDay);
                setSelectedDate(newDate);
            }

            setMonthDisplay(formatTwoDigits(normalizedMonth));
        }, 800);

        return () => clearTimeout(timeoutId);
    }, [monthDisplay, selectedDate, setSelectedDate]);

    useEffect(() => {
        if (isHovering || !selectedDate || yearDisplay.trim() === '') return;

        const timeoutId = setTimeout(() => {
            const parsedYear = parseInt(yearDisplay, 10);
            if (Number.isNaN(parsedYear)) return;

            const normalizedYear = Math.min(Math.max(parsedYear, 1), 9999);
            const maxDayInTargetMonth = new Date(
                normalizedYear,
                selectedDate.getMonth() + 1,
                0,
            ).getDate();
            const normalizedDay = Math.min(
                selectedDate.getDate(),
                maxDayInTargetMonth,
            );

            if (
                selectedDate.getFullYear() !== normalizedYear ||
                selectedDate.getDate() !== normalizedDay
            ) {
                const newDate = new Date(selectedDate);
                newDate.setFullYear(
                    normalizedYear,
                    selectedDate.getMonth(),
                    normalizedDay,
                );
                setSelectedDate(newDate);
            }

            const nextDecade = Math.floor(normalizedYear / 10) * 10;
            if (currentDecade !== nextDecade) {
                setCurrentDecade(nextDecade);
            }

            setYearDisplay(formatFourDigits(normalizedYear));
        }, 800);

        return () => clearTimeout(timeoutId);
    }, [
        currentDecade,
        selectedDate,
        setCurrentDecade,
        setSelectedDate,
        yearDisplay,
        isHovering,
    ]);

    return (
        <div className={styles.date_selector}>
            <DateInformation selectedDate={selectedDate} />
            <div
                className={`${styles.date_picker} ${isHovering ? styles.hovering : ''}`}
            >
                <input
                    className={`${styles.date_input} ${styles.day_input}`}
                    type="text"
                    inputMode="numeric"
                    value={dayDisplay}
                    placeholder={'DD'}
                    style={{ width: '40px' }}
                    onChange={(e) =>
                        !isHovering
                            ? handleDayChange(e.target.value)
                            : undefined
                    }
                />
                /
                <input
                    className={`${styles.date_input} ${styles.month_input}`}
                    type="text"
                    inputMode="numeric"
                    value={monthDisplay}
                    placeholder={'MM'}
                    style={{ width: '40px' }}
                    onChange={(e) =>
                        !isHovering
                            ? handleMonthChange(e.target.value)
                            : undefined
                    }
                />
                /
                <input
                    className={`${styles.date_input} ${styles.year_input}`}
                    type="text"
                    inputMode="numeric"
                    value={yearDisplay}
                    placeholder={'YYYY'}
                    style={{ width: '70px' }}
                    onChange={(e) =>
                        !isHovering
                            ? handleYearChange(e.target.value)
                            : undefined
                    }
                />
            </div>
        </div>
    );
};

const DateInformation = ({ selectedDate }: { selectedDate: Date | null }) => {
    const isCommonEra = selectedDate && selectedDate.getFullYear() > 0;
    return (
        <div className={styles.date_information}>
            <div className={styles.date_chip}>
                <div className={styles.chip_segment}>
                    {selectedDate && <p>{Weekday[selectedDate.getDay()]}</p>}
                </div>
            </div>
            <div className={styles.date_chip}>
                <div
                    className={`${styles.chip_segment} ${!isCommonEra && styles.chip_active}`}
                >
                    B
                </div>
                <div
                    className={`${styles.chip_segment} ${isCommonEra && styles.chip_active}`}
                >
                    CE
                </div>
            </div>
        </div>
    );
};

export function DatePanel() {
    const {
        selectedDate,
        setSelectedDate,
        currentDecade,
        setCurrentDecade,
        currentRotation,
        hoveredDate,
    } = useDateStore();

    return (
        <div className={styles.date_panel}>
            <YearDial />
            {/* <DateInformation selectedDate={selectedDate} /> */}
            <DateSelector
                currentDecade={currentDecade}
                setCurrentDecade={setCurrentDecade}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                hoveredDate={hoveredDate}
            />
            {/* <p>{selectedDate?.toDateString()}</p> */}
            {/* <p>Camera rotation: {rotation.x.toFixed(2)}, {rotation.y.toFixed(2)}, {rotation.z.toFixed(2)}</p> */}
        </div>
    );
}
