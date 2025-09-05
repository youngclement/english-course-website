"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

export default function TestimonialsSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [desktopAutoIndex, setDesktopAutoIndex] = useState(0)
  const [isDesktopAutoPlaying, setIsDesktopAutoPlaying] = useState(true)
  const [isUserHovering, setIsUserHovering] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const testimonials = [
    {
      name: "Phạm Hoàng Như Ngọc",
      role: "Học viên khóa học",
      course: "Tâm Lý Học Hành Vi & Xã Hội",
      teacher: "Mr. Barry Huỳnh Chí Viễn",
      image: "https://bhvenglish.vn/wp-content/uploads/2023/05/Chi-Ngoc-nen-den-768x768.png",
      content: `Đầu tiên Ngọc xin trân trọng cảm ơn trung tâm BHV cùng bạn admin vui nhộn đặc biệt Thầy Viễn đã tổ chức và mở ra lớp Tâm Lý này. Tuy không phải học sinh siêng năng học đủ các buổi do sức khoẻ và nhiều việc riêng nhưng cũng giúp hiểu được phần nào của chính bản thân mình.`,
      benefits: [
        "Hiểu rõ tâm lý của chính bản thân mình để tự điều chỉnh và biết cách đối diện với khó khăn trong cuộc sống một cách tốt nhất có thể.",
        "Hiểu rõ những mối quan hệ nào lành mạnh để giúp đời sống tinh thần mình tốt hơn.",
        "Biết nhu cầu tâm sinh lý để có thể biết 'vẽ đường cho hươu chạy' trong cách giáo dục con.",
        "Biết chọn lọc và loại bỏ những mối quan hệ độc hại."
      ],
      rating: 5,
    },
    {
      name: "Ngô Triệu Hải Yến",
      role: "Học viên khóa học",
      course: "Tâm Lý Học Hành Vi & Xã Hội",
      teacher: "Mr. Barry Huỳnh Chí Viễn",
      image: "https://bhvenglish.vn/wp-content/uploads/2022/03/Ngo-Trieu-Hai-Yen.jpg",
      content: `Đã lâu rồi bạn Mèo mới đi học. Nếu các bạn tò mò già khú đế rồi còn học gì thì mình xin trả lời đó là lớp Tâm lý hành vi và xã hội do thầy Huỳnh Chí Viễn dạy. Học để hiểu về bản thân và con người nhiều hơn, tại sao khi đó họ lại hành xử như vậy, tại sao mình lúc ấy lại bột phát ra thế kia.`,
      highlight: "Thực sự nếu được học lớp của thầy sớm hơn 10 năm, cuộc đời em đã khác đi rất nhiều. Và em tin khi học xong lớp này thì em cũng khác, theo một chiều hướng rất tích cực và tràn đầy năng lượng tốt.",
      rating: 5,
    },
    
    {
      name: "Nguyễn Hải Bằng",
      role: "Học viên khóa học",
      course: "Tâm lý học hành vi & xã hội",
      teacher: "Mr. Barry Huỳnh Chí Viễn",
      image: "https://bhvenglish.vn/wp-content/uploads/2022/01/Nguyen-Hai-Bang.jpg",
      content: `Lớp tâm lý học của thầy là một lớp tuyệt vời nhất mà mình được học. Kiến thức thực tế, rất logic, dễ hiểu, cực kỳ hữu ích trong đời sống. Giúp người học hiểu mình, hiểu người, xây dựng các mối quan hệ tốt hơn và lành mạnh hơn.`,
      highlight: "Hy vọng tương lai sẽ có cơ hội học được tất cả lớp ở chỗ thầy. Mong trung tâm ngày càng lớn mạnh để góp phần cải thiện nhận thức của giới trẻ Việt Nam.",
      rating: 5,
    },
    {
      name: "Nguyễn Trương Thái Hà",
      role: "Học viên khóa học",
      course: "Tâm Lý Học Hành Vi & Xã Hội",
      teacher: "Mr. Barry Huỳnh Chí Viễn",
      image: "/nguyentruongthaiha-feedback.jpg",
      content: `Có nhiều khái niệm em có biết trước đây nhưng ở mức mơ hồ, hoặc bị nhầm lẫn giữa các khái niệm. Nhờ khóa học em đã có thể hiểu rõ hơn, có một kiến thức nền để lý giải, tìm hiểu rộng ra các vấn đề liên quan đến tâm lý và hành vi. Ví dụ: như khái niệm về bản năng, bản ngã, siêu bản ngã.`,
      highlight: "Càng học em càng cảm thấy em có lối suy nghĩ khá khác với số đông trong xã hội ở Việt Nam. Tuy nhiên, đó lại là những lối tư duy tích cực, tư duy tốt mà em đã tự học, tự tìm hiểu để phát triển bản thân.",
      benefits: [
        "Thầy dạy rất nhiệt tình, cung cấp kiến thức rất rõ ràng, dễ hiểu",
        "Luyện tập lối suy nghĩ, nhìn nhận vấn đề đa chiều hơn",
        "Hạn chế bị phiến diện, định kiến khi đứng trước vấn đề tranh luận",
        "Phù hợp với nhiều nhóm đối tượng và độ tuổi khác nhau"
      ],
      rating: 5,
    },
    {
      name: "Hoàng Thị Bảo Hiếu",
      role: "Học viên khóa học",
      course: "Tâm Lý Học Hành Vi & Xã Hội",
      teacher: "Mr. Barry Huỳnh Chí Viễn",
      image: "/hoangthibaohieu-feedback.jpg",
      content: `Tham gia khóa học Tâm Lý Hành Vi và Xã hội của thầy Viễn đã là một quyết định sáng suốt của em trong năm 2024. Sau khi trải qua một số chuyện không như ý đến với mình, em có nhận thức rằng bản thân cần cập nhật kiến thức, kỹ năng để mình có thể xử lý tốt các vấn đề đến với mình và khóa học đã giúp em làm được.`,
      highlight: "Suốt bốn tháng học cũng chính là khoảng thời gian bốn tháng mà bản thân em nhìn nhận lại bản thân mình, đối chiếu những kiến thức được học lên bản thân và cuộc sống của mình và dần dần đang có những thay đổi trong tư duy của em. Em tin việc thay đổi trong tư duy là bước đầu dẫn đến những thay đổi tích cực khác trong em và cuộc sống của em.",
      rating: 5,
    },
    {
      name: "Trần Lê Bảo Nhi",
      role: "Học viên khóa học",
      course: "Tâm Lý Học Hành Vi & Xã Hội",
      teacher: "Mr. Barry Huỳnh Chí Viễn",
      image: "/tranlebaonhi-feedback.jpg",
      content: `Thông qua khóa học này, em hiểu được tâm lý con người thông qua các khái niệm cơ bản về hành vi, cảm xúc, tư duy của con người. Hiểu nguồn gốc Tâm Lý học hành vi từ đâu ra. Kỹ năng giao tiếp cũng như nhận thức được phát triển EQ là một việc rất quan trọng trong mỗi con người.`,
      highlight: "Điều làm em bất ngờ trong khóa học là độ phức tạp trong tâm lý con người như suy nghĩ và hành động có thể vượt ngoài sự tưởng tượng. Tầm ảnh hưởng đến môi trường nhiều đến mức có thể ảnh hưởng đến tâm lý cá nhân.",
      benefits: [
        "Kỹ năng giải quyết vấn đề và tư duy phản biện",
        "Học và hiểu được suy nghĩ của hai giới",
        "Cách phát triển mối quan hệ bền vững",
        "Học được cách vượt qua sau mối quan hệ tan vỡ"
      ],
      rating: 5,
    },
  ]

  // Calculate positions along a gentler curve with maximum spacing
  const getCurvePosition = (index: number, total: number) => {
    // Create a gentler curve with much more spacing
    const progress = index / (total - 1) // 0 to 1
    const angle = progress * Math.PI // 0 to π

    // Gentler curve with maximum spacing: reduced curve height, increased spread
    const centerX = 0
    const maxHeight = 100 // Reduced height for gentler curve
    const spread = 400 // Much increased spread for maximum horizontal spacing

    const x = centerX + (progress - 0.5) * spread * 2
    const y = -maxHeight * Math.sin(angle) + 60 // Gentler curve

    return { x, y }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isAutoPlaying || !isVisible) return

    const interval = setInterval(() => {
      setCurrentSlide(prev => {
        const nextSlide = prev + 1
        return nextSlide >= testimonials.length ? 0 : nextSlide
      })
    }, 4000) // Chuyển slide sau mỗi 4 giây

    return () => clearInterval(interval)
  }, [isAutoPlaying, isVisible, testimonials.length])

  // Auto-play functionality for desktop feedback cards
  useEffect(() => {
    if (!isDesktopAutoPlaying || !isVisible || isUserHovering) return

    const desktopInterval = setInterval(() => {
      setDesktopAutoIndex(prev => {
        const nextIndex = prev + 1
        return nextIndex >= testimonials.length ? 0 : nextIndex
      })
    }, 5000) // Hiển thị feedback sau mỗi 5 giây

    return () => clearInterval(desktopInterval)
  }, [isDesktopAutoPlaying, isVisible, testimonials.length, isUserHovering])

  // Show desktop feedback automatically
  useEffect(() => {
    if (isDesktopAutoPlaying && isVisible && !isUserHovering) {
      setHoveredIndex(desktopAutoIndex)
      
      // Hide after 4 seconds, then wait 1 second before showing next
      const hideTimeout = setTimeout(() => {
        setHoveredIndex(null)
      }, 4000)

      return () => clearTimeout(hideTimeout)
    }
  }, [desktopAutoIndex, isDesktopAutoPlaying, isVisible, isUserHovering])

  // Pause auto-play when user interacts
  const handleManualNavigation = (newSlide: number) => {
    setCurrentSlide(newSlide)
    setIsAutoPlaying(false)
    
    // Resume auto-play after 10 seconds of no interaction
    setTimeout(() => {
      setIsAutoPlaying(true)
    }, 10000)
  }

  // Handle desktop hover
  const handleDesktopHover = (index: number) => {
    setHoveredIndex(index)
    setIsUserHovering(true)
    setIsDesktopAutoPlaying(false)
    
    // Clear any existing timeout
    if (autoPlayTimeoutRef.current) {
      clearTimeout(autoPlayTimeoutRef.current)
      autoPlayTimeoutRef.current = null
    }
  }

  const handleDesktopHoverEnd = () => {
    setHoveredIndex(null)
    setIsUserHovering(false)
    
    // Resume auto-play after 3 seconds of no hover interaction
    autoPlayTimeoutRef.current = setTimeout(() => {
      setIsDesktopAutoPlaying(true)
    }, 3000)
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current)
      }
    }
  }, [])

  return (
    <section ref={sectionRef} className="py-12 md:py-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 md:w-80 md:h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 md:w-80 md:h-80 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-8 md:mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-balance mb-3 md:mb-4 text-gray-900">
            Học Viên <span className="text-primary">Nói Gì</span> Về Khóa Học
          </h2>
          <p className="text-base md:text-lg text-gray-600 text-pretty max-w-2xl mx-auto">
            Những chia sẻ chân thực từ học viên đã trải nghiệm khóa học Tâm Lý Học Hành Vi & Xã Hội
          </p>
        </motion.div>

        {/* Rainbow Curve Container - Desktop Only */}
        <div className="hidden lg:flex relative h-[900px] lg:h-[1000px] items-center justify-center">
          {/* SVG Curve Path */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 800 600"
            preserveAspectRatio="none"
          >
            <path
              d="M 100 400 Q 400 320 700 400"
              stroke="url(#rainbowGradient)"
              strokeWidth="3"
              fill="none"
              opacity="0.4"
              className="animate-pulse"
              strokeDasharray="8,4"
            />
            <defs>
              <linearGradient id="rainbowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="20%" stopColor="#8B5CF6" />
                <stop offset="40%" stopColor="#EC4899" />
                <stop offset="60%" stopColor="#F59E0B" />
                <stop offset="80%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
          </svg>

          {/* Floating Student Images */}
          {testimonials.map((testimonial, index) => {
            const position = getCurvePosition(index, testimonials.length)
            const delay = index * 0.15

            return (
              <motion.div
                key={index}
                className="absolute group cursor-pointer"
                style={{
                  left: `calc(50% + ${position.x}px)`,
                  top: `calc(50% + ${position.y}px)`,
                }}
                initial={{
                  opacity: 0,
                  scale: 0,
                  y: 50
                }}
                animate={isVisible ? {
                  opacity: 1,
                  scale: 1,
                  y: 0
                } : {
                  opacity: 0,
                  scale: 0,
                  y: 50
                }}
                transition={{
                  duration: 0.8,
                  delay: delay,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{
                  scale: 1.1,
                  zIndex: 50
                }}
                onHoverStart={() => handleDesktopHover(index)}
                onHoverEnd={handleDesktopHoverEnd}
              >
                {/* Student Image */}
                <div className="relative">
                  <motion.div
                    className="w-20 h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden border-4 border-white shadow-2xl hover:shadow-primary/30 transition-shadow duration-300"
                    animate={{
                      y: [0, -8, 0],
                      rotateY: [0, 3, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: delay,
                      ease: "easeInOut"
                    }}
                    whileHover={{
                      boxShadow: "0 20px 40px -12px rgba(59, 130, 246, 0.25)"
                    }}
                  >
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>

                  {/* Floating Stars */}
                  <motion.div
                    className="absolute -top-2 -right-2 bg-yellow-400 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg"
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: delay,
                    }}
                  >
                    <Star className="w-3 h-3 fill-current" />
                  </motion.div>
                </div>

                {/* Hover Comment Card */}
                <AnimatePresence>
                  {hoveredIndex === index && (
                    <motion.div
                      className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 w-80 lg:w-96 z-50"
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
                        <CardContent className={`${testimonial.name === "Phạm Hoàng Như Ngọc"
                          ? "p-3"
                          : "p-4"
                          }`}>
                          <div className={`flex items-start gap-3 ${testimonial.name === "Phạm Hoàng Như Ngọc"
                            ? "mb-2"
                            : "mb-3"
                            }`}>
                            <Quote className={`text-primary/60 flex-shrink-0 mt-1 ${testimonial.name === "Phạm Hoàng Như Ngọc"
                              ? "w-4 h-4"
                              : "w-5 h-5"
                              }`} />
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900 mb-1 text-xs md:text-sm">
                                {testimonial.name}
                              </h4>
                              <p className="text-gray-600 mb-1 text-xs">
                                {testimonial.course}
                              </p>
                            </div>
                          </div>

                          <p className="text-gray-700 leading-relaxed text-xs mb-2">
                            {testimonial.content}
                          </p>

                          {testimonial.benefits && (
                            <div className="bg-primary/5 rounded-lg p-2 mb-2">
                              <h5 className="font-semibold text-primary mb-1 text-xs">Những điều lợi ích khi học:</h5>
                              <ul className="space-y-1">
                                {testimonial.benefits.map((benefit, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <span className="text-primary font-bold text-xs flex-shrink-0 mt-0.5">•</span>
                                    <span className="leading-relaxed text-xs">{benefit}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {testimonial.highlight && (
                            <blockquote className="border-l-3 border-primary/40 italic text-primary/80 font-medium leading-relaxed text-xs pl-2 mb-2">
                              "{testimonial.highlight}"
                            </blockquote>
                          )}

                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} className="text-yellow-400 fill-current w-3 h-3" />
                              ))}
                            </div>
                            <span className="text-gray-600 text-xs">
                              {testimonial.rating}/5 sao
                            </span>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Arrow pointing down */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white/95"></div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        {/* Traditional Testimonials Layout - Mobile & Tablet */}
        <div className="lg:hidden">
          {/* Mobile Carousel Container */}
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-2">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <CardContent className="p-4 md:p-6">
                        {/* Header with Image and Info */}
                        <div className="flex items-start gap-3 md:gap-4 mb-4">
                          <div className="relative flex-shrink-0">
                            <Image
                              src={testimonial.image}
                              alt={testimonial.name}
                              width={64}
                              height={64}
                              className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-3 border-white shadow-lg"
                            />
                            <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-white rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center">
                              <Star className="w-2.5 h-2.5 md:w-3 md:h-3 fill-current" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-base md:text-lg text-gray-900 mb-1">
                              {testimonial.name}
                            </h4>
                            <p className="text-sm md:text-base text-gray-600 mb-1">
                              {testimonial.course}
                            </p>
                            <p className="text-xs md:text-sm text-primary font-medium">
                              {testimonial.teacher}
                            </p>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="space-y-3 md:space-y-4">
                          <div className="flex items-start gap-2">
                            <Quote className="w-4 h-4 md:w-5 md:h-5 text-primary/40 flex-shrink-0 mt-1" />
                            <p className={`leading-relaxed ${testimonial.name === "Phạm Hoàng Như Ngọc"
                              ? "text-xs md:text-sm text-gray-700"
                              : "text-sm md:text-base text-gray-700"
                              }`}>
                              {testimonial.content}
                            </p>
                          </div>

                          {testimonial.benefits && (
                            <div className="bg-primary/5 p-3 md:p-4 rounded-lg">
                              <h5 className={`font-semibold text-primary mb-2 md:mb-3 ${testimonial.name === "Phạm Hoàng Như Ngọc"
                                ? "text-xs md:text-sm"
                                : "text-sm md:text-base"
                                }`}>Những điều lợi ích khi học:</h5>
                              <ul className="space-y-1.5 md:space-y-2">
                                {testimonial.benefits.map((benefit, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <span className="text-primary font-bold text-xs flex-shrink-0 mt-0.5">•</span>
                                    <span className={`leading-relaxed ${testimonial.name === "Phạm Hoàng Như Ngọc"
                                      ? "text-xs md:text-sm"
                                      : "text-sm md:text-base"
                                      }`}>{benefit}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {testimonial.highlight && (
                            <blockquote className={`border-l-4 border-primary/30 italic text-primary/80 font-medium leading-relaxed ${testimonial.name === "Phạm Hoàng Như Ngọc"
                              ? "text-xs md:text-sm pl-2 md:pl-3"
                              : "text-sm md:text-base pl-3 md:pl-4"
                              }`}>
                              "{testimonial.highlight}"
                            </blockquote>
                          )}

                          {/* Rating */}
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} className={`text-yellow-400 fill-current ${testimonial.name === "Phạm Hoàng Như Ngọc"
                                  ? "w-3 h-3 md:w-4 md:h-4"
                                  : "w-4 h-4 md:w-5 md:h-5"
                                  }`} />
                              ))}
                            </div>
                            <span className={`text-gray-600 ${testimonial.name === "Phạm Hoàng Như Ngọc"
                              ? "text-xs md:text-sm"
                              : "text-sm md:text-base"
                              }`}>
                              {testimonial.rating}/5 sao
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Navigation Controls - Reduced spacing */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleManualNavigation(Math.max(0, currentSlide - 1))}
                disabled={currentSlide === 0}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors shadow-lg"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => handleManualNavigation(Math.min(testimonials.length - 1, currentSlide + 1))}
                disabled={currentSlide === testimonials.length - 1}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors shadow-lg"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Dots Indicator */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleManualNavigation(index)}
                  className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-primary' : 'bg-gray-300 hover:bg-primary/60'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>


      </div>
    </section>
  )
}
