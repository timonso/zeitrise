import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { setURLDate } from '@/components/utils/url-sync';
import { Camera } from 'three';
import type { OrbitControls } from 'three-stdlib';

const TARGET_HEIGHT = 7;

type CameraState = {
    orbitControls: OrbitControls | null;
    setOrbitControls: (controls: OrbitControls) => void;
    camera: Camera | null;
    setCamera: (camera: Camera) => void;
    cameraTarget: [number, number, number];
    setCameraTarget: (target: [number, number, number]) => void;
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
    setSelectedDateFromURL: (date: Date) => void;
    currentDecade: number;
    setCurrentDecade: (decade: number) => void;
    currentRotation: [number, number, number];
    setCurrentRotation: (rotation: [number, number, number]) => void;
    selectedIsFocused: boolean;
    setSelectedIsFocused: (focused: boolean) => void;
};

type UIState = {
    isSidePanelExpanded: boolean;
    setIsSidePanelExpanded: (expanded: boolean) => void;
    sceneLoading: boolean;
    setSceneLoading: (loading: boolean) => void;
}

export const useCameraStore = create<CameraState>()(
    subscribeWithSelector((set) => ({
        camera: null,
        setCamera: (camera) => set({ camera }),
        orbitControls: null,
        setOrbitControls: (orbitControls) => set({ orbitControls }),
        cameraTarget: [0, TARGET_HEIGHT, 0],
        setCameraTarget: (target) => set({ cameraTarget: target }),
        rotation: { x: 0, y: 0, z: 0 },
        setRotation: (rotation) => set({ rotation }),
    })),
);

export const useCameraWriter = create<CameraState>()(
    subscribeWithSelector((set) => ({
        camera: null,
        setCamera: (camera) => set({ camera }),
        orbitControls: null,
        setOrbitControls: (orbitControls) => set({ orbitControls }),
        cameraTarget: [0, TARGET_HEIGHT, 0],
        setCameraTarget: (target) => set({ cameraTarget: target }),
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
        setSelectedDate: (date) => {
            set({ selectedDate: date, selectedDateKey: getDayKey(date) });
            setURLDate(date);
        },
        setSelectedDateFromURL: (date) => {
            set({ selectedDate: date, selectedDateKey: getDayKey(date) });
        },
        currentDecade: 2020,
        setCurrentDecade: (decade) => set({ currentDecade: decade }),
        currentRotation: [0, 0, 0],
        setCurrentRotation: (rotation) => set({ currentRotation: rotation }),
        selectedIsFocused: true,
        setSelectedIsFocused: (focused) => set({ selectedIsFocused: focused }),
    })),
);

export const useUIStore = create<UIState>()(
    subscribeWithSelector((set) => ({
        isSidePanelExpanded: true,
        setIsSidePanelExpanded: (expanded) => set({ isSidePanelExpanded: expanded }),
        sceneLoading: false,
        setSceneLoading: (loading) => set({ sceneLoading: loading }),
    })),
);
