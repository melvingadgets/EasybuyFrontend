import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";
import "./globals.css";
import { ToasterProvider } from "@/components/ToasterProvider";
import { GlobalLoadingOverlay } from "@/components/GlobalLoadingOverlay";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://easybuy-frontend-bbox.vercel.app";
const OG_IMAGE_PATH = "/og";
const DEFAULT_TITLE = "Own an iPhone Today — Pay Weekly or Monthly | Melvin Gadgets";
const DEFAULT_DESCRIPTION =
  "No full payment needed. Pick your iPhone model, choose a plan that fits your budget, and apply in minutes. Trusted by Nigerians.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: "%s | Melvin Gadgets",
  },
  description: DEFAULT_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    siteName: "Melvin Gadgets",
    locale: "en_NG",
    type: "website",
    images: [
      {
        url: OG_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: "Melvin Gadgets — Own an iPhone on EasyBuy. Weekly & monthly plans available.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [OG_IMAGE_PATH],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${sora.variable} antialiased`}>
        <GlobalLoadingOverlay minDurationMs={150} />
        <ToasterProvider />
        {children}
      </body>
    </html>
  );
}
