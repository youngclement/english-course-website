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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev: MemberRegistrationData) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
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
