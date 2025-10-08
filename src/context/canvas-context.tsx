import { createContext, useState, useContext, ReactNode } from 'react';

interface CanvasContextProps {
    selectedDate: Date | null;
    setSelectedDate: (date: Date) => void;
    dayHovered: boolean;
    setDayHovered: (hovered: boolean) => void;
    currentDecade: number;
    setCurrentDecade: (decade: number) => void;
}

const CanvasContext = createContext<CanvasContextProps | undefined>(undefined);

export const CanvasProvider = ({ children }: { children: ReactNode }) => {
    const defaultDate = new Date();
    const [selectedDate, setSelectedDate] = useState<Date | null>(defaultDate);
    const [dayHovered, setDayHovered] = useState<boolean>(false);
    const [currentDecade, setCurrentDecade] = useState<number>(2020);

    return (
        <CanvasContext.Provider
            value={{
                selectedDate,
                setSelectedDate,
                dayHovered,
                setDayHovered,
                currentDecade,
                setCurrentDecade,
            }}
        >
            {children}
        </CanvasContext.Provider>
    );
};

export const useCanvasContext = () => {
    const context = useContext(CanvasContext);
    if (!context) {
        throw new Error(
            'useCanvasContext must be used within a CanvasProvider'
        );
    }
    return context;
};
