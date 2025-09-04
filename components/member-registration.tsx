"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CheckCircle, AlertCircle, UserPlus } from "lucide-react"
import { memberAPI, MemberRegistration as MemberRegistrationData, handleApiError } from "@/lib/api"

interface MemberRegistrationProps {
    triggerText?: string
    triggerVariant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
    triggerSize?: "default" | "sm" | "lg" | "icon"
    className?: string
}

interface FormErrors {
    full_name?: string
    email?: string
    phone?: string
    notes?: string
}

export default function MemberRegistration({
    triggerText = "Đăng Ký Thành Viên",
    triggerVariant = "default",
    triggerSize = "default",
    className = ""
}: MemberRegistrationProps) {
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [formData, setFormData] = useState<MemberRegistrationData>({
        full_name: "",
        email: "",
        phone: "",
        notes: ""
    })
    const [errors, setErrors] = useState<FormErrors>({})
    const [hasSubmitted, setHasSubmitted] = useState(false)

    // Validation functions
    const validateFullName = (name: string): string | undefined => {
        if (!name.trim()) {
            return "Họ và tên là bắt buộc"
        }
        if (name.trim().length < 2) {
            return "Họ và tên phải có ít nhất 2 ký tự"
        }
        if (name.trim().length > 50) {
            return "Họ và tên không được quá 50 ký tự"
        }
        // Check for valid Vietnamese name pattern
        const nameRegex = /^[a-zA-ZàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđĐ\s]+$/
        if (!nameRegex.test(name.trim())) {
            return "Họ và tên chỉ được chứa chữ cái và khoảng trắng"
        }
        return undefined
    }

    const validatePhone = (phone: string): string | undefined => {
        if (!phone.trim()) {
            return "Số điện thoại là bắt buộc"
        }
        // Vietnamese phone number pattern
        const phoneRegex = /^(0|\+84)[3-9]\d{8}$/
        if (!phoneRegex.test(phone.trim())) {
            return "Số điện thoại không hợp lệ (VD: 0901234567)"
        }
        return undefined
    }

    const validateEmail = (email: string): string | undefined => {
        if (!email.trim()) {
            return "Email là bắt buộc"
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email.trim())) {
            return "Địa chỉ email không hợp lệ"
        }
        return undefined
    }

    const validateNotes = (notes: string): string | undefined => {
        if (notes.trim().length > 500) {
            return "Ghi chú không được quá 500 ký tự"
        }
        return undefined
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev: MemberRegistrationData) => ({
            ...prev,
            [name]: value
        }))

        // Only validate if form has been submitted before
        if (hasSubmitted) {
            let error: string | undefined
            switch (name) {
                case 'full_name':
                    error = validateFullName(value)
                    break
                case 'phone':
                    error = validatePhone(value)
                    break
                case 'email':
                    error = validateEmail(value)
                    break
                case 'notes':
                    error = validateNotes(value)
                    break
            }

            setErrors(prev => ({
                ...prev,
                [name]: error
            }))
        }
    }

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {
            full_name: validateFullName(formData.full_name),
            phone: validatePhone(formData.phone),
            email: validateEmail(formData.email),
            notes: validateNotes(formData.notes)
        }

        setErrors(newErrors)
        return !Object.values(newErrors).some(error => error !== undefined)
    }

    const isFormValid = () => {
        return formData.full_name.trim() !== "" &&
               formData.email.trim() !== "" &&
               formData.phone.trim() !== "" &&
               !Object.values(errors).some(error => error !== undefined)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        // Mark that form has been submitted
        setHasSubmitted(true)
        
        if (!validateForm()) {
            toast({
                title: "Lỗi nhập liệu",
                description: "Vui lòng kiểm tra và sửa các lỗi trong form",
                variant: "destructive",
            })
            return
        }

        setIsLoading(true)

        try {
            const result = await memberAPI.register(formData)

            if (result.success) {
                toast({
                    title: "Đăng ký thành công!",
                    description: "Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.",
                    action: <CheckCircle className="h-4 w-4 text-green-500" />,
                })
                setIsDialogOpen(false)
                setFormData({
                    full_name: "",
                    email: "",
                    phone: "",
                    notes: ""
                })
                setErrors({})
                setHasSubmitted(false)
            } else {
                throw new Error(result.message || 'Có lỗi xảy ra')
            }
        } catch (error) {
            toast({
                title: "Đăng ký thất bại",
                description: handleApiError(error),
                action: <AlertCircle className="h-4 w-4 text-red-500" />,
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button
                    variant={triggerVariant}
                    size={triggerSize}
                    className={className}
                >
                    <UserPlus className="mr-2 h-4 w-4" />
                    {triggerText}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Đăng Ký Thành Viên</DialogTitle>
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
                                className={errors.full_name ? "border-red-500 focus:border-red-500" : ""}
                            />
                            {hasSubmitted && errors.full_name && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="h-4 w-4" />
                                    {errors.full_name}
                                </p>
                            )}
                            <p className="text-xs text-gray-500">
                                {formData.full_name.length}/50 ký tự
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Số điện thoại *</Label>
                            <Input
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                                placeholder="VD: 0901234567"
                                className={errors.phone ? "border-red-500 focus:border-red-500" : ""}
                            />
                            {hasSubmitted && errors.phone && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
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
                            placeholder="VD: example@email.com"
                            className={errors.email ? "border-red-500 focus:border-red-500" : ""}
                        />
                        {hasSubmitted && errors.email && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                                <AlertCircle className="h-4 w-4" />
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Ghi chú</Label>
                        <Textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            placeholder="Ghi chú thêm về nhu cầu học (nếu có)"
                            rows={3}
                            className={errors.notes ? "border-red-500 focus:border-red-500" : ""}
                        />
                        {hasSubmitted && errors.notes && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                                <AlertCircle className="h-4 w-4" />
                                {errors.notes}
                            </p>
                        )}
                        <p className="text-xs text-gray-500">
                            {formData.notes.length}/500 ký tự
                        </p>
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
                            disabled={isLoading || !isFormValid()}
                            className="flex-1"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang xử lý...
                                </>
                            ) : (
                                "Đăng ký"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
