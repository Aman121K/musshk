import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VisitorTracker from "@/components/VisitorTracker";
import CartDrawer from "@/components/CartDrawer";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Musshk | Luxury Inspired Fragrances",
  description: "Premium quality fragrances at affordable prices. Free shipping across India on all orders.",
  icons: {
    icon: [
      { url: '/logo/musshk.png', type: 'image/png', sizes: 'any' },
    ],
    apple: '/logo/musshk.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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

