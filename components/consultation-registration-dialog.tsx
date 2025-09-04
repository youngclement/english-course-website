"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Loader2, CheckCircle, AlertCircle, Calendar, Phone, Video } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { consultationAPI, handleApiError } from "@/lib/api"

interface ConsultationRegistrationDialogProps {
    trigger?: React.ReactNode
    buttonText?: string
    buttonVariant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
    buttonSize?: "default" | "sm" | "lg" | "icon"
    className?: string
}

export default function ConsultationRegistrationDialog({
    trigger,
    buttonText = "Đăng Ký Tư Vấn",
    buttonVariant = "default",
    buttonSize = "default",
    className = "",
}: ConsultationRegistrationDialogProps) {
    const { toast } = useToast()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
        consultation_type: "",
        preferred_date: "",
        preferred_time: "",
        consultation_method: "",
        current_status: "",
        goals: "",
        additional_notes: "",
    })

    const consultationTypes = [
        { value: "career_guidance", label: "Tư vấn định hướng nghề nghiệp" },
        { value: "skill_assessment", label: "Đánh giá kỹ năng" },
        { value: "course_recommendation", label: "Tư vấn khóa học" },
        { value: "job_placement", label: "Hỗ trợ tìm việc" },
        { value: "other", label: "Khác" },
    ]

    const consultationMethods = [
        { value: "online", label: "Trực tuyến", icon: Video },
        { value: "offline", label: "Trực tiếp", icon: Calendar },
        { value: "phone", label: "Điện thoại", icon: Phone },
    ]

    const timeSlots = [
        { value: "morning", label: "Buổi sáng (8:00 - 12:00)" },
        { value: "afternoon", label: "Buổi chiều (13:00 - 17:00)" },
        { value: "evening", label: "Buổi tối (18:00 - 21:00)" },
    ]

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // Validate required fields
            if (!formData.full_name || !formData.email || !formData.phone || 
                !formData.consultation_type || !formData.preferred_date || 
                !formData.preferred_time || !formData.consultation_method) {
                throw new Error("Vui lòng điền đầy đủ thông tin bắt buộc")
            }

            // Format preferred_date to ISO string
            const formattedData = {
                ...formData,
                preferred_date: new Date(formData.preferred_date).toISOString(),
            }

            const result = await consultationAPI.register(formattedData)

            if (result.success) {
                // Reset form
                setFormData({
                    full_name: "",
                    email: "",
                    phone: "",
                    consultation_type: "",
                    preferred_date: "",
                    preferred_time: "",
                    consultation_method: "",
                    current_status: "",
                    goals: "",
                    additional_notes: "",
                })

                setIsDialogOpen(false)

                // Show success toast
                toast({
                    title: "Đăng ký tư vấn thành công! 🎉",
                    description: (
                        <div className="flex items-center gap-2">
                            <img
                                src="/bhv-english-logo-transparent.png"
                                alt="BHV Logo"
                                className="w-5 h-5 rounded-full object-cover"
                            />
                            <span>Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất có thể.</span>
                        </div>
                    ),
                    action: <CheckCircle className="h-5 w-5 text-green-500" />,
                })
            } else {
                throw new Error(result.message || 'Có lỗi xảy ra')
            }
        } catch (error) {
            console.error("Lỗi đăng ký tư vấn:", error)

            toast({
                title: "Đăng ký tư vấn thất bại",
                description: (
                    <div className="flex items-center gap-2">
                        <img
                            src="/bhv-english-logo-transparent.png"
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

    const defaultTrigger = (
        <Button
            variant={buttonVariant}
            size={buttonSize}
            className={className}
        >
            {buttonText}
        </Button>
    )

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                {trigger || defaultTrigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Đăng Ký Tư Vấn Miễn Phí
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
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

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="consultation_type">Loại tư vấn *</Label>
                            <Select onValueChange={(value) => handleSelectChange("consultation_type", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn loại tư vấn" />
                                </SelectTrigger>
                                <SelectContent>
                                    {consultationTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="consultation_method">Hình thức tư vấn *</Label>
                            <Select onValueChange={(value) => handleSelectChange("consultation_method", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn hình thức" />
                                </SelectTrigger>
                                <SelectContent>
                                    {consultationMethods.map((method) => {
                                        const Icon = method.icon
                                        return (
                                            <SelectItem key={method.value} value={method.value}>
                                                <div className="flex items-center gap-2">
                                                    <Icon className="h-4 w-4" />
                                                    {method.label}
                                                </div>
                                            </SelectItem>
                                        )
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="preferred_date">Ngày mong muốn *</Label>
                            <Input
                                id="preferred_date"
                                name="preferred_date"
                                type="date"
                                value={formData.preferred_date}
                                onChange={handleInputChange}
                                required
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="preferred_time">Khung giờ *</Label>
                            <Select onValueChange={(value) => handleSelectChange("preferred_time", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn khung giờ" />
                                </SelectTrigger>
                                <SelectContent>
                                    {timeSlots.map((slot) => (
                                        <SelectItem key={slot.value} value={slot.value}>
                                            {slot.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="current_status">Tình trạng hiện tại</Label>
                        <Input
                            id="current_status"
                            name="current_status"
                            value={formData.current_status}
                            onChange={handleInputChange}
                            placeholder="VD: Sinh viên năm cuối, Đang đi làm, Thất nghiệp..."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="goals">Mục tiêu và mong muốn</Label>
                        <Textarea
                            id="goals"
                            name="goals"
                            value={formData.goals}
                            onChange={handleInputChange}
                            placeholder="Chia sẻ mục tiêu và những gì bạn mong muốn được tư vấn..."
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="additional_notes">Ghi chú thêm</Label>
                        <Textarea
                            id="additional_notes"
                            name="additional_notes"
                            value={formData.additional_notes}
                            onChange={handleInputChange}
                            placeholder="Ghi chú thêm (nếu có)"
                            rows={2}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                            className="flex-1"
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang xử lý...
                                </>
                            ) : (
                                "Đăng ký tư vấn"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
