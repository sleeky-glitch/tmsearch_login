"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, Check, X } from "lucide-react"

export default function RecoverPasswordPage({ params }: { params: { token: string } }) {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isTokenValid, setIsTokenValid] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const { token } = params

  // Password strength criteria
  const hasMinLength = password.length >= 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password)
  const passwordsMatch = password === confirmPassword && password !== ""

  // Check if token is valid (in a real app, this would verify with the backend)
  useEffect(() => {
    // Simulate token validation
    const validateToken = async () => {
      try {
        // In a real app, this would be an API call to validate the token
        // For demo purposes, we'll consider tokens with length >= 10 as valid
        if (token.length < 10) {
          setIsTokenValid(false)
          toast({
            title: "Invalid or expired token",
            description: "This password reset link is invalid or has expired.",
            variant: "destructive",
          })
        }
      } catch (error) {
        setIsTokenValid(false)
        toast({
          title: "Error validating token",
          description: "An error occurred while validating your reset link.",
          variant: "destructive",
        })
      }
    }

    validateToken()
  }, [token, toast])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!passwordsMatch) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure both passwords match.",
        variant: "destructive",
      })
      return
    }

    if (!(hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar)) {
      toast({
        title: "Password too weak",
        description: "Please ensure your password meets all the requirements.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // In a real app, this would be an API call to reset the password
      // Simulating password reset for demo purposes
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, update the user in localStorage if they exist
      if (typeof window !== "undefined") {
        const users = JSON.parse(localStorage.getItem("users") || "[]")
        // In a real app, you would use the token to identify the user
        // For demo, we'll just update the first user
        if (users.length > 0) {
          users[0].password = btoa(password) // Simple base64 encoding for demo
          localStorage.setItem("users", JSON.stringify(users))
        }
      }

      setIsSuccess(true)
      toast({
        title: "Password reset successful",
        description: "Your password has been reset successfully.",
      })
    } catch (error) {
      toast({
        title: "Failed to reset password",
        description: "An error occurred while resetting your password.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isTokenValid) {
    return (
      <div className="flex min-h-[calc(100vh-5rem)] bg-gradient-to-br from-primary-600 to-primary-800 p-4">
        <div className="m-auto w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Invalid Reset Link</CardTitle>
              <CardDescription className="text-center">
                This password reset link is invalid or has expired.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center">
              <Button asChild>
                <Link href="/reset-password">Request a new reset link</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-5rem)] bg-gradient-to-br from-primary-600 to-primary-800 p-4">
      <div className="m-auto w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Reset Your Password</CardTitle>
            <CardDescription className="text-center">Create a new password for your account</CardDescription>
          </CardHeader>
          {!isSuccess ? (
            <form onSubmit={handleResetPassword}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                      <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2 rounded-md border p-3">
                  <p className="text-sm font-medium">Password must have:</p>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      {hasMinLength ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-gray-300" />
                      )}
                      <span className={hasMinLength ? "text-green-500" : "text-gray-500"}>At least 8 characters</span>
                    </li>
                    <li className="flex items-center gap-2">
                      {hasUppercase ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-gray-300" />
                      )}
                      <span className={hasUppercase ? "text-green-500" : "text-gray-500"}>
                        At least one uppercase letter
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      {hasLowercase ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-gray-300" />
                      )}
                      <span className={hasLowercase ? "text-green-500" : "text-gray-500"}>
                        At least one lowercase letter
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      {hasNumber ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-gray-300" />
                      )}
                      <span className={hasNumber ? "text-green-500" : "text-gray-500"}>At least one number</span>
                    </li>
                    <li className="flex items-center gap-2">
                      {hasSpecialChar ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-gray-300" />
                      )}
                      <span className={hasSpecialChar ? "text-green-500" : "text-gray-500"}>
                        At least one special character
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      {passwordsMatch && confirmPassword ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-gray-300" />
                      )}
                      <span className={passwordsMatch && confirmPassword ? "text-green-500" : "text-gray-500"}>
                        Passwords match
                      </span>
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full bg-primary-600 hover:bg-primary-700" disabled={isLoading}>
                  {isLoading ? "Resetting Password..." : "Reset Password"}
                </Button>
              </CardFooter>
            </form>
          ) : (
            <CardContent className="space-y-4">
              <div className="rounded-md bg-green-50 p-4 text-center">
                <div className="flex justify-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <h3 className="mt-3 text-lg font-medium text-green-800">Password Reset Successful</h3>
                <p className="mt-2 text-sm text-green-700">
                  Your password has been reset successfully. You can now log in with your new password.
                </p>
                <div className="mt-4">
                  <Button asChild className="w-full bg-primary-600 hover:bg-primary-700">
                    <Link href="/">Go to Login</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
