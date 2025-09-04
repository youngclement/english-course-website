"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
}

export function GSAPAnimations() {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    // Fade in animations
    gsap.fromTo(
      ".gsap-fade-in",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: ".gsap-fade-in",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      },
    )

    // Slide in from left
    gsap.fromTo(
      ".gsap-slide-in-left",
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".gsap-slide-in-left",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      },
    )

    // Slide in from right
    gsap.fromTo(
      ".gsap-slide-in-right",
      { opacity: 0, x: 50 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".gsap-slide-in-right",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      },
    )

    // Scale in animations
    gsap.fromTo(
      ".gsap-scale-in",
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".gsap-scale-in",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      },
    )

    // Parallax effect for background elements
    gsap.utils.toArray(".parallax-bg").forEach((element: any) => {
      gsap.to(element, {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      })
    })
  }, [])

  return null
}
