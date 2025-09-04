import type React from "react"
import type { Metadata } from "next"
import { Inter, Qwigley } from "next/font/google"
import "./globals.css"
import ClientLayout from "./ClientLayout"

const averta = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-averta",
  fallback: ["system-ui", "sans-serif"],
})

const qwigley = Qwigley({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-qwigley",
})

export const metadata: Metadata = {
  title: "Khóa Học Tâm Lý Học Hành Vi & Xã Hội - Thầy Huỳnh Chí Viễn",
  description:
    "Khóa học Tâm Lý Học Hành Vi & Xã Hội chuyên sâu, giúp bạn hiểu rõ tâm lý con người và ứng dụng trong cuộc sống, công việc và nuôi dạy con.",
  generator: "v0.app",
  applicationName: "BHV English",
  authors: [
    {
      name: "BHV English",
      url: "https://bhvenglish.vn",
    },
  ],
  creator: "BHV English",
  publisher: "BHV English",
  keywords: [
    "tâm lý học",
    "hành vi xã hội",
    "Huỳnh Chí Viễn",
    "BHV English",
    "khóa học tâm lý",
    "nuôi dạy con",
    "phát triển bản thân",
    "EQ",
    "tâm lý trẻ em",
    "mối quan hệ",
  ],
  icons: {
    icon: [
      {
        url: "/bhv-english-log  o-transparent.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/bhv-english-logo-transparent.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/bhv-english-logo-transparent.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/bhv-english-logo-transparent.png",
      },
    ],
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://bhvenglish.vn",
    siteName: "BHV English",
    title: "Khóa Học Tâm Lý Học Hành Vi & Xã Hội - Thầy Huỳnh Chí Viễn",
    description:
      "Khóa học Tâm Lý Học Hành Vi & Xã Hội chuyên sâu, giúp bạn hiểu rõ tâm lý con người và ứng dụng trong cuộc sống, công việc và nuôi dạy con.",
    images: [
      {
        url: "/bhv-english-logo-transparent.png",
        width: 1200,
        height: 630,
        alt: "BHV English - Khóa Học Tâm Lý Học Hành Vi & Xã Hội",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Khóa Học Tâm Lý Học Hành Vi & Xã Hội - Thầy Huỳnh Chí Viễn",
    description:
      "Khóa học Tâm Lý Học Hành Vi & Xã Hội chuyên sâu, giúp bạn hiểu rõ tâm lý con người và ứng dụng trong cuộc sống, công việc và nuôi dạy con.",
    images: ["/bhv-english-logo-transparent.png"],
    creator: "@bhvenglish",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code", // Thay thế bằng mã verification thực tế
  },
  manifest: "/manifest.json",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className={`${averta.variable} ${qwigley.variable}`}>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
