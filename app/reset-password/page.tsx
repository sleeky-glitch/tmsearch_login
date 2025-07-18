"use client"

import { CardFooter } from "@/components/ui/card"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real app, this would be an API call to your password reset endpoint
      // Simulating password reset for demo purposes
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsSubmitted(true)

      toast({
        title: "Reset link sent",
        description: `A password reset link has been sent to ${email}`,
      })
    } catch (error) {
      toast({
        title: "Failed to send reset link",
        description: "An error occurred while sending the reset link",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-5rem)] bg-gradient-to-br from-primary-600 to-primary-800 p-4">
      <div className="m-auto flex w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="hidden w-1/2 bg-gradient-to-br from-primary-400 to-primary-700 p-12 text-white md:block">
          <div className="flex h-full flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold">Reset Password</h2>
              <h1 className="mt-2 text-4xl font-bold">AI powered Trademark Search</h1>
              <p className="mt-6">Enter your email address and we'll send you a link to reset your password.</p>
            </div>
            <div className="text-sm">
              <p>© 2024 Department for Promotion of Industry and Internal Trade</p>
              <p>Government of India</p>
            </div>
          </div>
        </div>
        <div className="w-full p-8 md:w-1/2">
          <div className="flex h-full flex-col justify-center">
            <div className="mb-8 text-center md:hidden">
              <h2 className="text-2xl font-bold text-primary-700">Reset Password</h2>
              <h1 className="text-3xl font-bold text-primary-700">AI powered Trademark Search</h1>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Reset Password</CardTitle>
                <CardDescription className="text-center">
                  Enter your email to receive a password reset link
                </CardDescription>
              </CardHeader>
              {!isSubmitted ? (
                <form onSubmit={handleResetPassword}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full bg-primary-600 hover:bg-primary-700" disabled={isLoading}>
                      {isLoading ? "Sending..." : "Send Reset Link"}
                    </Button>
                    <div className="text-center text-sm">
                      <Link href="/" className="text-primary-600 hover:underline">
                        Back to Login
                      </Link>
                    </div>
                  </CardFooter>
                </form>
              ) : (
                <CardContent className="space-y-4">
                  <div className="rounded-md bg-green-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-800">Reset link sent to {email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Please check your email for the password reset link. If you don't see it, check your spam folder.
                    </p>
                  </div>
                  <div className="text-center pt-4">
                    <Link href="/" className="text-primary-600 hover:underline">
                      Return to Login
                    </Link>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
