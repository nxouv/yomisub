import type { Metadata, Viewport } from "next";
import "./globals.css";
import { FontPreloader } from "@/components/FontPreloader";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "YomiSub: OBSで使えるリアルタイム字幕ツール",
  description:
    "無料ですぐ使える配信字幕ツール。声をリアルタイムで英語字幕に変換します。OBSにURLを貼るだけで使えます。",
  authors: [{ name: "なな太郎", url: "https://x.com/nxouv" }],
  creator: "なな太郎",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "/",
    title: "YomiSub: OBSで使えるリアルタイム字幕ツール",
    description:
      "無料ですぐ使える配信字幕ツール。声をリアルタイムで英語字幕に変換します。OBSにURLを貼るだけで使えます。",
    siteName: "YomiSub",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "YomiSub: OBSで使えるリアルタイム字幕ツール",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "YomiSub: OBSで使えるリアルタイム字幕ツール",
    description:
      "無料ですぐ使える配信字幕ツール。声をリアルタイムで英語字幕に変換します。OBSにURLを貼るだけで使えます。",
    creator: "@nxouv",
    images: ["/icon.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "YomiSub",
  alternateName: "よみさぶ",
  description:
    "無料ですぐ使える配信字幕ツール。声をリアルタイムで英語字幕に変換します。OBSにURLを貼るだけで使えます。",
  url: siteUrl,
  applicationCategory: "Multimedia",
  operatingSystem: "Web Browser",
  author: {
    "@type": "Person",
    name: "なな太郎",
    sameAs: "https://x.com/nxouv",
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "JPY",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {children}
        <FontPreloader />
      </body>
    </html>
  );
}
