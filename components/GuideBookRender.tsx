import styles from './GuideBookRender.module.css';
import { type Locale } from '@/lib/languages';
import { guideAlt } from './HeroGuideBook';

// 3D render of the real free-guide cover in the page's language (same render as the homepage hero).
export default function GuideBookRender({ locale }: { locale: Locale }) {
  return (
    <figure className={styles.figure}>
      <div className={styles.stage}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/images/guide/guide3d_${locale}.webp`} alt={guideAlt[locale]} width={1140} height={1456} className={styles.render} loading="lazy" />
      </div>
      <figcaption className={styles.caption}>{guideAlt[locale]}</figcaption>
    </figure>
  );
}
