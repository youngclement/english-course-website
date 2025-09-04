"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { courseAPI, handleApiError } from "@/lib/api"

interface CourseRegistrationDialogProps {
    trigger?: React.ReactNode
    courseName?: string
    buttonText?: string
    buttonVariant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
    buttonSize?: "default" | "sm" | "lg" | "icon"
    className?: string
}

interface FormErrors {
    full_name?: string
    phone?: string
    email?: string
    notes?: string
}

export default function CourseRegistrationDialog({
    trigger,
    courseName = "Khóa học Tâm Lý Học Hành Vi & Xã Hội",
    buttonText = "Đăng Ký Khóa Học",
    buttonVariant = "default",
    buttonSize = "default",
    className = "",
}: CourseRegistrationDialogProps) {
    const { toast } = useToast()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<FormErrors>({})
    const [hasSubmitted, setHasSubmitted] = useState(false)
    const [formData, setFormData] = useState({
        full_name: "",
        phone: "",
        email: "",
        course_name: courseName,
        notes: "",
    })

    // Validation functions
    const validateFullName = (name: string): string | undefined => {
        if (!name.trim()) return "Họ và tên là bắt buộc"
        if (name.trim().length < 2) return "Họ và tên phải có ít nhất 2 ký tự"
        if (name.trim().length > 50) return "Họ và tên không được quá 50 ký tự"
        if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(name.trim())) return "Họ và tên chỉ được chứa chữ cái và khoảng trắng"
        return undefined
    }

    const validatePhone = (phone: string): string | undefined => {
        if (!phone.trim()) return "Số điện thoại là bắt buộc"
        const phoneRegex = /^(0|\+84)[0-9]{8,10}$/
        if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
            return "Số điện thoại không hợp lệ (VD:  [redacted-phone]hoặc +84901234567)"
        }
        return undefined
    }

    const validateEmail = (email: string): string | undefined => {
        if (!email.trim()) return "Email là bắt buộc"
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) return "Email không hợp lệ"
        if (email.length > 100) return "Email không được quá 100 ký tự"
        return undefined
    }

    const validateNotes = (notes: string): string | undefined => {
        if (notes.length > 500) return "Ghi chú không được quá 500 ký tự"
        return undefined
    }

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}
        
        newErrors.full_name = validateFullName(formData.full_name)
        newErrors.phone = validatePhone(formData.phone)
        newErrors.email = validateEmail(formData.email)
        newErrors.notes = validateNotes(formData.notes)

        setErrors(newErrors)
        return !Object.values(newErrors).some(error => error !== undefined)
    }

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))

        // Only validate if form has been submitted before
        if (hasSubmitted) {
            let fieldError: string | undefined
            switch (name) {
                case 'full_name':
                    fieldError = validateFullName(value)
                    break
                case 'phone':
                    fieldError = validatePhone(value)
                    break
                case 'email':
                    fieldError = validateEmail(value)
                    break
                case 'notes':
                    fieldError = validateNotes(value)
                    break
            }

            setErrors(prev => ({
                ...prev,
                [name]: fieldError
            }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        // Mark that form has been submitted
        setHasSubmitted(true)
        
        // Validate form before submission
        if (!validateForm()) {
            toast({
                title: "Vui lòng kiểm tra lại thông tin",
                description: "Có một số trường chưa hợp lệ, vui lòng sửa và thử lại.",
                variant: "destructive",
            })
            return
        }

        setIsLoading(true)

        try {
            // Clean phone number
            const cleanedData = {
                ...formData,
                phone: formData.phone.replace(/\s/g, ''),
                full_name: formData.full_name.trim(),
                email: formData.email.trim(),
                notes: formData.notes.trim(),
            }

            // Gọi API đăng ký khóa học
            const result = await courseAPI.register(cleanedData)

            if (result.success) {
                // Reset form
                setFormData({
                    full_name: "",
                    phone: "",
                    email: "",
                    course_name: courseName,
                    notes: "",
                })
                setErrors({})
                setHasSubmitted(false)
                setIsDialogOpen(false)

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
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Đăng Ký Khóa Học</DialogTitle>
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
                                className={errors.full_name ? "border-red-500 focus:ring-red-500" : ""}
                            />
                            {hasSubmitted && errors.full_name && (
                                <p className="text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="h-4 w-4" />
                                    {errors.full_name}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Số điện thoại *</Label>
                            <Input
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                                placeholder="0901234567"
                                className={errors.phone ? "border-red-500 focus:ring-red-500" : ""}
                            />
                            {hasSubmitted && errors.phone && (
                                <p className="text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="h-4 w-4" />
                                    {errors.phone}
                                </p>
                            )}
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
                            placeholder="example@email.com"
                            className={errors.email ? "border-red-500 focus:ring-red-500" : ""}
                        />
                        {hasSubmitted && errors.email && (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                                <AlertCircle className="h-4 w-4" />
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="course_name">Tên khóa học</Label>
                        <Input
                            id="course_name"
                            name="course_name"
                            value={formData.course_name}
                            disabled
                            className="bg-gray-50"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Ghi chú (tùy chọn)</Label>
                        <Textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            placeholder="Bạn có câu hỏi gì hoặc muốn chia sẻ thêm về nhu cầu học tập?"
                            rows={3}
                            className={errors.notes ? "border-red-500 focus:ring-red-500" : ""}
                            maxLength={500}
                        />
                        <div className="flex justify-between items-center">
                            <div>
                                {hasSubmitted && errors.notes && (
                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                        <AlertCircle className="h-4 w-4" />
                                        {errors.notes}
                                    </p>
                                )}
                            </div>
                            <p className="text-xs text-gray-500">
                                {formData.notes.length}/500 ký tự
                            </p>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading || Object.values(errors).some(error => error !== undefined)}
                        className="w-full"
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

                    <p className="text-xs text-gray-500 text-center">
                        Bằng việc đăng ký, bạn đồng ý với{" "}
                        <a href="#" className="text-primary hover:underline">
                            Điều khoản sử dụng
                        </a>{" "}
                        của chúng tôi.
                    </p>
                </form>
            </DialogContent>
        </Dialog>
    )
}
