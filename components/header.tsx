"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Phone, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import CourseRegistrationDialog from "./course-registration-dialog"
import ConsultationRegistrationDialog from "./consultation-registration-dialog"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      if (y < 100) {
        setIsVisible(true)
        setIsScrolled(false)
      } else {
        setIsScrolled(true)
        setIsVisible(y <= lastScrollY)
      }
      setLastScrollY(y)
    }
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [lastScrollY])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 transition-all duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"
          } ${isScrolled ? "z-[100] bg-white/95 backdrop-blur-md shadow-lg" : "z-[100] bg-white/90 backdrop-blur-sm"}`}
      >
        <div className="container mx-auto px-4 md:px-8 lg:px-28">
          {/* ===== Desktop (>= md) ===== */}
          <div className="hidden md:flex items-center justify-between h-[100px]">
            {/* Logo 80x80 */}
            <a href="https://bhvenglish.vn" className="flex items-center">
              <img
                src="https://bhvenglish.vn/wp-content/uploads/2024/08/BHV-logo-page.jpg"
                alt="BHV English Logo"
                className="w-[80px] h-[80px] object-contain"
              />
            </a>

            {/* Cụm hotline: khối phone 70x70 + số ở bên phải */}
            {/* <div className="flex items-center gap-4">
              <div
                className={`w-[70px] h-[70px] rounded-full flex items-center justify-center`}
              >
                <Phone
                  className={`${isScrolled ? "text-[#074165]" : "text-white"} w-9 h-9`}
                  strokeWidth={2.25}
                />
              </div>
              <span
                className={`font-bold tracking-wide ${isScrolled ? "text-[#074165]" : "text-white"
                  } text-base`}
              >
                0933 60 90 30 – 093 94 808 94
              </span>
            </div> */}

            {/* Nút Đăng ký + social có màu */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <CourseRegistrationDialog
                  buttonText="Đăng ký khóa học"
                  buttonVariant="default"
                  buttonSize="default"
                  className="rounded-full px-6 py-3 text-sm font-semibold bg-[#074165] text-white hover:bg-[#063754]"
                />
                
                <ConsultationRegistrationDialog
                  buttonText="Tư vấn miễn phí"
                  buttonVariant="outline"
                  buttonSize="default"
                  className="rounded-full px-6 py-3 text-sm font-semibold border-[#074165] text-[#074165] hover:bg-[#074165] hover:text-white"
                />
              </div>

              <div className="flex items-center gap-3">
                <a
                  aria-label="Facebook"
                  href="https://www.facebook.com/bhvenglish"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-[#3b5998] hover:opacity-90 transition"
                >
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22 12.06C22 6.49 17.52 2 11.94 2 6.37 2 1.88 6.49 1.88 12.06c0 5.03 3.68 9.2 8.49 10.01v-7.08H7.99v-2.93h2.38V9.74c0-2.35 1.4-3.65 3.55-3.65 1.03 0 2.1.18 2.1.18v2.31h-1.18c-1.16 0-1.52.72-1.52 1.46v1.76h2.58l-.41 2.93h-2.17v7.08C18.32 21.26 22 17.09 22 12.06z" />
                  </svg>
                </a>

                <a
                  aria-label="Website"
                  href="https://bhvenglish.vn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-[#f59e0b] hover:opacity-90 transition"
                >
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm7.06 9h-3.1a15.6 15.6 0 00-1.2-5.01A8.03 8.03 0 0119.06 11zM12 4c.88 0 2.33 2.08 2.86 6H9.14C9.67 6.08 11.12 4 12 4zM7.24 6.99A15.6 15.6 0 006.04 11h-3.1a8.03 8.03 0 014.3-4.01zM2.94 13h3.1c.24 1.8.7 3.5 1.2 5.01A8.03 8.03 0 012.94 13zm6.2 0h5.72c-.53 3.92-1.98 6-2.86 6s-2.33-2.08-2.86-6zm7.86 0h3.1a8.03 8.03 0 01-4.3 4.01c.5-1.51.96-3.21 1.2-5.01z" />
                  </svg>
                </a>

                <a
                  aria-label="YouTube"
                  href="https://www.youtube.com/@bhvenglish4475"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-[#dc2626] hover:opacity-90 transition"
                >
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.5 6.2a3 3 0 00-2.12-2.13C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.52A3 3 0 00.5 6.2C0 8.07 0 12 0 12s0 3.93.5 5.81a3 3 0 002.12 2.13C4.5 20.48 12 20.48 12 20.48s7.5 0 9.38-.52a3 3 0 002.12-2.13C24 15.93 24 12 24 12s0-3.93-.5-5.8zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* ===== Mobile (< md) – giữ 70px cho gọn như trước ===== */}
          <div className="md:hidden flex items-center justify-between h-[70px]">
            <img
              src="https://bhvenglish.vn/wp-content/uploads/2024/08/BHV-logo-page.jpg"
              alt="BHV English Logo"
              className="w-[50px] h-[50px] object-contain"
            />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-800 hover:text-primary transition-colors z-[101] relative p-2 rounded-lg bg-white/80 backdrop-blur-sm shadow-sm border border-gray-200/50"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu (tuỳ chọn giữ như cũ) */}
        <div className={`md:hidden bg-white border-t shadow-lg relative z-[100] transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen
          ? 'max-h-96 opacity-100 translate-y-0'
          : 'max-h-0 opacity-0 -translate-y-4'
          }`}>
          <div className="container mx-auto px-4 py-5 space-y-4">
            <div className="flex items-center gap-3 text-[#074165]">
              <Phone className="w-6 h-6" />
              <span className="font-semibold">0933 60 90 30 – 093 94 808 94</span>
            </div>
            
            <div className="space-y-3">
              <CourseRegistrationDialog
                buttonText="Đăng ký khóa học"
                buttonVariant="default"
                buttonSize="default"
                className="w-full rounded-full px-6 py-6 bg-[#074165] text-white hover:bg-[#063754]"
              />
              
              <ConsultationRegistrationDialog
                buttonText="Tư vấn miễn phí"
                buttonVariant="outline"
                buttonSize="default"
                className="w-full rounded-full px-6 py-6 border-[#074165] text-[#074165] hover:bg-[#074165] hover:text-white"
              />
            </div>
            
            <div className="flex justify-center gap-4 pt-1">
              <a aria-label="Facebook" href="https://www.facebook.com/bhvenglish" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center bg-[#3b5998] hover:opacity-90 transition">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 12.06C22 6.49 17.52 2 11.94 2 6.37 2 1.88 6.49 1.88 12.06c0 5.03 3.68 9.2 8.49 10.01v-7.08H7.99v-2.93h2.38V9.74c0-2.35 1.4-3.65 3.55-3.65 1.03 0 2.1.18 2.1.18v2.31h-1.18c-1.16 0-1.52.72-1.52 1.46v1.76h2.58l-.41 2.93h-2.17v7.08C18.32 21.26 22 17.09 22 12.06z" />
                </svg>
              </a>
              <a aria-label="Website" href="https://bhvenglish.vn" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center bg-[#f59e0b] hover:opacity-90 transition">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm7.06 9h-3.1a15.6 15.6 0 00-1.2-5.01A8.03 8.03 0 0119.06 11zM12 4c.88 0 2.33 2.08 2.86 6H9.14C9.67 6.08 11.12 4 12 4zM7.24 6.99A15.6 15.6 0 006.04 11h-3.1a8.03 8.03 0 014.3-4.01zM2.94 13h3.1c.24 1.8.7 3.5 1.2 5.01A8.03 8.03 0 012.94 13zm6.2 0h5.72c-.53 3.92-1.98 6-2.86 6s-2.33-2.08-2.86-6zm7.86 0h3.1a8.03 8.03 0 01-4.3 4.01c.5-1.51.96-3.21 1.2-5.01z" />
                </svg>
              </a>
              <a aria-label="YouTube" href="https://www.youtube.com/@bhvenglish4475" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center bg-[#dc2626] hover:opacity-90 transition">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.5 6.2a3 3 0 00-2.12-2.13C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.52A3 3 0 00.5 6.2C0 8.07 0 12 0 12s0 3.93.5 5.81a3 3 0 002.12 2.13C4.5 20.48 12 20.48 12 20.48s7.5 0 9.38-.52a3 3 0 002.12-2.13C24 15.93 24 12 24 12s0-3.93-.5-5.8zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
