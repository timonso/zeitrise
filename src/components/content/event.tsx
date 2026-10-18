import { scaled } from '@/styles/constants';
import styles from './event.module.css';
import buttons from '@/styles/buttons.module.css';
import EventIcon from '@/media/curves/symbols/event.svg';
import Image from 'next/image';
import Link from 'next/link';

export interface EventProps {
    id: string;
    date: Date;
    title: string;
    category: string;
    description: string;
    thumbnail: string;
    link?: string;
}

export const sampleEvent: EventProps = {
    id: "1",
    date: new Date(),
    title: "Near-Earth object",
    category: "Movies",
    description: "Near-Earth asteroid 2002 MN misses the Earth by 75,000 miles (121,000 km), about one-third of the distance between the Earth and the Moon.",
    thumbnail: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c5/The_VLT_images_the_very_faint_Near-Earth_Object_2009_FD.jpg/330px-The_VLT_images_the_very_faint_Near-Earth_Object_2009_FD.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail",
    link: "http://en.wikipedia.org/w/index.php?curid=21626"
}

export const EventCard: React.FC<EventProps> = ({ id, date, title, category, description, thumbnail, link }) => {
    return (
        <Link href={link || '#'} target="_blank" rel="noopener noreferrer" className={`${styles.event_card} ${buttons.clickable}`} key={id}>
            <div className={styles.event_card_thumbnail_group}>
                <div className={`${styles.event_category_indicator} cat_${category.toLowerCase()}`} />
                <div className={styles.event_card_thumbnail}>
                    {/* <Image src={thumbnail} width={scaled(330)} height={scaled(220)} alt={title} /> */}
                    {thumbnail ? <img src={thumbnail} alt={title} /> 
                    : <EventIcon className={styles.event_card_thumbnail_placeholder} width={scaled(24)} height={scaled(24)} />
                    }
                </div>
            </div>
            <div className={styles.event_card_body}>
                <div className={styles.event_card_header}>
                    <h3 className={styles.event_title}>{title}</h3>
                </div>
                <div className={styles.event_card_description}>
                    {description}
                </div>
            </div>
        </Link>
    )
}