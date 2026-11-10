import styles from './HeroGuideBook.module.css';
import { type Locale } from '@/lib/languages';

// 3D render of the real free-guide cover (Editorial design, Nov 2026) in the page's language, same studio style as the FaMED Protokoll 2026 book render.
export const guideAlt: Record<Locale, string> = {
  en: 'Free FaMED 8-week study guide (PDF, 30 pages)', es: 'Guía gratuita FaMED de 8 semanas (PDF, 30 páginas)', ar: 'دليل FaMED المجاني لمدة 8 أسابيع (PDF، 30 صفحة)',
  de: 'Kostenloser FaMED-Lernplan für 8 Wochen (PDF, 30 Seiten)', ru: 'Бесплатное руководство FaMED на 8 недель (PDF, 30 страниц)',
  fr: 'Guide FaMED gratuit sur 8 semaines (PDF, 30 pages)', tr: 'Ücretsiz 8 haftalık FaMED rehberi (PDF, 30 sayfa)',
};
export default function HeroGuideBook({ locale }: { locale: Locale }) {
  return (
    <div className={styles.scene}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/images/guide/guide3d_${locale}.webp`} alt={guideAlt[locale]} width={1140} height={1456} className={styles.render} fetchPriority="high" />
    </div>
  );
}
