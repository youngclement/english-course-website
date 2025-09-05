"use client"

import BookCoverSection from "@/components/book-cover-section"
import CoursesSection from "@/components/courses-section"
import CourseHighlightSection from "@/components/course-highlight-section"
import CTASection from "@/components/cta-section"
import FeaturesSection from "@/components/features-section"
import Footer from "@/components/footer"
import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import InstructorSection from "@/components/instructor-section"
import IntroQuote from "@/components/intro-quote"
import PsychologyWorkshopSection from "@/components/psychology-workshop-section"
import TestimonialsSection from "@/components/testimonials-section"
import { useState } from "react"

export default function HomePage() {
  const [showIntro, setShowIntro] = useState(true)

  const handleIntroComplete = () => {
    setShowIntro(false)
  }

  return (
    <>
      {showIntro && <IntroQuote onComplete={handleIntroComplete} />}

      <main className={`min-h-screen ${showIntro ? "opacity-0" : "animate-fade-in"}`}>
        <Header />

        <HeroSection />

        <PsychologyWorkshopSection />
        
        <CourseHighlightSection />
        
        <div className="bg-[#F9F9F9]">
          <FeaturesSection />
        </div>

       

        <div className="bg-[#F9F9F9]">
          <CoursesSection />
        </div>

        <InstructorSection />

        <div className="bg-[#F9F9F9]">
          <BookCoverSection />
        </div>
        <TestimonialsSection />

        <CTASection />
        <Footer />
      </main>
    </>
  )
}
