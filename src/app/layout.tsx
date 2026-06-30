import type { Metadata } from "next";
import localFont from "next/font/local";
import { Cairo } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import {
  SITE_URL,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  CONTACT_EMAIL,
  CONTACT_PHONE,
} from "@/lib/site";

const godber = localFont({
  src: "../assets/fonts/godber/Godber.ttf",
  variable: "--font-godber",
  display: "swap",
});

const kollektif = localFont({
  src: [
    {
      path: "../assets/fonts/kollektif/Kollektif.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/kollektif/Kollektif-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../assets/fonts/kollektif/Kollektif-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../assets/fonts/kollektif/Kollektif-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-kollektif",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Creative Content Agency | Video, Design & Social`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "Creative Agency",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — ${SITE_TAGLINE}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: ["/og.jpg"],
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      alternateName: "CreatorsHub",
      url: SITE_URL,
      logo: `${SITE_URL}/og.jpg`,
      image: `${SITE_URL}/og.jpg`,
      description: SITE_DESCRIPTION,
      slogan: SITE_TAGLINE,
      email: CONTACT_EMAIL,
      telephone: CONTACT_PHONE,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Cairo",
        addressCountry: "EG",
      },
      areaServed: "Worldwide",
      knowsAbout: [
        "Video production",
        "Video editing",
        "YouTube thumbnails",
        "Social media management",
        "Branding and identity",
        "Motion graphics",
        "Event content",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: CONTACT_PHONE,
        email: CONTACT_EMAIL,
        contactType: "customer service",
        areaServed: "Worldwide",
        availableLanguage: ["English", "Arabic"],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en",
    },
    {
      "@type": "ProfessionalService",
      name: SITE_NAME,
      image: `${SITE_URL}/og.jpg`,
      url: SITE_URL,
      telephone: CONTACT_PHONE,
      email: CONTACT_EMAIL,
      priceRange: "$$",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Cairo",
        addressCountry: "EG",
      },
      areaServed: "Worldwide",
      makesOffer: [
        "Video Production",
        "Design & Visuals",
        "Social Media Management",
        "Branding & Identity",
        "Event Content",
      ].map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s },
      })),
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${godber.variable} ${kollektif.variable} ${cairo.variable} font-en`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}