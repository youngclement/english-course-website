import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { courseAPI, handleApiError } from "@/lib/api"
import CourseRegistrationDialog from "./course-registration-dialog"

export default function CTASection() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    course_name: "Khóa học Tâm Lý Học Hành Vi & Xã Hội",
    notes: "",
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Gọi API đăng ký khóa học
      const result = await courseAPI.register(formData)

      if (result.success) {
        // Reset form
        setFormData({
          full_name: "",
          phone: "",
          email: "",
          course_name: "Khóa học Tâm Lý Học Hành Vi & Xã Hội",
          notes: "",
        })

        // Hiển thị toast thành công
        toast({
          title: "Đăng ký thành công! 🎉",
          description: (
            <div className="flex items-center gap-2">
              <img
                src="https://bhvenglish.vn/wp-content/uploads/2024/08/BHV-logo-page.jpg"
                alt="BHV Logo"
                className="w-5 h-5 rounded-full object-cover"
              />
              <span>Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.</span>
            </div>
          ),
          action: <CheckCircle className="h-5 w-5 text-green-500" />,
          variant: "success",
        })
      } else {
        // API trả về lỗi
        throw new Error(result.message || 'Có lỗi xảy ra')
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error)

      // Hiển thị toast lỗi với thông tin chi tiết
      toast({
        title: "Đăng ký thất bại",
        description: (
          <div className="flex items-center gap-2">
            <img
              src="https://bhvenglish.vn/wp-content/uploads/2024/08/BHV-logo-page.jpg"
              alt="BHV Logo"
              className="w-5 h-5 rounded-full object-cover"
            />
            <span>{handleApiError(error)}</span>
          </div>
        ),
        action: <AlertCircle className="h-5 w-5 text-red-500" />,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id="contact" className="py-8 md:py-12 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-2 lg:px-24 sm:px-4 ">
        <div className="grid lg:grid-cols-2 gap-6 md:gap-12 items-center">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold text-balance mb-4 md:mb-6">
              Bạn Đã Sẵn Sàng <span className="text-primary">Thay Đổi Cuộc Sống</span> Với Tâm Lý Học?
            </h2>
            <p className="text-base md:text-lg text-muted-foreground text-pretty mb-6 md:mb-8">
              Đăng ký ngay hôm nay để tham gia khóa học Tâm Lý Học Hành Vi & Xã Hội cùng thầy Huỳnh Chí Viễn. Khám phá
              bản thân, cải thiện mối quan hệ và xây dựng cuộc sống hạnh phúc hơn.
            </p>

            <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Hotline</p>
                  <p className="text-muted-foreground">0933.60.90.30<br />093.94.808.94</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-muted-foreground">bhvenglish@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Địa chỉ</p>
                  <p className="text-muted-foreground">Số 01 Cô Bắc, Phường Cầu Kiệu, TP.HCM</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <CardContent className="p-4 sm:p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">Đăng Ký Khóa Học Tâm Lý</h3>

              <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name" className="text-sm font-medium">Họ và tên *</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      required
                      placeholder="Nhập họ và tên"
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">Số điện thoại *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="Nhập số điện thoại"
                      className="bg-background/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Nhập email"
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="course_name" className="text-sm font-medium">Tên khóa học</Label>
                  <Input
                    id="course_name"
                    name="course_name"
                    value={formData.course_name}
                    disabled
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm font-medium">Ghi chú</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Nhập ghi chú (tùy chọn)"
                    className="bg-background/50 min-h-[80px]"
                    rows={3}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full text-base md:text-lg py-4 md:py-6"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    "Đăng Ký Ngay"
                  )}
                </Button>
              </form>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Bằng việc đăng ký, bạn đồng ý với{" "}
                <a href="#" className="text-primary hover:underline">
                  Điều khoản sử dụng
                </a>{" "}
                của chúng tôi.
              </p>
            </CardContent>
          </div>
        </div>
      </div>
    </section>
  )
}
