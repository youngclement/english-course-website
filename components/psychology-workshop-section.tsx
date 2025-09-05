"use client"

import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Users } from "lucide-react"
import WorkshopRegistrationDialog from "./workshop-registration-dialog"
import Ballpit from "./Ballpit"

export default function PsychologyWorkshopSection() {
  return (
    <section className="min-h-screen bg-white relative flex items-center py-8 sm:py-12 overflow-hidden">
      {/* Background with Ballpit - Completely hidden */}
      <div className="">
        {/* <Ballpit
          count={80}
          gravity={0.3}
          friction={0.9}
          wallBounce={0.8}
          followCursor={false}
          colors={[0x004976, 0x0066aa, 0x4d94ff]}
        /> */}
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-20">
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
            HỘI THẢO TÂM LÝ <span className="text-primary">ONLINE</span>
          </h2>
          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 px-4">
            "Tâm lý người ái kỷ và cách tự bảo vệ mình"
          </h3>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Workshop Information - Mobile First */}
            <div className="order-1 lg:order-2 lg:col-span-1 space-y-3 sm:space-y-4 relative z-30">
              {/* Workshop Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/95 shadow-sm border border-gray-100 relative z-30">
                  <div className="w-8 h-8 bg-[#004976] rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-600">Thời gian</p>
                    <p className="font-semibold text-gray-900 text-sm">20h00 – 21h30</p>
                    <p className="text-xs text-gray-600">Thứ Bảy, 04/10/2025</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/95 shadow-sm border border-gray-100 relative z-30">
                  <div className="w-8 h-8 bg-[#004976] rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-600">Hình thức</p>
                    <p className="font-semibold text-gray-900 text-sm">Online qua Zoom</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/95 shadow-sm border border-gray-100 relative z-30">
                  <div className="w-8 h-8 bg-[#004976] rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-600">Phí tham dự</p>
                    <p className="font-semibold text-primary text-base">199.000đ</p>
                    <p className="text-xs text-gray-500">(ưu đãi đăng ký trước 20/09)</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/95 shadow-sm border border-gray-100 relative z-30">
                  <div className="w-8 h-8 bg-[#004976] rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-600">Thời lượng</p>
                    <p className="font-semibold text-gray-900 text-sm">90 phút</p>
                  </div>
                </div>
              </div>

              {/* Workshop Content - Simplified */}
              <div className="bg-white/90 p-4 rounded-lg shadow-sm border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Trong 90 phút, hội thảo sẽ giúp bạn:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm">Nhận diện tính cách người ái kỷ</p>
                      <p className="text-xs text-gray-600">Những dấu hiệu "ẩn" khó phát hiện.</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm">Hiểu gốc rễ nhân cách ái kỷ</p>
                      <p className="text-xs text-gray-600">Vì sao họ trở thành như vậy?</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm">Khám phá cách họ suy nghĩ và thao túng</p>
                      <p className="text-xs text-gray-600">Điều gì khiến họ khác người bình thường?</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm">Chiến lược bảo vệ bản thân</p>
                      <p className="text-xs text-gray-600">Cách giữ vững tâm lý và ranh giới khi buộc phải sống hoặc làm việc cùng người ái kỷ.</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Registration Button */}
              <div className="text-center pt-2 relative z-30">
                <WorkshopRegistrationDialog 
                  buttonText="Đăng Ký Ngay"
                  buttonSize="default"
                  className="bg-[#004976] hover:bg-[#003866] text-white px-6 py-2 w-full sm:w-auto relative z-40 touch-manipulation"
                />
              </div>
            </div>

            {/* Workshop Banner Image */}
            <div className="order-2 lg:order-1 lg:col-span-2 relative z-20">
              <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-80 xl:h-96 rounded-lg overflow-hidden bg-white shadow-sm border border-gray-100">
                <img 
                  src="workshop-banner.jpg" 
                  alt="Hội thảo tâm lý về người ái kỷ" 
                  className="w-full h-full object-cover"
                />
               
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
