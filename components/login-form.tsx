"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { LoginCredentials } from "@/lib/api"

interface LoginFormProps {
  className?: string
  loginForm: LoginCredentials
  isLoading: boolean
  onFormChange: (field: keyof LoginCredentials, value: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export function LoginForm({
  className,
  loginForm,
  isLoading,
  onFormChange,
  onSubmit,
  ...props
}: LoginFormProps) {
  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={onSubmit} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Đăng nhập quản trị</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Nhập thông tin đăng nhập để truy cập trang quản trị
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="admin@example.com" 
            value={loginForm.email}
            onChange={(e) => onFormChange('email', e.target.value)}
            required 
          />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Mật khẩu</Label>
          </div>
          <Input 
            id="password" 
            type="password" 
            value={loginForm.password}
            onChange={(e) => onFormChange('password', e.target.value)}
            required 
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang đăng nhập...
            </>
          ) : (
            "Đăng nhập"
          )}
        </Button>
      </div>
    </form>
  )
}
