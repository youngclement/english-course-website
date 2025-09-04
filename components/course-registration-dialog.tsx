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
    const [formData, setFormData] = useState({
        full_name: "",
        phone: "",
        email: "",
        course_name: courseName,
        notes: "",
    })

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
            // Gọi API đăng ký khóa học
            const result = await courseAPI.register(formData)

            if (result.success) {
                // Reset form
                setFormData({
                    full_name: "",
                    phone: "",
                    email: "",
                    course_name: courseName,
                    notes: "",
                })

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

                    <div className="space-y-2">
                        <Label htmlFor="course_name">Tên khóa học</Label>
                        <Input
                            id="course_name"
                            name="course_name"
                            value={formData.course_name}
                            onChange={handleInputChange}
                            
                            disabled
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Ghi chú</Label>
                        <Textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            placeholder="Ghi chú thêm (nếu có)"
                            rows={3}
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
                                "Đăng ký"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
