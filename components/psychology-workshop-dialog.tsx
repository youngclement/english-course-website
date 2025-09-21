"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import WorkshopRegistrationDialog from "./workshop-registration-dialog"
import Iridescence from "./Iridescence"

interface PsychologyWorkshopDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function PsychologyWorkshopDialog({ open, onOpenChange }: PsychologyWorkshopDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
        {/* Background with Iridescence */}
        <div className="absolute inset-0 opacity-20 pointer-events-none z-0 rounded-lg overflow-hidden">
          <Iridescence
            color={[1.0, 1.0, 1.0]} // White color
            speed={0.3}
            amplitude={0.05}
            mouseReact={false}
          />
        </div>
        
        <div className="relative z-20 p-6">
          <DialogHeader className="text-center mb-6">
            <DialogTitle className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              HỘI THẢO TÂM LÝ <span className="text-primary">ONLINE</span>
            </DialogTitle>
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
              "Tâm lý người ái kỷ và cách tự bảo vệ mình"
            </h3>
          </DialogHeader>

          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col gap-6">
              {/* Banner and Content Side by Side */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Workshop Banner Image - Takes 2/3 width */}
                <div className="lg:col-span-2 relative z-20">
                  <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 rounded-lg overflow-hidden bg-white shadow-sm border border-gray-100">
                    <img 
                      src="workshop-banner.jpg" 
                      alt="Hội thảo tâm lý về người ái kỷ" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Workshop Content - Takes 1/3 width */}
                <div className="lg:col-span-1 relative z-30 flex flex-col justify-center">
                  <h4 className="font-bold text-gray-900 mb-4 text-base sm:text-lg">Trong 90 phút, hội thảo sẽ giúp bạn:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm sm:text-base mb-1">Nhận diện tính cách người ái kỷ</p>
                        <p className="text-xs sm:text-sm text-gray-600">Những dấu hiệu "ẩn" khó phát hiện.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm sm:text-base mb-1">Hiểu gốc rễ nhân cách ái kỷ</p>
                        <p className="text-xs sm:text-sm text-gray-600">Vì sao họ trở thành như vậy?</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm sm:text-base mb-1">Khám phá cách họ suy nghĩ và thao túng</p>
                        <p className="text-xs sm:text-sm text-gray-600">Điều gì khiến họ khác biệt với số đông?</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm sm:text-base mb-1">Chiến lược bảo vệ bản thân</p>
                        <p className="text-xs sm:text-sm text-gray-600">Cách giữ vững tâm lý và ranh giới khi  sống hoặc làm việc cùng người ái kỷ.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Workshop Details - Bottom Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-30">
                <div className="flex items-center space-x-3 p-3 rounded-lg">
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <img 
                      src="https://img.freepik.com/premium-photo/calendar-3d-icon_307432-49.jpg" 
                      alt="Calendar" 
                      className="h-8 w-8 object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-600 font-medium">Thời gian</p>
                    <p className="font-semibold text-gray-900 text-sm">20h00 – 21h30</p>
                    <p className="text-xs text-gray-600">Thứ Bảy, 04/10/2025</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-lg">
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <img 
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTk-uiiYuy4QKYcMvQ4b-wC2EJLgjXGD6CRYQ&s" 
                      alt="Zoom" 
                      className="h-8 w-8 object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-600 font-medium">Hình thức</p>
                    <p className="font-semibold text-gray-900 text-sm">Online qua Zoom</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-lg">
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <img 
                      src="https://img.freepik.com/premium-psd/group-people-3d-icon_628815-103.jpg" 
                      alt="People" 
                      className="h-8 w-8 object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-600 font-medium">Phí tham dự</p>
                    <p className="font-semibold text-primary text-base">299.000đ</p>
                    <p className="text-xs text-gray-500">(Đăng ký sau ngày 30/09 là 599.000đ)</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-lg">
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <img 
                      src="https://static.vecteezy.com/system/resources/previews/021/114/014/non_2x/3d-red-simple-clock-icon-png.png" 
                      alt="Clock" 
                      className="h-8 w-8 object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-600 font-medium">Thời lượng</p>
                    <p className="font-semibold text-gray-900 text-sm">90 phút</p>
                  </div>
                </div>
              </div>

              {/* Registration Button */}
              <div className="text-center relative z-30 mt-4">
                <WorkshopRegistrationDialog 
                  buttonText="Đăng Ký Ngay"
                  buttonSize="default"
                  className="bg-[#004976] hover:bg-[#003866] text-white px-8 py-3 text-lg w-full sm:w-auto relative z-40 touch-manipulation"
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
