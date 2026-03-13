import { useCameraStore, useCameraWriter, useDateStore } from '@/context/scene-store';

import Image from 'next/image';

import styles from '../../page.module.css';

const YearDial = () => {
    const rotation = useCameraStore((state) => state.rotation);
    const setRotation = useCameraWriter((state) => state.setRotation);
    const { selectedDate } = useDateStore();

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
                    <Image
                        src="./media/curves/dial_rim.svg"
                        alt="Year Dial Rim"
                        fill
                        style={{ objectFit: 'contain' }}
                        className={`${styles.dial_rim} ${styles.nodrag}`}
                    />
                    <Image
                        src="./media/curves/dial.svg"
                        alt="Year Dial"
                        fill
                        style={{ objectFit: 'contain' }}
                        className={`${styles.nodrag}`}
                    />
                </div>
            </div>
            <div className={styles.dial_dot}/>
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
    } = useDateStore();

    return (
        <div className={styles.date_panel}>
            <input
                type="number"
                value={currentDecade}
                step={10}
                onChange={(e) => setCurrentDecade(parseInt(e.target.value))}
            />
            <p>{selectedDate?.toDateString()}</p>
            <YearDial />
            {/* <p>Camera rotation: {rotation.x.toFixed(2)}, {rotation.y.toFixed(2)}, {rotation.z.toFixed(2)}</p> */}
        </div>
    );
}
