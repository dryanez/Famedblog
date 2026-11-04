import styles from './HeroGuideBook.module.css';
import { guideLocale, type Locale } from '@/lib/languages';

// 3D version of the free guide cover for the homepage hero: front, spine, page edges and back.
export default function HeroGuideBook({ locale: pageLocale }: { locale: Locale }) {
  const locale = guideLocale(pageLocale), arabic = locale === 'ar';
  const label = arabic ? 'دليل' : locale === 'es' ? 'Guía' : 'Guide';
  const subtitle = arabic ? ['دليلك المجاني', 'للتحضير للامتحان'] : locale === 'es' ? ['Tu guía gratuita', 'de preparación'] : ['Your free', 'preparation guide'];

  return (
    <div className={styles.scene} role="img" aria-label={`FaMED ${label} 2026 — ${subtitle.join(' ')}`}>
      <div className={styles.shadow} aria-hidden="true" />
      <div className={styles.book} aria-hidden="true">
        <div className={`${styles.face} ${styles.back}`} />
        <div className={`${styles.face} ${styles.top}`} />
        <div className={`${styles.face} ${styles.pages}`} />
        <div className={`${styles.face} ${styles.spine}`} dir="ltr"><span>FaMED · {label} · 2026</span></div>
        <div className={`${styles.face} ${styles.front}`}>
          <svg direction="ltr" viewBox="0 0 778 1100" focusable="false">
            <rect width="778" height="1100" fill="#fff" />
            <path d="M0 1100 L450 0 H778 V377 Z" fill="#ed574b" />
            <path d="M0 1100 L778 377 V740 Z" fill="#f7d96f" />
            <path d="M0 0 H450 L0 1100 Z" fill="#151711" />
            <g fontFamily="Arial, sans-serif" fontWeight="700">
              <text x="38" y="130" fill="#fff" fontSize="64">FaMED</text>
              <text x={arabic ? 310 : 38} y="205" fill="#fff" fontSize="64" direction={arabic ? 'rtl' : 'ltr'}>{label}</text>
              <text x="38" y="278" fill="#f7d96f" fontSize="64">2026</text>
            </g>
            <g fontFamily="Arial, sans-serif" fontSize="24" fill="#c7cbd0" direction={arabic ? 'rtl' : 'ltr'}>
              <text x={arabic ? 285 : 40} y="329">{subtitle[0]}</text>
              <text x={arabic ? 270 : 40} y="361">{subtitle[1]}</text>
            </g>
            <image href="/images/products/logo.png" x="491" y="951" width="225" height="96" preserveAspectRatio="xMidYMid meet" />
          </svg>
        </div>
      </div>
    </div>
  );
}
