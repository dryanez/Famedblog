import styles from './GuideBookRender.module.css';
import type {Locale} from '@/lib/languages';
export default function GuideBookRender({locale}:{locale:Locale}){
 const title=locale==='ar'?'دليلك المجاني · 30 صفحة':locale==='es'?'Tu guía gratuita · 30 páginas':'Your free guide · 30 pages';
 return <figure className={styles.figure}><div className={styles.stage}><div className={styles.book} role="img" aria-label={title}><div className={styles.pages}/><div className={styles.spine}><span>FaMED PREP · GUIDE</span></div><div className={styles.cover}><img src={`/images/guides/guide-cover-${locale}.png`} alt="" width={636} height={900}/></div></div></div><figcaption className={styles.caption}>{title}</figcaption></figure>;
}
