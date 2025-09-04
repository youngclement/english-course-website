"use client"

import { Clock, Users, Calendar, Video } from "lucide-react"

export default function CourseInfoSection() {
  const courseInfo = [
    {
      icon: Video,
      title: "Hình thức học",
      description: "Học Online trên nền tảng Zoom bằng tiếng Việt",
    },
    {
      icon: Users,
      title: "Đối tượng",
      description: "Học viên từ 18 tuổi trở lên quan tâm đến việc hiểu và cải thiện bản thân",
    },
    {
      icon: Clock,
      title: "Thời lượng",
      description: "72 giờ / 48 buổi / 1.5 giờ mỗi buổi",
    },
    {
      icon: Calendar,
      title: "Thời gian hoàn thành",
      description: "4 tháng với lịch học linh hoạt",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Thông Tin Khóa Học</h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Khóa học được thiết kế phù hợp với người học bận rộn, muốn nâng cao kiến thức tâm lý một cách khoa học và
            thực tiễn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {courseInfo.map((info, index) => {
            const IconComponent = info.icon
            return (
              <div
                key={index}
                className="text-center p-6 md:p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 bg-[#004976] rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 md:mb-3">{info.title}</h3>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">{info.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
