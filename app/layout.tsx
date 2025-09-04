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
