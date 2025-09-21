"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, CheckCircle, AlertCircle, QrCode, Users, ArrowRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { memberAPI, handleApiError } from "@/lib/api"
import { Badge } from "@/components/ui/badge"

interface WorkshopRegistrationDialogProps {
  buttonText?: string
  buttonVariant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link"
  buttonSize?: "default" | "sm" | "lg" | "icon"
  className?: string
}

interface ValidationErrors {
  full_name?: string
  email?: string
  phone?: string
}

// Validation functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(\+84|84|0)(3|5|7|8|9)\d{8}$/
  return phoneRegex.test(phone.replace(/\s+/g, ''))
}

const validateFullName = (name: string): boolean => {
  return name.trim().length >= 2 && /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ\s]+$/.test(name.trim())
}

export default function WorkshopRegistrationDialog({
  buttonText = "Đăng ký hội thảo",
  buttonVariant = "default",
  buttonSize = "default",
  className = "",
}: WorkshopRegistrationDialogProps) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1) // 1: form, 2: payment QR, 3: group QR
  const [isLoading, setIsLoading] = useState(false)
  const [registrationId, setRegistrationId] = useState("")
  const [errors, setErrors] = useState<ValidationErrors>({})
  
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    notes: "",
  })

  const workshopInfo = {
    title: "Hội thảo Tâm Lý Học Ứng Dụng",
    date: "15/12/2025",
    time: "19:00 - 21:00",
    venue: "Online via Zoom",
    price: "299,000 VND",
    speaker: "Thầy Huỳnh Chí Viễn",
    topics: [
      "Hiểu đúng về cảm xúc và hành vi",
      "Kỹ năng giao tiếp hiệu quả",
      "Quản lý stress và áp lực",
      "Xây dựng mối quan hệ tích cực"
    ]
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    
    // Clear errors when user starts typing
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}

    // Validate full name
    if (!formData.full_name.trim()) {
      newErrors.full_name = "Vui lòng nhập họ và tên"
    } else if (!validateFullName(formData.full_name)) {
      newErrors.full_name = "Họ và tên phải có ít nhất 2 ký tự và chỉ chứa chữ cái"
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Email không đúng định dạng"
    }

    // Validate phone
    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại"
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Số điện thoại không đúng định dạng (VD: 0901234567)"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form before submitting
    if (!validateForm()) {
      toast({
        title: "Thông tin không hợp lệ",
        description: "Vui lòng kiểm tra lại thông tin đã nhập.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const memberData = {
        ...formData,
        notes: `Workshop: ${workshopInfo.title} - ${workshopInfo.date} ${workshopInfo.time}${formData.notes ? ` | ${formData.notes}` : ''}`,
      }

      const result = await memberAPI.register(memberData)

      if (result.success && result.data) {
        setRegistrationId(result.data._id)
        setStep(2) // Chuyển đến bước thanh toán
        
        toast({
          title: "Đăng ký thành công! 🎉",
          description: "Vui lòng hoàn tất thanh toán để tham gia hội thảo.",
          action: <CheckCircle className="h-5 w-5 text-green-500" />,
        })
      } else {
        throw new Error(result.message || 'Có lỗi xảy ra')
      }
    } catch (error) {
      toast({
        title: "Đăng ký thất bại",
        description: handleApiError(error),
        action: <AlertCircle className="h-5 w-5 text-red-500" />,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentConfirm = () => {
    setStep(3) // Chuyển đến bước tham gia group
    toast({
      title: "Thanh toán thành công! 💳",
      description: "Hãy tham gia group hội thảo để nhận thông tin chi tiết.",
    })
  }

  const resetDialog = () => {
    setStep(1)
    setFormData({
      full_name: "",
      email: "",
      phone: "",
      notes: "",
    })
    setRegistrationId("")
    setErrors({})
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen)
      if (newOpen) {
        // Dispatch event to hide header when dialog opens
        window.dispatchEvent(new CustomEvent('dialog-open'))
      } else {
        // Dispatch event to show header when dialog closes
        window.dispatchEvent(new CustomEvent('dialog-close'))
        resetDialog()
      }
    }}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} size={buttonSize} className={className}>
          {buttonText}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {step === 1 && "Đăng ký Hội thảo Tâm Lý Học"}
            {step === 2 && "Thanh toán Hội thảo"}
            {step === 3 && "Tham gia Group Hội thảo"}
          </DialogTitle>
        </DialogHeader>

        {/* Step 1: Registration Form */}
        {step === 1 && (
          <div className="space-y-4">
            {/* Workshop Banner */}
            <div className="relative w-full h-24 rounded-lg overflow-hidden mb-3">
              <img 
                src="/workshop-banner.jpg" 
                alt="Hội thảo tâm lý về người ái kỷ" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 flex items-center justify-center">
                <div className="text-center text-white px-4">
                  <h4 className="text-xs font-bold">HỘI THẢO TÂM LÝ ONLINE</h4>
                  <p className="text-xs opacity-90">"Tâm lý người ái kỷ và cách tự bảo vệ mình"</p>
                </div>
              </div>
            </div>

            {/* Workshop Info */}
            <div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="font-semibold text-xs">Ngày tổ chức:</Label>
                    <p className="text-sm">Thứ Bảy, 04/10/2025</p>
                  </div>
                  <div>
                    <Label className="font-semibold text-xs">Thời gian:</Label>
                    <p className="text-sm">20h00 – 21h30</p>
                  </div>
                  <div>
                    <Label className="font-semibold text-xs">Hình thức:</Label>
                    <p className="text-sm">Online qua Zoom</p>
                  </div>
                  <div>
                    <Label className="font-semibold text-xs">Giá vé:</Label>
                    <Badge variant="default" className="text-sm">299.000đ</Badge>
                  </div>
                </div>
                
                <div>
                  <Label className="font-semibold text-xs">Nội dung chính:</Label>
                  <ul className="list-disc list-inside space-y-1 mt-1">
                    <li className="text-xs">Nhận diện tính cách người ái kỷ</li>
                    <li className="text-xs">Hiểu gốc rễ nhân cách ái kỷ</li>
                    <li className="text-xs">Khám phá cách họ suy nghĩ và thao túng</li>
                    <li className="text-xs">Chiến lược bảo vệ bản thân</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="full_name" className="text-xs">Họ và tên *</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    required
                    placeholder="Nhập họ và tên"
                    className={`text-sm ${errors.full_name ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                  {errors.full_name && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.full_name}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone" className="text-xs">Số điện thoại *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="Nhập số điện thoại"
                    className={`text-sm ${errors.phone ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="email" className="text-xs">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Nhập email"
                  className={`text-sm ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="notes" className="text-xs">Ghi chú (tùy chọn)</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Nhập ghi chú hoặc câu hỏi..."
                  rows={2}
                  className="text-sm h-16"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full text-sm py-4"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    Đăng ký ngay
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </div>
        )}

        {/* Step 2: Payment QR */}
        {step === 2 && (
          <div className="space-y-3 text-center">
            <div className="space-y-1">
              <QrCode className="h-8 w-8 mx-auto text-primary" />
              <h3 className="text-xs font-semibold">Thanh toán qua QR Code</h3>
              <p className="text-xs text-muted-foreground">
                Quét mã QR bên dưới để thanh toán {workshopInfo.price}
              </p>
            </div>

            <div>
              <div className="p-3 space-y-2">
                <div className="p-2 rounded-lg">
                  <img
                    src="/qr-payment-acb.jpg"
                    alt="Payment QR Code"
                    className="w-32 h-32 mx-auto"
                  />
                </div>
                
                <div className="space-y-1 text-left">
                  <div className="flex justify-between">
                    <span className="font-medium text-xs">Ngân hàng:</span>
                    <span className="text-xs">ACB - NN TMCP Á Châu</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-xs">Số tài khoản:</span>
                    <span className="text-xs">7879283868</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-xs">Chủ tài khoản:</span>
                    <span className="text-xs">CTY TNHH BHV ENGLISH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-xs">Số tiền:</span>
                    <span className="text-sm font-bold text-primary">299.000đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-xs">Nội dung:</span>
                    <span className="text-xs">Họ tên người tham dự + số điện thoại</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Sau khi chuyển khoản thành công, vui lòng nhấn "Đã thanh toán"
              </p>
              <Button
                onClick={handlePaymentConfirm}
                className="w-full text-sm py-3"
              >
                Đã thanh toán
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="w-full text-xs py-2"
              >
                Quay lại
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Group QR */}
        {step === 3 && (
          <div className="space-y-3 text-center">
            <div className="space-y-1">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xs font-semibold text-green-600">Thanh toán thành công!</h3>
              <p className="text-xs text-muted-foreground">
                Hãy tham gia group hội thảo để nhận thông tin chi tiết
              </p>
            </div>

            <div>
              <div className="p-3 space-y-2">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Users className="h-4 w-4 text-primary" />
                  <h4 className="text-xs font-semibold">Group Hội thảo Tâm Lý</h4>
                </div>
                
                <div className="p-2 rounded-lg">
                  <img
                    src="/qr-zalo-workshop.jpg"
                    alt="Group QR Code"
                    className="w-32 h-32 mx-auto"
                  />
                </div>
                
                <div className="space-y-1">
                  <p className="font-medium text-xs">Quét QR để tham gia group Zalo</p>
                  <p className="text-xs text-muted-foreground">
                    Hoặc truy cập: <span className="text-primary">zalo.me/g/workshop-tamly-bhv</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
            
              
              <Button
                onClick={() => setOpen(false)}
                className="w-full text-sm py-3"
              >
                Hoàn tất đăng ký
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
