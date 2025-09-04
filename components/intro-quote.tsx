"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"

interface IntroQuoteProps {
  onComplete: () => void
}

export default function IntroQuote({ onComplete }: IntroQuoteProps) {
  const [displayText, setDisplayText] = useState("")
  const [showCursor, setShowCursor] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const quote = "Biết người biết ta, trăm trận trăm thắng."

  useEffect(() => {
    let currentIndex = 0
    const typingSpeed = 70

    const typeText = () => {
      if (currentIndex < quote.length) {
        setDisplayText(quote.slice(0, currentIndex + 1))
        currentIndex++
        setTimeout(typeText, typingSpeed)
      } else {
        setTimeout(() => {
          setShowCursor(false)
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.6,
            onComplete: onComplete,
          })
        }, 1200)
      }
    }

    setTimeout(typeText, 300)
  }, [onComplete, quote])

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="intro-quote text-4xl md:text-6xl text-primary">
          {displayText}
          {showCursor && <span className="typing-cursor">|</span>}
        </h1>
      </div>
    </div>
  )
}
