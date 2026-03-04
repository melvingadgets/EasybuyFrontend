import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";
import previewImage from "@/IMG_1938 (1).png";
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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://aurapaytracker.vercel.app";
const DEFAULT_TITLE = "Melvin Gadgets | iPhone EasyBuy Nigeria";
const DEFAULT_DESCRIPTION =
  "Apply for iPhone EasyBuy in Nigeria. Clear phone pricing by capacity, weekly or monthly plans, and fast WhatsApp support.";

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
        url: previewImage.src,
        width: previewImage.width,
        height: previewImage.height,
        alt: "Melvin Gadgets EasyBuy iPhone application",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [previewImage.src],
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
