"use client"

import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import type React from "react"
import { GSAPAnimations } from "@/components/gsap-animations"
import ScrollToTop from "@/components/scroll-to-top"
import { Toaster } from "@/components/ui/toaster"

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      <GSAPAnimations />
      <ScrollToTop />
      <Analytics />
      <Toaster />
    </>
  )
}
