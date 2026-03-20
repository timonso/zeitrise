import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

type CameraState = {
    rotation: { x: number; y: number; z: number };
    setRotation: (r: { x: number; y: number; z: number }) => void;
};

const getDayKey = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

type DateState = {
    hoveredDate: Date | null;
    hoveredDateKey: number | null;
    setHoveredDate: (date: Date | null) => void;
    selectedDate: Date | null;
    selectedDateKey: number | null;
    setSelectedDate: (date: Date) => void;
    currentDecade: number;
    setCurrentDecade: (decade: number) => void;
    currentRotation: [number, number, number];
    setCurrentRotation: (rotation: [number, number, number]) => void;
};

export const useCameraStore = create<CameraState>()(
    subscribeWithSelector((set) => ({
        rotation: { x: 0, y: 0, z: 0 },
        setRotation: (rotation) => set({ rotation }),
    })),
);

export const useCameraWriter = create<CameraState>()(
    subscribeWithSelector((set) => ({
        rotation: { x: 0, y: 0, z: 0 },
        setRotation: (rotation) => set({ rotation }),
    })),
);

export const useDateStore = create<DateState>()(
    subscribeWithSelector((set) => ({
        hoveredDate: null,
        hoveredDateKey: null,
        setHoveredDate: (date) => {
            set({ hoveredDate: date, hoveredDateKey: date ? getDayKey(date) : null });
        },
        selectedDate: new Date(),
        selectedDateKey: getDayKey(new Date()),
        setSelectedDate: (date) =>
            set({ selectedDate: date, selectedDateKey: getDayKey(date) }),
        currentDecade: 2020,
        setCurrentDecade: (decade) => set({ currentDecade: decade }),
        currentRotation: [0, 0, 0],
        setCurrentRotation: (rotation) => set({ currentRotation: rotation }),
    })),
);
