import styles from './side-panel-content.module.css';
import IconLogo from '@/media/curves/logos/zr-icon-color.svg';
import WordmarkLogo from '@/media/curves/logos/zr-wordmark-color.svg';
import { scaled } from '@/styles/constants';

export function AboutContent() {
    return (
        <div className={styles.side_panel_full}>
            <IconLogo width={scaled(128)} />
            <div className={styles.about_logo}>
                <WordmarkLogo width={scaled(128)} />
            </div>
            {/* <WordmarkLogo width={scaled(128)} /> */}
            <h3>ZeitRise - Time is Built</h3>
            {/* <h3>Time is Built</h3> */}
            <p>Copyright &copy; {new Date().getFullYear()} Timon Sommer</p>
        </div>
    );
}