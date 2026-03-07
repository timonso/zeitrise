import { useCanvasContext } from "@/context/canvas-context";
import { useCameraStore } from "@/context/scene-store";

import Image from "next/image";

import styles from '../../page.module.css';

export function DatePanel() {
    const { selectedDate, setSelectedDate, currentDecade, setCurrentDecade, currentRotation } = useCanvasContext();
    const rotation = useCameraStore((state) => state.rotation);

    return (
        <div>
            <input
                type="number"
                value={currentDecade}
                step={10}
                onChange={(e) => setCurrentDecade(parseInt(e.target.value))}
            />
            <p>{selectedDate?.toDateString()}</p>
            <p>Camera rotation: {rotation.x.toFixed(2)}, {rotation.y.toFixed(2)}, {rotation.z.toFixed(2)}</p>
            <div className={`${styles.year_dial} ${styles.nodrag}`} style={{transform: `rotateZ(${rotation.y}rad) rotateY(0rad) rotateX(0rad)`}}>
                <Image
                    src="./media/curves/dial.svg"
                    alt="Year Dial"
                    fill
                    style={{ objectFit: 'contain' }}
                />
            </div>
        </div>
    );
}
