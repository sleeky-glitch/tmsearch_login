"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

export default function Home() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Set isClient to true when component mounts on client
  useEffect(() => {
    setIsClient(true)

    // Check for remembered email only on the client side
    const rememberedEmail = localStorage.getItem("rememberedEmail")
    if (rememberedEmail) {
      setEmail(rememberedEmail)
      setRememberMe(true)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real app, this would be an API call to your authentication endpoint
      // Simulating authentication for demo purposes
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (isClient) {
        // Check if user exists in localStorage (for demo purposes)
        const users = JSON.parse(localStorage.getItem("users") || "[]")
        const user = users.find((u: any) => u.email === email && u.password === password)

        if (user) {
          // If remember me is checked, store the email in localStorage
          if (rememberMe) {
            localStorage.setItem("rememberedEmail", email)
          } else {
            localStorage.removeItem("rememberedEmail")
          }

          localStorage.setItem("currentUser", JSON.stringify(user))
          toast({
            title: "Login successful",
            description: "Redirecting to trademark search portal...",
          })

          // Redirect to the trademark search portal
          window.location.href = "https://tmsearch.ipindia.gov.in/ords/r/tisa/trademark_search/dpiit-public-search"
        } else {
          toast({
            title: "Login failed",
            description: "Invalid email or password",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An error occurred during login",
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
                Access the official Indian Trademark Search Portal with enhanced AI capabilities for better search
                results and analysis.
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
              <form onSubmit={handleLogin}>
                <CardContent className="pt-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold">Login</h2>
                  </div>
                  <div className="space-y-4">
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
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link href="/reset-password" className="text-sm text-primary-600 hover:underline">
                          Reset Password
                        </Link>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      />
                      <Label htmlFor="remember" className="text-sm font-normal">
                        Remember Password
                      </Label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button type="submit" className="w-full bg-primary-600 hover:bg-primary-700" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                  <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="text-primary-600 hover:underline">
                      Sign up
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
