"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, MapPin, Users, Star, BookOpen, TrendingUp } from "lucide-react"
import WorkshopRegistrationDialog from "./workshop-registration-dialog"

export default function WorkshopSection() {
  const workshopFeatures = [
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Kiến thức chuyên sâu",
      description: "Được giảng dạy bởi chuyên gia hàng đầu về tâm lý học"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Tương tác trực tiếp",
      description: "Q&A trực tiếp với diễn giả và các thành viên khác"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Ứng dụng thực tế",
      description: "Kỹ năng có thể áp dụng ngay trong cuộc sống hằng ngày"
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "Certificate",
      description: "Nhận chứng nhận tham dự có giá trị"
    }
  ]

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 lg:px-24">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm">
            🎯 Sự kiện đặc biệt
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Hội thảo <span className="text-primary">Tâm Lý Học Ứng Dụng</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Tham gia hội thảo độc quyền cùng thầy Huỳnh Chí Viễn để khám phá những bí mật của tâm lý học 
            và cách ứng dụng vào cuộc sống hằng ngày
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Workshop Banner */}
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <div className="relative h-64 bg-gradient-to-br from-[#1e3a5f] to-[#2a4a6b]">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <svg width="100%" height="100%" viewBox="0 0 100 100">
                    <defs>
                      <pattern id="workshop-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <circle cx="10" cy="10" r="2" fill="white" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#workshop-pattern)" />
                  </svg>
                </div>
                
                <div className="relative p-8 h-full flex flex-col justify-center text-white">
                  <Badge variant="secondary" className="w-fit mb-3 bg-white/20 text-white border-white/30">
                    ONLINE WORKSHOP
                  </Badge>
                  <h3 className="text-2xl font-bold mb-2">
                    Tâm Lý Học Ứng Dụng
                  </h3>
                  <p className="text-white/90 mb-4">
                    Khám phá sức mạnh của tâm lý học trong cuộc sống và công việc
                  </p>
                  <div className="text-sm text-white/80">
                    Diễn giả: <span className="font-semibold">Thầy Huỳnh Chí Viễn</span>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ngày tổ chức</p>
                      <p className="font-semibold">15/12/2025</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Clock className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Thời gian</p>
                      <p className="font-semibold">19:00 - 21:00</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Hình thức</p>
                      <p className="font-semibold">Online via Zoom</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Giá vé</p>
                      <p className="font-semibold text-primary">299,000 VND</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-3">Nội dung chính:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                      <span>Hiểu đúng về cảm xúc và hành vi con người</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                      <span>Kỹ năng giao tiếp hiệu quả trong mọi tình huống</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                      <span>Quản lý stress và áp lực trong cuộc sống</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                      <span>Xây dựng mối quan hệ tích cực và bền vững</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Features and CTA */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-6">Tại sao nên tham gia?</h3>
              <div className="grid gap-6">
                {workshopFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{feature.title}</h4>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div>
                    <p className="text-2xl font-bold text-primary">299,000 VND</p>
                    <p className="text-sm text-muted-foreground">
                      <span className="line-through">Giá gốc: 299,000 VND</span>
                      <Badge variant="destructive" className="ml-2">-33%</Badge>
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-semibold">Ưu đãi đặc biệt chỉ còn:</p>
                    <div className="flex justify-center items-center space-x-2 text-lg font-bold text-red-600">
                      <span className="bg-red-100 px-2 py-1 rounded">0</span>
                      <span>:</span>
                      <span className="bg-red-100 px-2 py-1 rounded">7</span>
                      <span>:</span>
                      <span className="bg-red-100 px-2 py-1 rounded">15</span>
                      <span>:</span>
                      <span className="bg-red-100 px-2 py-1 rounded">30</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Ngày : Giờ : Phút : Giây</p>
                  </div>

                  <WorkshopRegistrationDialog
                    buttonText="🎯 Đăng ký hội thảo ngay"
                    buttonSize="lg"
                    className="w-full text-lg py-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  />
                  
                  <p className="text-xs text-muted-foreground">
                    ⚡ Chỉ còn 15 suất cuối cùng!
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">🎁 Quà tặng kèm:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Tài liệu hội thảo độc quyền (PDF)</li>
                <li>• Bộ câu hỏi self-assessment tâm lý</li>
                <li>• 30 phút tư vấn cá nhân MIỄN PHÍ</li>
                <li>• Ưu đãi 50% khóa học chính thức</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
