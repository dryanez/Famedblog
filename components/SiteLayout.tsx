import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import DiscoveryTracker from "@/components/DiscoveryTracker";
import PostHogInit from "@/components/PostHogInit";
import { Analytics } from "@vercel/analytics/next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookPromoPopup from "@/components/BookPromoPopup";
import { locales, type Locale } from "@/lib/languages";


const inter = Inter({ subsets: ["latin"] });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://famed-vorbereitung.com";

export const siteMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "FAMED Test Prep - Pass Your Medical German Exam",
    template: "%s | FAMED Test Prep"
  },
  description: "Independent preparation for medical German communication. Study guides, practice cases and useful phrases.",
  keywords: ["FAMED", "Fachsprachenprüfung", "medical German", "FSP", "Approbation", "Germany", "medical exam"],
  authors: [{ name: "FAMED Test Prep" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "FAMED Test Prep",
    title: "FAMED Test Prep - Pass Your Medical German Exam",
    description: "Complete preparation for the FAMED medical German language exam.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FAMED Test Prep"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "FAMED Test Prep - Pass Your Medical German Exam",
    description: "Complete preparation for the FAMED medical German language exam.",
    images: ["/og-image.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const cookieCopy:Record<Locale,[string,string,string,string]>={
  en:['We use cookies to understand how the site is used and improve it. You can accept or reject optional cookies.','Accept','Reject','Privacy policy'],
  ar:['نستخدم ملفات تعريف الارتباط لفهم كيفية استخدام الموقع وتحسينه. يمكنك قبول ملفات تعريف الارتباط الاختيارية أو رفضها.','قبول','رفض','سياسة الخصوصية'],
  es:['Usamos cookies para entender el uso del sitio y mejorarlo. Puedes aceptar o rechazar las cookies opcionales.','Aceptar','Rechazar','Política de privacidad'],
  ru:['Мы используем файлы cookie, чтобы понимать, как используется сайт, и улучшать его. Вы можете принять или отклонить необязательные cookie.','Принять','Отклонить','Политика конфиденциальности'],
  fr:['Nous utilisons des cookies pour comprendre l’utilisation du site et l’améliorer. Vous pouvez accepter ou refuser les cookies facultatifs.','Accepter','Refuser','Politique de confidentialité'],
  tr:['Sitenin nasıl kullanıldığını anlamak ve geliştirmek için çerez kullanıyoruz. İsteğe bağlı çerezleri kabul edebilir veya reddedebilirsiniz.','Kabul et','Reddet','Gizlilik politikası'],
};

export default function SiteLayout({
  children, locale = 'en',
}: Readonly<{
  children: React.ReactNode; locale?: Locale;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "FAMED Test Prep",
        url: siteUrl,
        logo: `${siteUrl}/logo.png`,
        sameAs: [
          "https://t.me/+vgtsHuqtwfk4MTJh",
          "https://www.instagram.com/famedtestprep",
          "https://www.youtube.com/@famedtestprep"
        ],
      },
      {
        "@type": "WebSite",
        name: "FAMED Test Prep",
        url: siteUrl,
        inLanguage: locales,
        publisher: { "@id": `${siteUrl}/#organization` },
      },
    ],
  };

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <head>
        <script
          src="/cookie-consent.js"
          data-dir={locale === 'ar' ? 'rtl' : undefined}
          data-color="#007f76"
          data-text={cookieCopy[locale][0]}
          data-accept={cookieCopy[locale][1]}
          data-reject={cookieCopy[locale][2]}
          data-policy="https://famedtestprep.com/PrivacyPolicy"
          data-policy-label={cookieCopy[locale][3]}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <DiscoveryTracker />
        <PostHogInit />
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <BookPromoPopup />

        <Analytics />
      </body>
    </html>
  );
}
