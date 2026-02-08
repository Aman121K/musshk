import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VisitorTracker from "@/components/VisitorTracker";
import CartDrawer from "@/components/CartDrawer";
import { SITE_URL, SITE_NAME, SITE_DEFAULT_DESCRIPTION, SITE_DEFAULT_OG_IMAGE } from "@/lib/site";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

const fullOgImage = SITE_URL + SITE_DEFAULT_OG_IMAGE;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Luxury Inspired Fragrances`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DEFAULT_DESCRIPTION,
  keywords: [
    "Musshk",
    "luxury fragrances",
    "inspired perfumes",
    "perfume India",
    "buy perfume online",
    "niche perfumes",
    "best seller perfumes",
    "new arrival fragrances",
    "for her",
    "for him",
    "free shipping India",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Luxury Inspired Fragrances`,
    description: SITE_DEFAULT_DESCRIPTION,
    images: [{ url: fullOgImage, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Luxury Inspired Fragrances`,
    description: SITE_DEFAULT_DESCRIPTION,
    images: [fullOgImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  verification: {
    // Add your verification codes when you have them (Google Search Console, Bing, etc.)
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
  icons: {
    icon: [{ url: "/logo/musshk.png", type: "image/png", sizes: "any" }],
    apple: "/logo/musshk.png",
  },
  alternates: { canonical: SITE_URL },
};

const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo/musshk.png`,
  description: SITE_DEFAULT_DESCRIPTION,
  sameAs: [],
};

const jsonLdWebsite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DEFAULT_DESCRIPTION,
  publisher: { "@type": "Organization", name: SITE_NAME, logo: { "@type": "ImageObject", url: `${SITE_URL}/logo/musshk.png` } },
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
        />
      </head>
      <body className={outfit.className}>
        <VisitorTracker />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}

