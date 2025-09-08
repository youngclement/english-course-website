"use client"

import { useState, useEffect } from "react"
import { IELTSStudent } from "@/components/ielts-student"
import { LoginForm } from "@/components/login-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { authAPI, LoginCredentials } from "@/lib/api"

export default function IELTSPage() {
    const { toast } = useToast()
    const [token, setToken] = useState<string>("")
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    
    // Login form state
    const [loginForm, setLoginForm] = useState<LoginCredentials>({
        email: "",
        password: ""
    })

    // Check for existing token on mount
    useEffect(() => {
        const savedToken = localStorage.getItem("student_token") || localStorage.getItem("admin_token")
        if (savedToken) {
            setToken(savedToken)
            setIsLoggedIn(true)
        }
    }, [])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const result = await authAPI.login(loginForm)

            if (result.success && result.data) {
                setToken(result.data.token)
                setIsLoggedIn(true)
                localStorage.setItem("student_token", result.data.token)
                toast({
                    title: "Login Successful",
                    description: "Welcome to IELTS Practice Tests!",
                })
            } else {
                toast({
                    title: "Login Failed",
                    description: result.message || "Invalid credentials",
                    variant: "destructive",
                })
            }
        } catch (error: any) {
            toast({
                title: "Login Failed",
                description: error.message || "Something went wrong",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("student_token")
        setToken("")
        setIsLoggedIn(false)
        setLoginForm({ email: "", password: "" })
        toast({
            title: "Logged Out",
            description: "You have been logged out successfully",
        })
    }

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold">IELTS Practice Tests</CardTitle>
                        <CardDescription>
                            Login to access IELTS practice tests and track your progress
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-1">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={loginForm.email}
                                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium mb-1">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={loginForm.password}
                                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isLoading && (
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                Sign In
                            </button>
                        </form>
                        <div className="mt-4 text-center text-sm text-gray-600">
                            <p>Demo Credentials:</p>
                            <p><strong>Email:</strong> admin@example.com</p>
                            <p><strong>Password:</strong> admin123</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-semibold">IELTS Practice Tests</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleLogout}
                                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <IELTSStudent token={token} />
            </div>
        </div>
    )
}
