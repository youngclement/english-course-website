"use client"
import { ProgressiveBlur } from "@/components/ui/progressive-blur"
import { TimelineContent } from "@/components/ui/timeline-content"
import VerticalCutReveal from "@/components/ui/vertical-cut-reveal"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import { useRef } from "react"
import CourseRegistrationDialog from "./course-registration-dialog"
import ConsultationRegistrationDialog from "./consultation-registration-dialog"

const people = [
  {
    id: 1,
    name: "Nguyễn Minh Anh",
    designation: "Học viên khóa học",
    image: "/vietnamese-woman-smiling-professional.png",
  },
  {
    id: 2,
    name: "Trần Văn Hùng",
    designation: "Phụ huynh",
    image: "/vietnamese-man-professional.png",
  },
  {
    id: 3,
    name: "Lê Thị Mai",
    designation: "Giáo viên",
    image: "/vietnamese-woman-teacher.png",
  },
  {
    id: 4,
    name: "Phạm Đức Thành",
    designation: "Nhà quản lý",
    image: "/vietnamese-man-manager.png",
  },
]

export default function HeroSection() {
  const isMobile = useMediaQuery("(max-width: 992px)")
  const heroRef = useRef<HTMLDivElement>(null)

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.4,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  }

  const opacityVariants = {
    visible: (i: number) => ({
      opacity: 1,
      transition: {
        delay: i * 0.4,
        duration: 0.5,
      },
    }),
    hidden: {
      opacity: 0,
    },
  }

  return (
    <section className="min-h-screen relative pb-10 bg-cover bg-center bg-no-repeat bg-[#1e3a5f] pt-20" ref={heroRef}>
      {/* Background video with psychology theme */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <iframe
          src="https://www.youtube.com/embed/JrV6o1mrGO8?autoplay=1&mute=1&loop=1&playlist=JrV6o1mrGO8&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1"
          title="Psychology and Human Behavior Background Video"
          className="w-full h-full object-cover scale-[2.2] sm:scale-[2.0] md:scale-[1.5] lg:scale-[1.8] xl:scale-[1.6]"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
        {/* Video overlay for better text readability - increased opacity on mobile */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#1e3a5f]/75 via-[#2a4a6b]/65 to-[#1e3a5f]/75 md:from-[#1e3a5f]/60 md:via-[#2a4a6b]/50 md:to-[#1e3a5f]/60"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto xl:px-0 px-5">
        <article className="max-w-2xl text-white space-y-4 pt-14">
          {/* Metric Badge */}
          <TimelineContent
            as="div"
            animationNum={1}
            timelineRef={heroRef}
            customVariants={revealVariants}
            className="flex items-center space-x-3"
          >
            <span className="relative flex size-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#004976] opacity-75"></span>
              <span className="relative inline-flex size-4 rounded-full bg-[#004976]"></span>
            </span>
            <span className="sm:text-base text-sm">Khóa học độc quyền tại BHV English</span>
          </TimelineContent>

          {/* Main Headline */}
          <h1 className="sm:text-4xl text-2xl lg:text-5xl font-semibold leading-tight">
            <VerticalCutReveal
              splitBy="words"
              staggerDuration={0.15}
              staggerFrom="first"
              reverse={true}
              containerClassName="justify-start"
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 40,
                delay: 0.8,
              }}
            >
              KHÓA HỌC TÂM LÝ HỌC HÀNH VI & XÃ HỘI
            </VerticalCutReveal>
          </h1>

          <TimelineContent
            as="p"
            animationNum={2}
            timelineRef={heroRef}
            customVariants={revealVariants}
            className="sm:text-lg text-base text-white leading-relaxed max-w-3xl"
          >
            Khóa học Tâm Lý Học Hành Vi & Xã Hội là chương trình đào tạo đặc biệt và độc quyền tại BHV English, do thầy
            Huỳnh Chí Viễn – tác giả nhiều bài viết chuyên sâu về tâm lý tuổi thanh thiếu niên, nuôi dạy con và mối quan
            hệ xã hội – trực tiếp giảng dạy. Khóa học trang bị cho học viên khả năng hiểu đúng về tâm lý hành vi, phân
            tích các mối quan hệ, phát triển EQ và nuôi dạy con một cách khoa học.
          </TimelineContent>

          {/* CTA Button */}
          <TimelineContent
            as="div"
            animationNum={3}
            timelineRef={heroRef}
            customVariants={revealVariants}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <CourseRegistrationDialog
              buttonText="Đăng Ký Ngay"
              buttonVariant="default"
              buttonSize="lg"
              className="text-base px-6 bg-[#1e3a5f] text-white hover:bg-white/90 rounded-full"
              courseName="Khóa học Tâm Lý Học Hành Vi & Xã Hội"
            />
            <ConsultationRegistrationDialog
              buttonText="Tư Vấn Miễn Phí"
              buttonVariant="outline"
              buttonSize="lg"
              className="text-base px-6 border-white text-[#1e3a5f] hover:bg-white hover:text-[#1e3a5f] rounded-full"
            />
          </TimelineContent>
        </article>
      </div>

      {/* Progressive Blur */}
      <ProgressiveBlur className="pointer-events-none absolute bottom-0 left-0 h-[25%] w-full" blurIntensity={0.5} />
    </section>
  )
}
