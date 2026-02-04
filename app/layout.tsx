import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VisitorTracker from "@/components/VisitorTracker";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Musshk | Luxury Inspired Fragrances",
  description: "Premium quality fragrances at affordable prices. Free shipping across India on all orders.",
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <VisitorTracker />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

