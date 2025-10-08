import { useCanvasContext } from "@/context/canvas-context";

export function DatePanel() {
    const { selectedDate, setSelectedDate, currentDecade, setCurrentDecade } = useCanvasContext();

    return (
        <div>
            <p>{selectedDate?.toDateString()}</p>
            <input
                type="number"
                value={currentDecade}
                step={10}
                onChange={(e) => setCurrentDecade(parseInt(e.target.value))}
            />
        </div>
    );
}
