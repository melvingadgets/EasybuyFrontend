import type { Metadata } from "next";

const OG_IMAGE_PATH = "/og-image.png";

const APPLY_TITLE = "IPHONE EASYBUY APPLICATION FORM";
const APPLY_DESCRIPTION =
  "Apply for iPhone EasyBuy in Nigeria. Choose your model and capacity, pick a payment plan, and get quick WhatsApp support.";

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
        alt: "Melvin Gadgets iPhone EasyBuy application form",
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
