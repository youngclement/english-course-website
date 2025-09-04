"use client"

import { useEffect, useRef } from "react"
import { ChevronUp } from "lucide-react"
import { gsap } from "gsap"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"

gsap.registerPlugin(ScrollToPlugin)

export default function ScrollToTop() {
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const button = buttonRef.current
    if (!button) return

    gsap.set(button, { opacity: 0, scale: 0.8, pointerEvents: "none" })

    const handleScroll = () => {
      const scrollY = window.scrollY

      if (scrollY > 300) {
        gsap.to(button, {
          opacity: 1,
          scale: 1,
          pointerEvents: "auto",
          duration: 0.3,
          ease: "back.out(1.7)",
        })
      } else {
        gsap.to(button, {
          opacity: 0,
          scale: 0.8,
          pointerEvents: "none",
          duration: 0.3,
          ease: "power2.out",
        })
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    gsap.to(window, {
      duration: 1.5,
      scrollTo: { y: 0 },
      ease: "power2.out",
    })
  }

  return (
    <button
      ref={buttonRef}
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 bg-primary text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
      aria-label="Scroll to top"
    >
      <ChevronUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform duration-300" />
    </button>
  )
}
