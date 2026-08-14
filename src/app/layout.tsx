import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "JHXTES — Information Technology Solutions | Digital Transformation Partner",
  description: "Enterprise surveillance, structured cabling, IP networking, unified communications, fire detection, access control, and managed IT services across the Philippines.",
  keywords: [
    "JHXTES",
    "IT Solutions Philippines",
    "CCTV Surveillance",
    "Structured Cabling Cat6 Fiber",
    "Network Security IP Radio",
    "AI Vision ANPR",
    "Access Control FDAS",
    "Managed IT Services Tarlac"
  ],
  authors: [{ name: "JHXTES IT Solutions" }],
  openGraph: {
    title: "JHXTES IT Solutions — Architecture, Security & Managed Services",
    description: "Design → Build → Operate → Transfer digital transformation framework.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable} dark scroll-smooth`}>
      <body className="bg-[#0e0914] text-gray-100 antialiased min-h-screen flex flex-col font-sans">
        <SmoothScrollProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
