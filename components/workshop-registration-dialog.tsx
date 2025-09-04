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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface WorkshopRegistrationDialogProps {
  buttonText?: string
  buttonVariant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link"
  buttonSize?: "default" | "sm" | "lg" | "icon"
  className?: string
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
    price: "199,000 VND",
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
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen)
      if (!newOpen) {
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
          <div className="space-y-6">
            {/* Workshop Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-primary">{workshopInfo.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">Ngày tổ chức:</Label>
                    <p>{workshopInfo.date}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Thời gian:</Label>
                    <p>{workshopInfo.time}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Hình thức:</Label>
                    <p>{workshopInfo.venue}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Giá vé:</Label>
                    <Badge variant="default" className="text-lg">{workshopInfo.price}</Badge>
                  </div>
                </div>
                
                <div>
                  <Label className="font-semibold">Diễn giả:</Label>
                  <p>{workshopInfo.speaker}</p>
                </div>

                <div>
                  <Label className="font-semibold">Nội dung chính:</Label>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    {workshopInfo.topics.map((topic, index) => (
                      <li key={index} className="text-sm">{topic}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Họ và tên *</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    required
                    placeholder="Nhập họ và tên"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Nhập email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Ghi chú (tùy chọn)</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Nhập ghi chú hoặc câu hỏi..."
                  rows={3}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full text-lg py-6"
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
          <div className="space-y-6 text-center">
            <div className="space-y-2">
              <QrCode className="h-12 w-12 mx-auto text-primary" />
              <h3 className="text-lg font-semibold">Thanh toán qua QR Code</h3>
              <p className="text-muted-foreground">
                Quét mã QR bên dưới để thanh toán {workshopInfo.price}
              </p>
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=00020101021238540010A000000727012700069704220114SACOMBANK1234560208QRIBFTTA53037045802VN5915BHV%20ENGLISH6304C963"
                    alt="Payment QR Code"
                    className="w-48 h-48 mx-auto"
                  />
                </div>
                
                <div className="space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="font-medium">Ngân hàng:</span>
                    <span>Sacombank</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Số tài khoản:</span>
                    <span>0123456789</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Chủ tài khoản:</span>
                    <span>BHV ENGLISH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Số tiền:</span>
                    <span className="text-lg font-bold text-primary">{workshopInfo.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Nội dung:</span>
                    <span className="text-sm">WORKSHOP {registrationId.slice(-6)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Sau khi chuyển khoản thành công, vui lòng nhấn "Đã thanh toán"
              </p>
              <Button
                onClick={handlePaymentConfirm}
                className="w-full text-lg py-6"
              >
                Đã thanh toán
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="w-full"
              >
                Quay lại
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Group QR */}
        {step === 3 && (
          <div className="space-y-6 text-center">
            <div className="space-y-2">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-600">Thanh toán thành công!</h3>
              <p className="text-muted-foreground">
                Hãy tham gia group hội thảo để nhận thông tin chi tiết
              </p>
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Users className="h-6 w-6 text-primary" />
                  <h4 className="text-lg font-semibold">Group Hội thảo Tâm Lý</h4>
                </div>
                
                <div className="bg-gray-100 p-4 rounded-lg">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://zalo.me/g/workshop-tamly-bhv"
                    alt="Group QR Code"
                    className="w-48 h-48 mx-auto"
                  />
                </div>
                
                <div className="space-y-2">
                  <p className="font-medium">Quét QR để tham gia group Zalo</p>
                  <p className="text-sm text-muted-foreground">
                    Hoặc truy cập: <span className="text-primary">zalo.me/g/workshop-tamly-bhv</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <div className="bg-blue-50 p-4 rounded-lg text-left">
                <h5 className="font-semibold text-blue-800 mb-2">Thông tin quan trọng:</h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Link Zoom sẽ được gửi trước hội thảo 1 ngày</li>
                  <li>• Tài liệu hội thảo sẽ được chia sẻ trong group</li>
                  <li>• Hỗ trợ kỹ thuật qua group hoặc hotline</li>
                  <li>• Có certificate tham dự sau hội thảo</li>
                </ul>
              </div>
              
              <Button
                onClick={() => setOpen(false)}
                className="w-full text-lg py-6"
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
