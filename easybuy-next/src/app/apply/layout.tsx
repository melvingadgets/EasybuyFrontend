import type { Metadata } from "next";

const OG_IMAGE_PATH = "/og";

const APPLY_TITLE = "Apply for iPhone EasyBuy — Flexible Plans, No Full Payment | Melvin Gadgets";
const APPLY_DESCRIPTION =
  "Own any iPhone with a weekly or monthly payment plan. Select your model, pick your budget, and apply in under 2 minutes. Fast WhatsApp support.";

export const metadata: Metadata = {
  title: APPLY_TITLE,
  description: APPLY_DESCRIPTION,
  alternates: {
    canonical: "/apply",
  },
  openGraph: {
    title: APPLY_TITLE,
    description: APPLY_DESCRIPTION,
    url: "/apply",
    siteName: "Melvin Gadgets",
    locale: "en_NG",
    type: "website",
    images: [
      {
        url: OG_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: "Melvin Gadgets — Apply for iPhone EasyBuy. Flexible weekly and monthly plans.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: APPLY_TITLE,
    description: APPLY_DESCRIPTION,
    images: [OG_IMAGE_PATH],
  },
};

export default function ApplyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
