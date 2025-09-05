"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Search, Eye, CheckCircle, XCircle, Trash2, RefreshCw, GalleryVerticalEnd, Download } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { LoginForm } from "@/components/login-form"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
    authAPI,
    courseAPI,
    memberAPI,
    consultationAPI,
    CourseRegistrationWithId,
    MemberRegistrationWithId,
    ConsultationRegistrationWithId,
    LoginCredentials,
    handleApiError
} from "@/lib/api"

export default function AdminDashboard() {
    const { toast } = useToast()
    const [token, setToken] = useState<string>("")
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isDataLoading, setIsDataLoading] = useState(false)
    const [courseRegistrations, setCourseRegistrations] = useState<CourseRegistrationWithId[]>([])
    const [memberRegistrations, setMemberRegistrations] = useState<MemberRegistrationWithId[]>([])
    const [consultationRegistrations, setConsultationRegistrations] = useState<ConsultationRegistrationWithId[]>([])
    const [coursePagination, setCoursePagination] = useState<any>(null)
    const [memberPagination, setMemberPagination] = useState<any>(null)
    const [consultationPagination, setConsultationPagination] = useState<any>(null)
    const [currentCoursePage, setCurrentCoursePage] = useState(1)
    const [currentMemberPage, setCurrentMemberPage] = useState(1)
    const [currentConsultationPage, setCurrentConsultationPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [typeFilter, setTypeFilter] = useState("all")
    const [selectedRegistration, setSelectedRegistration] = useState<CourseRegistrationWithId | MemberRegistrationWithId | ConsultationRegistrationWithId | null>(null)
    const [currentTab, setCurrentTab] = useState("courses")

    // Login form state
    const [loginForm, setLoginForm] = useState<LoginCredentials>({
        email: "",
        password: ""
    })

    // Check for existing token on mount
    useEffect(() => {
        const savedToken = localStorage.getItem("admin_token")
        if (savedToken) {
            setToken(savedToken)
            setIsLoggedIn(true)
        }
    }, [])

    // Fetch data when token is available
    useEffect(() => {
        if (token && isLoggedIn) {
            console.log("Token available, fetching data...")
            fetchCourseRegistrations(1)
            fetchMemberRegistrations(1)
            fetchConsultationRegistrations(1)
        }
    }, [token, isLoggedIn])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const result = await authAPI.login(loginForm)

            if (result.success && result.data) {
                setToken(result.data.token)
                setIsLoggedIn(true)
                localStorage.setItem("admin_token", result.data.token)
                toast({
                    title: "Đăng nhập thành công!",
                    description: "Chào mừng bạn đến với trang quản trị",
                })
                // Data will be fetched automatically by useEffect
            } else {
                throw new Error(result.message || 'Đăng nhập thất bại')
            }
        } catch (error) {
            toast({
                title: "Đăng nhập thất bại",
                description: handleApiError(error),
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleLogout = () => {
        setToken("")
        setIsLoggedIn(false)
        localStorage.removeItem("admin_token")
        setCourseRegistrations([])
        setMemberRegistrations([])
        setConsultationRegistrations([])
        setCoursePagination(null)
        setMemberPagination(null)
        setConsultationPagination(null)
    }

    const fetchCourseRegistrations = async (page: number, search?: string, status?: string) => {
        try {
            console.log("Fetching course registrations...")
            setIsDataLoading(true)
            const result = await courseAPI.getAll(token, page, 10, search, status)

            if (result.success && result.data) {
                setCourseRegistrations(result.data.registrations)
                setCoursePagination(result.data.pagination)
                setCurrentCoursePage(page)
                console.log("Course registrations fetched:", result.data.registrations.length)
            }
        } catch (error) {
            console.error('Error fetching course registrations:', error)
        } finally {
            setIsDataLoading(false)
        }
    }

    const fetchMemberRegistrations = async (page: number, status?: string) => {
        try {
            console.log("Fetching member registrations...")
            setIsDataLoading(true)
            const result = await memberAPI.getAll(token, page, 10, status)

            if (result.success && result.data) {
                setMemberRegistrations(result.data.registrations)
                setMemberPagination(result.data.pagination)
                setCurrentMemberPage(page)
                console.log("Member registrations fetched:", result.data.registrations.length)
            }
        } catch (error) {
            console.error('Error fetching member registrations:', error)
        } finally {
            setIsDataLoading(false)
        }
    }

    const fetchConsultationRegistrations = async (page: number, status?: string, consultation_type?: string, search?: string) => {
        try {
            console.log("Fetching consultation registrations...")
            setIsDataLoading(true)
            const result = await consultationAPI.getAll(token, page, 10, status, consultation_type, search)

            if (result.success && result.data) {
                // The API returns 'consultations' not 'registrations'
                const consultations = result.data.consultations || []
                setConsultationRegistrations(consultations)
                setConsultationPagination(result.data.pagination)
                setCurrentConsultationPage(page)
                console.log("Consultation registrations fetched:", consultations.length)
            } else {
                setConsultationRegistrations([])
                setConsultationPagination(null)
                console.log("No consultation data received")
            }
        } catch (error) {
            console.error('Error fetching consultation registrations:', error)
            setConsultationRegistrations([])
            setConsultationPagination(null)
        } finally {
            setIsDataLoading(false)
        }
    }

    const updateStatus = async (type: 'course' | 'member' | 'consultation', id: string, status: string, notes?: string) => {
        try {
            let result
            if (type === 'course') {
                result = await courseAPI.updateStatus(token, id, status, notes)
            } else if (type === 'member') {
                result = await memberAPI.updateStatus(token, id, status, notes)
            } else {
                result = await consultationAPI.updateStatus(token, id, status, notes)
            }

            if (result.success) {
                toast({
                    title: "Cập nhật thành công!",
                    description: `Đã cập nhật trạng thái thành ${status}`,
                })

                if (type === 'course') {
                    fetchCourseRegistrations(currentCoursePage, searchTerm, statusFilter)
                } else if (type === 'member') {
                    fetchMemberRegistrations(currentMemberPage, statusFilter)
                } else {
                    fetchConsultationRegistrations(currentConsultationPage, statusFilter, typeFilter, searchTerm)
                }
            }
        } catch (error) {
            toast({
                title: "Cập nhật thất bại",
                description: handleApiError(error),
                variant: "destructive",
            })
        }
    }

    const deleteRegistration = async (type: 'course' | 'member' | 'consultation', id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa đăng ký này?')) return

        try {
            let result
            if (type === 'course') {
                result = await courseAPI.delete(token, id)
            } else if (type === 'member') {
                result = await memberAPI.delete(token, id)
            } else {
                result = await consultationAPI.delete(token, id)
            }

            if (result.success) {
                toast({
                    title: "Xóa thành công!",
                    description: "Đã xóa đăng ký",
                })

                if (type === 'course') {
                    fetchCourseRegistrations(currentCoursePage, searchTerm, statusFilter)
                } else if (type === 'member') {
                    fetchMemberRegistrations(currentMemberPage, statusFilter)
                } else {
                    fetchConsultationRegistrations(currentConsultationPage, statusFilter, typeFilter, searchTerm)
                }
            }
        } catch (error) {
            toast({
                title: "Xóa thất bại",
                description: handleApiError(error),
                variant: "destructive",
            })
        }
    }

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            pending: { label: "Chờ duyệt", variant: "secondary" as const },
            approved: { label: "Đã duyệt", variant: "default" as const },
            rejected: { label: "Từ chối", variant: "destructive" as const },
            completed: { label: "Hoàn thành", variant: "default" as const },
            active: { label: "Hoạt động", variant: "default" as const },
            inactive: { label: "Không hoạt động", variant: "secondary" as const },
            confirmed: { label: "Đã xác nhận", variant: "default" as const },
            cancelled: { label: "Đã hủy", variant: "destructive" as const },
            rescheduled: { label: "Đã dời lịch", variant: "secondary" as const }
        }

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
        return <Badge variant={config.variant}>{config.label}</Badge>
    }

    // Excel Export Functions
    const exportCourseRegistrationsToExcel = () => {
        try {
            const data = courseRegistrations.map((reg, index) => ({
                'STT': index + 1,
                'Họ và tên': reg.full_name,
                'Email': reg.email,
                'Số điện thoại': reg.phone,
                'Khóa học': reg.course_name,
                'Trạng thái': reg.status === 'pending' ? 'Chờ duyệt' : 
                            reg.status === 'approved' ? 'Đã duyệt' : 
                            reg.status === 'rejected' ? 'Từ chối' : reg.status,
                'Ngày đăng ký': new Date(reg.createdAt).toLocaleDateString('vi-VN'),
                'Ghi chú': reg.notes || ''
            }))

            const ws = XLSX.utils.json_to_sheet(data)
            const wb = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(wb, ws, "Đăng ký khóa học")
            
            // Auto-fit columns
            const colWidths = [
                { wch: 5 },  // STT
                { wch: 20 }, // Họ và tên
                { wch: 25 }, // Email
                { wch: 15 }, // Số điện thoại
                { wch: 20 }, // Khóa học
                { wch: 12 }, // Trạng thái
                { wch: 15 }, // Ngày đăng ký
                { wch: 30 }  // Ghi chú
            ]
            ws['!cols'] = colWidths

            const fileName = `danh-sach-dang-ky-khoa-hoc-${new Date().toISOString().split('T')[0]}.xlsx`
            XLSX.writeFile(wb, fileName)
            
            toast({
                title: "Xuất Excel thành công!",
                description: `Đã tải file ${fileName}`,
            })
        } catch (error) {
            toast({
                title: "Xuất Excel thất bại",
                description: "Có lỗi xảy ra khi xuất file Excel",
                variant: "destructive",
            })
        }
    }

    const exportMemberRegistrationsToExcel = () => {
        try {
            const data = memberRegistrations.map((reg, index) => ({
                'STT': index + 1,
                'Họ và tên': reg.full_name,
                'Email': reg.email,
                'Số điện thoại': reg.phone,
                'Trạng thái': reg.status === 'pending' ? 'Chờ duyệt' : 
                            reg.status === 'active' ? 'Hoạt động' : 
                            reg.status === 'inactive' ? 'Không hoạt động' : reg.status,
                'Ngày đăng ký': new Date(reg.createdAt).toLocaleDateString('vi-VN'),
                'Ghi chú': reg.notes || ''
            }))

            const ws = XLSX.utils.json_to_sheet(data)
            const wb = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(wb, ws, "Thành viên")
            
            // Auto-fit columns
            const colWidths = [
                { wch: 5 },  // STT
                { wch: 20 }, // Họ và tên
                { wch: 25 }, // Email
                { wch: 15 }, // Số điện thoại
                { wch: 12 }, // Trạng thái
                { wch: 15 }, // Ngày đăng ký
                { wch: 30 }  // Ghi chú
            ]
            ws['!cols'] = colWidths

            const fileName = `danh-sach-thanh-vien-${new Date().toISOString().split('T')[0]}.xlsx`
            XLSX.writeFile(wb, fileName)
            
            toast({
                title: "Xuất Excel thành công!",
                description: `Đã tải file ${fileName}`,
            })
        } catch (error) {
            toast({
                title: "Xuất Excel thất bại",
                description: "Có lỗi xảy ra khi xuất file Excel",
                variant: "destructive",
            })
        }
    }

    const exportConsultationRegistrationsToExcel = () => {
        try {
            const data = consultationRegistrations.map((reg, index) => ({
                'STT': index + 1,
                'Họ và tên': reg.full_name,
                'Email': reg.email,
                'Số điện thoại': reg.phone,
                'Loại tư vấn': reg.consultation_type === 'career' ? 'Nghề nghiệp' :
                              reg.consultation_type === 'study' ? 'Học tập' :
                              reg.consultation_type === 'personal' ? 'Cá nhân' : reg.consultation_type,
                'Trạng thái': reg.status === 'pending' ? 'Chờ duyệt' : 
                            reg.status === 'confirmed' ? 'Đã xác nhận' : 
                            reg.status === 'completed' ? 'Hoàn thành' :
                            reg.status === 'cancelled' ? 'Đã hủy' : 
                            reg.status === 'rescheduled' ? 'Đã dời lịch' : reg.status,
                'Ngày đăng ký': new Date(reg.createdAt).toLocaleDateString('vi-VN'),
                'Ghi chú': reg.additional_notes || ''
            }))

            const ws = XLSX.utils.json_to_sheet(data)
            const wb = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(wb, ws, "Đăng ký tư vấn")
            
            // Auto-fit columns
            const colWidths = [
                { wch: 5 },  // STT
                { wch: 20 }, // Họ và tên
                { wch: 25 }, // Email
                { wch: 15 }, // Số điện thoại
                { wch: 15 }, // Loại tư vấn
                { wch: 12 }, // Trạng thái
                { wch: 15 }, // Ngày đăng ký
                { wch: 30 }  // Ghi chú
            ]
            ws['!cols'] = colWidths

            const fileName = `danh-sach-dang-ky-tu-van-${new Date().toISOString().split('T')[0]}.xlsx`
            XLSX.writeFile(wb, fileName)
            
            toast({
                title: "Xuất Excel thành công!",
                description: `Đã tải file ${fileName}`,
            })
        } catch (error) {
            toast({
                title: "Xuất Excel thất bại",
                description: "Có lỗi xảy ra khi xuất file Excel",
                variant: "destructive",
            })
        }
    }

    if (!isLoggedIn) {
        return (
            <div className="grid min-h-svh lg:grid-cols-2">
                <div className="flex flex-col gap-4 p-6 md:p-10">
                    <div className="flex justify-center gap-2 md:justify-start">
                        <a href="#" className="flex items-center gap-2 font-medium">
                            <img 
                                src="/bhv-english-logo-transparent.png" 
                                alt="BHV English Logo" 
                                className="size-8 object-contain"
                            />
                            BHV English
                        </a>
                    </div>
                    <div className="flex flex-1 items-center justify-center">
                        <div className="w-full max-w-xs">
                            <LoginForm 
                                loginForm={loginForm}
                                isLoading={isLoading}
                                onFormChange={(field, value) => setLoginForm(prev => ({ ...prev, [field]: value }))}
                                onSubmit={handleLogin}
                            />
                        </div>
                    </div>
                </div>
                <div className="bg-muted relative hidden lg:block">
                    <img
                        src="/bhv-english-logo-transparent.png"
                        alt="BHV English Logo"
                        className="absolute inset-0 h-full w-full object-contain p-20 dark:brightness-[0.8]"
                    />
                </div>
            </div>
        )
    }

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AdminSidebar 
                onLogout={handleLogout} 
                currentTab={currentTab}
                onTabChange={setCurrentTab}
            />
            <SidebarInset>
                <AdminHeader title="Bảng điều khiển quản trị" />
                <div className="flex flex-1 flex-col">
                    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
                        {currentTab === "courses" && (
                            <Card>
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <CardTitle>Đăng ký khóa học</CardTitle>
                                            <CardDescription>Quản lý các đăng ký khóa học</CardDescription>
                                        </div>
                                        <Button
                                            onClick={exportCourseRegistrationsToExcel}
                                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                                        >
                                            <Download className="h-4 w-4" />
                                            Xuất Excel
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex gap-4 mb-6">
                                        <div className="flex-1">
                                            <Input
                                                placeholder="Tìm kiếm theo tên khóa học..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="max-w-sm"
                                            />
                                        </div>
                                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                                            <SelectTrigger className="w-48">
                                                <SelectValue placeholder="Lọc theo trạng thái" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Tất cả</SelectItem>
                                                <SelectItem value="pending">Chờ duyệt</SelectItem>
                                                <SelectItem value="approved">Đã duyệt</SelectItem>
                                                <SelectItem value="rejected">Từ chối</SelectItem>
                                                <SelectItem value="completed">Hoàn thành</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            onClick={() => fetchCourseRegistrations(1, searchTerm, statusFilter)}
                                            variant="outline"
                                        >
                                            <RefreshCw className="h-4 w-4 mr-2" />
                                            Làm mới
                                        </Button>
                                    </div>

                                    {isDataLoading ? (
                                        <div className="flex items-center justify-center py-8">
                                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                            <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
                                        </div>
                                    ) : (
                                        <div className="rounded-md border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Họ và tên</TableHead>
                                                        <TableHead>Email</TableHead>
                                                        <TableHead>Điện thoại</TableHead>
                                                        <TableHead>Khóa học</TableHead>
                                                        <TableHead>Ghi chú</TableHead>
                                                        <TableHead>Trạng thái</TableHead>
                                                        <TableHead>Ngày đăng ký</TableHead>
                                                        <TableHead className="w-[100px]">Thao tác</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {courseRegistrations.length === 0 ? (
                                                        <TableRow>
                                                            <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                                                Không có đăng ký nào
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : (
                                                        courseRegistrations.map((registration) => (
                                                            <TableRow key={registration._id}>
                                                                <TableCell className="font-medium">{registration.full_name}</TableCell>
                                                                <TableCell>{registration.email}</TableCell>
                                                                <TableCell>{registration.phone}</TableCell>
                                                                <TableCell>{registration.course_name}</TableCell>
                                                                <TableCell className="max-w-[200px] truncate" title={registration.notes || 'Không có'}>
                                                                    {registration.notes || 'Không có'}
                                                                </TableCell>
                                                                <TableCell>{getStatusBadge(registration.status)}</TableCell>
                                                                <TableCell>{new Date(registration.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                                                                <TableCell>
                                                                    <div className="flex gap-1">
                                                                        <Dialog>
                                                                            <DialogTrigger asChild>
                                                                                <Button variant="outline" size="sm">
                                                                                    <Eye className="h-4 w-4" />
                                                                                </Button>
                                                                            </DialogTrigger>
                                                                            <DialogContent>
                                                                                <DialogHeader>
                                                                                    <DialogTitle>Chi tiết đăng ký</DialogTitle>
                                                                                </DialogHeader>
                                                                                <div className="space-y-4">
                                                                                    <div>
                                                                                        <Label className="font-semibold">Họ và tên:</Label>
                                                                                        <p>{registration.full_name}</p>
                                                                                    </div>
                                                                                    <div>
                                                                                        <Label className="font-semibold">Email:</Label>
                                                                                        <p>{registration.email}</p>
                                                                                    </div>
                                                                                    <div>
                                                                                        <Label className="font-semibold">Điện thoại:</Label>
                                                                                        <p>{registration.phone}</p>
                                                                                    </div>
                                                                                    <div>
                                                                                        <Label className="font-semibold">Khóa học:</Label>
                                                                                        <p>{registration.course_name}</p>
                                                                                    </div>
                                                                                    {registration.notes && (
                                                                                        <div>
                                                                                            <Label className="font-semibold">Ghi chú:</Label>
                                                                                            <p>{registration.notes}</p>
                                                                                        </div>
                                                                                    )}
                                                                                    <div>
                                                                                        <Label className="font-semibold">Trạng thái:</Label>
                                                                                        <div className="mt-2">{getStatusBadge(registration.status)}</div>
                                                                                    </div>
                                                                                </div>
                                                                            </DialogContent>
                                                                        </Dialog>

                                                                        {registration.status === 'pending' && (
                                                                            <>
                                                                                <Button
                                                                                    variant="outline"
                                                                                    size="sm"
                                                                                    onClick={() => updateStatus('course', registration._id, 'approved')}
                                                                                >
                                                                                    <CheckCircle className="h-4 w-4" />
                                                                                </Button>
                                                                                <Button
                                                                                    variant="outline"
                                                                                    size="sm"
                                                                                    onClick={() => updateStatus('course', registration._id, 'rejected')}
                                                                                >
                                                                                    <XCircle className="h-4 w-4" />
                                                                                </Button>
                                                                            </>
                                                                        )}

                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={() => deleteRegistration('course', registration._id)}
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {currentTab === "members" && (
                            <Card>
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <CardTitle>Đăng ký thành viên</CardTitle>
                                            <CardDescription>Quản lý các đăng ký thành viên</CardDescription>
                                        </div>
                                        <Button
                                            onClick={exportMemberRegistrationsToExcel}
                                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                                        >
                                            <Download className="h-4 w-4" />
                                            Xuất Excel
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex gap-4 mb-6">
                                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                                            <SelectTrigger className="w-48">
                                                <SelectValue placeholder="Lọc theo trạng thái" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Tất cả</SelectItem>
                                                <SelectItem value="active">Hoạt động</SelectItem>
                                                <SelectItem value="inactive">Không hoạt động</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            onClick={() => fetchMemberRegistrations(1, statusFilter)}
                                            variant="outline"
                                        >
                                            <RefreshCw className="h-4 w-4 mr-2" />
                                            Làm mới
                                        </Button>
                                    </div>

                                    {isDataLoading ? (
                                        <div className="flex items-center justify-center py-8">
                                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                            <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
                                        </div>
                                    ) : (
                                        <div className="rounded-md border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Họ và tên</TableHead>
                                                        <TableHead>Email</TableHead>
                                                        <TableHead>Điện thoại</TableHead>
                                                        <TableHead>Trạng thái</TableHead>
                                                        <TableHead>Ngày đăng ký</TableHead>
                                                        <TableHead className="w-[100px]">Thao tác</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {memberRegistrations.length === 0 ? (
                                                        <TableRow>
                                                            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                                                Không có đăng ký nào
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : (
                                                        memberRegistrations.map((registration) => (
                                                            <TableRow key={registration._id}>
                                                                <TableCell className="font-medium">{registration.full_name}</TableCell>
                                                                <TableCell>{registration.email}</TableCell>
                                                                <TableCell>{registration.phone}</TableCell>
                                                                <TableCell>{getStatusBadge(registration.status)}</TableCell>
                                                                <TableCell>{new Date(registration.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                                                                <TableCell>
                                                                    <div className="flex gap-1">
                                                                        <Dialog>
                                                                            <DialogTrigger asChild>
                                                                                <Button variant="outline" size="sm">
                                                                                    <Eye className="h-4 w-4" />
                                                                                </Button>
                                                                            </DialogTrigger>
                                                                            <DialogContent>
                                                                                <DialogHeader>
                                                                                    <DialogTitle>Chi tiết thành viên</DialogTitle>
                                                                                </DialogHeader>
                                                                                <div className="space-y-4">
                                                                                    <div>
                                                                                        <Label className="font-semibold">Họ và tên:</Label>
                                                                                        <p>{registration.full_name}</p>
                                                                                    </div>
                                                                                    <div>
                                                                                        <Label className="font-semibold">Email:</Label>
                                                                                        <p>{registration.email}</p>
                                                                                    </div>
                                                                                    <div>
                                                                                        <Label className="font-semibold">Điện thoại:</Label>
                                                                                        <p>{registration.phone}</p>
                                                                                    </div>
                                                                                    <div>
                                                                                        <Label className="font-semibold">Trạng thái:</Label>
                                                                                        <div className="mt-2">{getStatusBadge(registration.status)}</div>
                                                                                    </div>
                                                                                </div>
                                                                            </DialogContent>
                                                                        </Dialog>

                                                                        {registration.status === 'inactive' ? (
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                onClick={() => updateStatus('member', registration._id, 'active')}
                                                                            >
                                                                                <CheckCircle className="h-4 w-4" />
                                                                            </Button>
                                                                        ) : (
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                onClick={() => updateStatus('member', registration._id, 'inactive')}
                                                                            >
                                                                                <XCircle className="h-4 w-4" />
                                                                            </Button>
                                                                        )}

                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={() => deleteRegistration('member', registration._id)}
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {currentTab === "consultations" && (
                            <Card>
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <CardTitle>Đăng ký tư vấn</CardTitle>
                                            <CardDescription>Quản lý các đăng ký tư vấn</CardDescription>
                                        </div>
                                        <Button
                                            onClick={exportConsultationRegistrationsToExcel}
                                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                                        >
                                            <Download className="h-4 w-4" />
                                            Xuất Excel
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex gap-4 mb-6">
                                        <div className="flex-1">
                                            <Input
                                                placeholder="Tìm kiếm theo tên, email, SĐT..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="max-w-sm"
                                            />
                                        </div>
                                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                                            <SelectTrigger className="w-48">
                                                <SelectValue placeholder="Lọc theo trạng thái" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Tất cả</SelectItem>
                                                <SelectItem value="pending">Chờ xử lý</SelectItem>
                                                <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                                                <SelectItem value="completed">Hoàn thành</SelectItem>
                                                <SelectItem value="cancelled">Đã hủy</SelectItem>
                                                <SelectItem value="rescheduled">Đã dời lịch</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                                            <SelectTrigger className="w-48">
                                                <SelectValue placeholder="Lọc theo loại" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Tất cả loại</SelectItem>
                                                <SelectItem value="career_guidance">Định hướng nghề nghiệp</SelectItem>
                                                <SelectItem value="skill_assessment">Đánh giá kỹ năng</SelectItem>
                                                <SelectItem value="course_recommendation">Tư vấn khóa học</SelectItem>
                                                <SelectItem value="job_placement">Hỗ trợ tìm việc</SelectItem>
                                                <SelectItem value="other">Khác</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            onClick={() => fetchConsultationRegistrations(1, statusFilter, typeFilter, searchTerm)}
                                            variant="outline"
                                        >
                                            <RefreshCw className="h-4 w-4 mr-2" />
                                            Làm mới
                                        </Button>
                                    </div>

                                    {isDataLoading ? (
                                        <div className="flex items-center justify-center py-8">
                                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                            <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
                                        </div>
                                    ) : (
                                        <div className="rounded-md border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Họ và tên</TableHead>
                                                        <TableHead>Email</TableHead>
                                                        <TableHead>Điện thoại</TableHead>
                                                        <TableHead>Loại tư vấn</TableHead>
                                                        <TableHead>Hình thức</TableHead>
                                                        <TableHead>Ngày mong muốn</TableHead>
                                                        <TableHead>Trạng thái</TableHead>
                                                        <TableHead className="w-[100px]">Thao tác</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {(consultationRegistrations || []).length === 0 ? (
                                                        <TableRow>
                                                            <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                                                Không có đăng ký nào
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : (
                                                        (consultationRegistrations || []).map((registration) => (
                                                            <TableRow key={registration._id}>
                                                                <TableCell className="font-medium">{registration.full_name}</TableCell>
                                                                <TableCell>{registration.email}</TableCell>
                                                                <TableCell>{registration.phone}</TableCell>
                                                                <TableCell>{registration.consultation_type_display}</TableCell>
                                                                <TableCell>
                                                                    {registration.consultation_method === 'online' ? 'Trực tuyến' :
                                                                     registration.consultation_method === 'offline' ? 'Trực tiếp' : 'Điện thoại'}
                                                                </TableCell>
                                                                <TableCell>{new Date(registration.preferred_date).toLocaleDateString('vi-VN')}</TableCell>
                                                                <TableCell>{getStatusBadge(registration.status)}</TableCell>
                                                                <TableCell>
                                                                    <div className="flex gap-1">
                                                                        <Dialog>
                                                                            <DialogTrigger asChild>
                                                                                <Button variant="outline" size="sm">
                                                                                    <Eye className="h-4 w-4" />
                                                                                </Button>
                                                                            </DialogTrigger>
                                                                            <DialogContent className="max-w-2xl">
                                                                                <DialogHeader>
                                                                                    <DialogTitle>Chi tiết đăng ký tư vấn</DialogTitle>
                                                                                </DialogHeader>
                                                                                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                                                                                    <div className="grid grid-cols-2 gap-4">
                                                                                        <div>
                                                                                            <Label className="font-semibold">Họ và tên:</Label>
                                                                                            <p>{registration.full_name}</p>
                                                                                        </div>
                                                                                        <div>
                                                                                            <Label className="font-semibold">Email:</Label>
                                                                                            <p>{registration.email}</p>
                                                                                        </div>
                                                                                        <div>
                                                                                            <Label className="font-semibold">Điện thoại:</Label>
                                                                                            <p>{registration.phone}</p>
                                                                                        </div>
                                                                                        <div>
                                                                                            <Label className="font-semibold">Loại tư vấn:</Label>
                                                                                            <p>{registration.consultation_type_display}</p>
                                                                                        </div>
                                                                                        <div>
                                                                                            <Label className="font-semibold">Hình thức:</Label>
                                                                                            <p>{registration.consultation_method === 'online' ? 'Trực tuyến' :
                                                                                               registration.consultation_method === 'offline' ? 'Trực tiếp' : 'Điện thoại'}</p>
                                                                                        </div>
                                                                                        <div>
                                                                                            <Label className="font-semibold">Ngày mong muốn:</Label>
                                                                                            <p>{new Date(registration.preferred_date).toLocaleDateString('vi-VN')}</p>
                                                                                        </div>
                                                                                        <div>
                                                                                            <Label className="font-semibold">Khung giờ:</Label>
                                                                                            <p>{registration.preferred_time === 'morning' ? 'Buổi sáng' :
                                                                                               registration.preferred_time === 'afternoon' ? 'Buổi chiều' : 'Buổi tối'}</p>
                                                                                        </div>
                                                                                        <div>
                                                                                            <Label className="font-semibold">Tình trạng hiện tại:</Label>
                                                                                            <p>{registration.current_status || 'Không có'}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div>
                                                                                        <Label className="font-semibold">Mục tiêu:</Label>
                                                                                        <p>{registration.goals || 'Không có'}</p>
                                                                                    </div>
                                                                                    {registration.additional_notes && (
                                                                                        <div>
                                                                                            <Label className="font-semibold">Ghi chú thêm:</Label>
                                                                                            <p>{registration.additional_notes}</p>
                                                                                        </div>
                                                                                    )}
                                                                                    {registration.consultation_notes && (
                                                                                        <div>
                                                                                            <Label className="font-semibold">Ghi chú tư vấn:</Label>
                                                                                            <p>{registration.consultation_notes}</p>
                                                                                        </div>
                                                                                    )}
                                                                                    <div>
                                                                                        <Label className="font-semibold">Trạng thái:</Label>
                                                                                        <div className="mt-2">{getStatusBadge(registration.status)}</div>
                                                                                    </div>
                                                                                </div>
                                                                            </DialogContent>
                                                                        </Dialog>

                                                                        {registration.status === 'pending' && (
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                onClick={() => updateStatus('consultation', registration._id, 'confirmed')}
                                                                            >
                                                                                <CheckCircle className="h-4 w-4" />
                                                                            </Button>
                                                                        )}

                                                                        {(registration.status === 'confirmed' || registration.status === 'rescheduled') && (
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                onClick={() => updateStatus('consultation', registration._id, 'completed')}
                                                                            >
                                                                                <CheckCircle className="h-4 w-4" />
                                                                            </Button>
                                                                        )}

                                                                        {(registration.status === 'pending' || registration.status === 'confirmed') && (
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                onClick={() => updateStatus('consultation', registration._id, 'cancelled')}
                                                                            >
                                                                                <XCircle className="h-4 w-4" />
                                                                            </Button>
                                                                        )}

                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={() => deleteRegistration('consultation', registration._id)}
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
