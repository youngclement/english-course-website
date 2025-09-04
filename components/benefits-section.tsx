"use client"

import { CheckCircle } from "lucide-react"

export default function BenefitsSection() {
  const benefits = [
    {
      title: "Hiểu bản thân sâu sắc hơn",
      description: "Xử lý cảm xúc hiệu quả và phát triển nhận thức về chính mình",
    },
    {
      title: "Cải thiện mối quan hệ",
      description: "Nâng cao chất lượng các mối quan hệ trong đời sống cá nhân và xã hội",
    },
    {
      title: "Xây dựng cuộc sống hạnh phúc",
      description: "Áp dụng tư duy tâm lý học để tạo dựng cuộc sống trọn vẹn hơn",
    },
    {
      title: "Làm cha mẹ thông thái",
      description: "Định hướng và giáo dục con một cách khoa học, hiệu quả",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-[#004976] to-[#0066a3] text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Giá Trị Nhận Được</h2>
          <p className="text-base md:text-lg text-blue-100 max-w-2xl mx-auto">
            Sau khi hoàn thành khóa học, học viên sẽ có những thay đổi tích cực và bền vững
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 p-6 md:p-8 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300"
            >
              <div className="flex-shrink-0">
                <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">{benefit.title}</h3>
                <p className="text-sm md:text-base text-blue-100 leading-relaxed">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
