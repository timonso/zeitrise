import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

type CameraState = {
    rotation: { x: number; y: number; z: number };
    setRotation: (r: { x: number; y: number; z: number }) => void;
};

type DateState = {
    selectedDate: Date | null;
    setSelectedDate: (date: Date) => void;
    dayHovered: boolean;
    setDayHovered: (hovered: boolean) => void;
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
        selectedDate: new Date(),
        setSelectedDate: (date) => set({ selectedDate: date }),
        dayHovered: false,
        setDayHovered: (hovered) => set({ dayHovered: hovered }),
        currentDecade: 2020,
        setCurrentDecade: (decade) => set({ currentDecade: decade }),
        currentRotation: [0, 0, 0],
        setCurrentRotation: (rotation) => set({ currentRotation: rotation }),
    })),
);
