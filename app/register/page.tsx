"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    password: "",
    organization: "",
    jobRole: "",
    sex: "",
    location: "Detecting location...",
  })
  const [step, setStep] = useState(1)
  const [otp, setOtp] = useState("")
  const [generatedOtp, setGeneratedOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    setIsClient(true)

    // Get user's location
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            )
            const data = await response.json()
            const location = data.display_name || `${latitude}, ${longitude}`
            setFormData((prev) => ({ ...prev, location }))
          } catch (error) {
            setFormData((prev) => ({ ...prev, location: "Location detection failed" }))
          }
        },
        () => {
          setFormData((prev) => ({ ...prev, location: "Location access denied" }))
        },
      )
    } else {
      setFormData((prev) => ({ ...prev, location: "Geolocation not supported" }))
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Name is required",
        variant: "destructive",
      })
      return false
    }

    if (!formData.age.trim() || isNaN(Number(formData.age)) || Number(formData.age) <= 0) {
      toast({
        title: "Valid age is required",
        variant: "destructive",
      })
      return false
    }

    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      toast({
        title: "Valid email is required",
        variant: "destructive",
      })
      return false
    }

    if (!formData.password.trim() || formData.password.length < 6) {
      toast({
        title: "Password must be at least 6 characters",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const sendOtp = async () => {
    if (!validateStep1()) return

    setIsLoading(true)

    try {
      // In a real app, this would be an API call to send an OTP
      // Simulating OTP generation for demo purposes
      const randomOtp = Math.floor(100000 + Math.random() * 900000).toString()
      setGeneratedOtp(randomOtp)

      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "OTP sent",
        description: `An OTP has been sent to ${formData.email}. For demo purposes, the OTP is: ${randomOtp}`,
      })

      setStep(2)
    } catch (error) {
      toast({
        title: "Failed to send OTP",
        description: "An error occurred while sending the OTP",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const verifyOtp = async () => {
    if (otp !== generatedOtp) {
      toast({
        title: "Invalid OTP",
        description: "The OTP you entered is incorrect",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // In a real app, this would be an API call to register the user
      // Simulating user registration for demo purposes
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (isClient) {
        // Store user in localStorage (for demo purposes)
        const users = JSON.parse(localStorage.getItem("users") || "[]")
        users.push(formData)
        localStorage.setItem("users", JSON.stringify(users))

        toast({
          title: "Registration successful",
          description: "You can now login with your credentials",
        })

        router.push("/")
      }
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "An error occurred during registration",
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
              <h2 className="text-3xl font-bold">Welcome to</h2>
              <h1 className="mt-2 text-4xl font-bold">AI powered Trademark Search</h1>
              <p className="mt-6">
                Create an account to access the official Indian Trademark Search Portal with enhanced AI capabilities.
              </p>
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
              <h2 className="text-2xl font-bold text-primary-700">Welcome to</h2>
              <h1 className="text-3xl font-bold text-primary-700">AI powered Trademark Search</h1>
            </div>
            <Card>
              <CardContent className="pt-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold">Register</h2>
                </div>
              </CardContent>
              {step === 1 ? (
                <>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">
                        Age <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="age"
                        name="age"
                        type="number"
                        placeholder="Enter your age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">
                        Password <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="organization">Organization</Label>
                      <Input
                        id="organization"
                        name="organization"
                        placeholder="Enter your organization"
                        value={formData.organization}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jobRole">Job Role</Label>
                      <Select value={formData.jobRole} onValueChange={(value) => handleSelectChange("jobRole", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your job role" />
                        </SelectTrigger>
                        <SelectContent className="max-h-80">
                          <SelectItem value="individual-inventor">Individual Inventor</SelectItem>
                          <SelectItem value="startup-founder">Startup Founder / Entrepreneur</SelectItem>
                          <SelectItem value="organization">Organization (Small/Medium/Large)</SelectItem>
                          <SelectItem value="ip-lawyer">IP Lawyer</SelectItem>
                          <SelectItem value="trademark-agent">Trademark Agent / Consultant</SelectItem>
                          <SelectItem value="university">University / Educational Institution</SelectItem>
                          <SelectItem value="government-officer">Government Officer / Examiner / Controller</SelectItem>
                          <SelectItem value="rd-organization">R&D Organization Representative</SelectItem>
                          <SelectItem value="foreign-applicant">Foreign Applicant</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Sex</Label>
                      <RadioGroup value={formData.sex} onValueChange={(value) => handleSelectChange("sex", value)}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="male" id="male" />
                          <Label htmlFor="male">Male</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="female" id="female" />
                          <Label htmlFor="female">Female</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="other" id="other" />
                          <Label htmlFor="other">Other</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="space-y-2">
                      <Label>Location (Auto-detected)</Label>
                      <Input value={formData.location} disabled />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4">
                    <Button
                      className="w-full bg-primary-600 hover:bg-primary-700"
                      onClick={sendOtp}
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending OTP..." : "Continue"}
                    </Button>
                    <div className="text-center text-sm">
                      Already have an account?{" "}
                      <Link href="/" className="text-primary-600 hover:underline">
                        Login
                      </Link>
                    </div>
                  </CardFooter>
                </>
              ) : (
                <>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <p className="mb-4">We&apos;ve sent a verification code to your email address.</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="otp">Enter OTP</Label>
                      <Input
                        id="otp"
                        placeholder="Enter the 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                      />
                      <p className="text-xs text-gray-500">For demo purposes, the OTP is: {generatedOtp}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4">
                    <Button
                      className="w-full bg-primary-600 hover:bg-primary-700"
                      onClick={verifyOtp}
                      disabled={isLoading}
                    >
                      {isLoading ? "Verifying..." : "Verify & Register"}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-primary-600 text-primary-600 hover:bg-primary-50"
                      onClick={() => setStep(1)}
                      disabled={isLoading}
                    >
                      Back
                    </Button>
                  </CardFooter>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
