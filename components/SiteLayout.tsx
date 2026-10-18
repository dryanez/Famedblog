import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import DiscoveryTracker from "@/components/DiscoveryTracker";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookPromoPopup from "@/components/BookPromoPopup";

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

export default function SiteLayout({
  children, locale = 'en',
}: Readonly<{
  children: React.ReactNode; locale?: 'en'|'ar';
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
        inLanguage: ["en", "ar"],
        publisher: { "@id": `${siteUrl}/#organization` },
      },
    ],
  };

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <DiscoveryTracker />
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <BookPromoPopup />
      </body>
    </html>
  );
}
