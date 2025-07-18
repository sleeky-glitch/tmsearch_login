"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, Search, UserCog, LogOut, Shield } from "lucide-react"
import { maskPassword, encryptPassword } from "@/utils/crypto"

// Define the User type
interface User {
  name: string
  email: string
  password: string
  age: string
  organization: string
  jobRole: string
  sex: string
  location: string
  lastLogin?: string
  status?: "active" | "inactive" | "locked"
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showPasswords, setShowPasswords] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is admin (in a real app, this would be a proper auth check)
    const checkAdmin = () => {
      // For demo purposes, we'll consider any logged-in user as admin
      const currentUser = localStorage.getItem("currentUser")
      if (currentUser) {
        setIsAdmin(true)
        return true
      }
      return false
    }

    if (!checkAdmin()) {
      toast({
        title: "Access denied",
        description: "You must be logged in as an administrator to view this page.",
        variant: "destructive",
      })
      router.push("/")
      return
    }

    // Load users from localStorage
    const loadUsers = () => {
      try {
        const storedUsers = JSON.parse(localStorage.getItem("users") || "[]")

        // Add demo data if no users exist
        if (storedUsers.length === 0) {
          const demoUsers: User[] = [
            {
              name: "Admin User",
              email: "admin@example.com",
              password: encryptPassword("Admin123!"),
              age: "35",
              organization: "Trademark Office",
              jobRole: "government-officer",
              sex: "male",
              location: "New Delhi, India",
              lastLogin: new Date().toISOString(),
              status: "active",
            },
            {
              name: "Jane Smith",
              email: "jane@example.com",
              password: encryptPassword("Jane123!"),
              age: "28",
              organization: "Legal Firm LLP",
              jobRole: "ip-lawyer",
              sex: "female",
              location: "Mumbai, India",
              lastLogin: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
              status: "active",
            },
            {
              name: "Raj Patel",
              email: "raj@startup.co",
              password: encryptPassword("Startup123!"),
              age: "31",
              organization: "Tech Startup",
              jobRole: "startup-founder",
              sex: "male",
              location: "Bangalore, India",
              lastLogin: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
              status: "active",
            },
            {
              name: "Priya Sharma",
              email: "priya@university.edu",
              password: encryptPassword("Univ123!"),
              age: "42",
              organization: "National Law University",
              jobRole: "university",
              sex: "female",
              location: "Chennai, India",
              lastLogin: null,
              status: "inactive",
            },
          ]

          localStorage.setItem("users", JSON.stringify(demoUsers))
          setUsers(demoUsers)
          setFilteredUsers(demoUsers)
        } else {
          // Add status and lastLogin if they don't exist
          const enhancedUsers = storedUsers.map((user: User) => ({
            ...user,
            status: user.status || "active",
            lastLogin: user.lastLogin || null,
          }))
          setUsers(enhancedUsers)
          setFilteredUsers(enhancedUsers)
        }
      } catch (error) {
        console.error("Error loading users:", error)
        toast({
          title: "Error loading users",
          description: "There was a problem loading the user data.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadUsers()
  }, [router, toast])

  // Filter users based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users)
      return
    }

    const lowerCaseSearch = searchTerm.toLowerCase()
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(lowerCaseSearch) ||
        user.email.toLowerCase().includes(lowerCaseSearch) ||
        user.organization.toLowerCase().includes(lowerCaseSearch) ||
        user.jobRole.toLowerCase().includes(lowerCaseSearch),
    )
    setFilteredUsers(filtered)
  }, [searchTerm, users])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never"
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const getJobRoleLabel = (role: string) => {
    const roles: Record<string, string> = {
      "individual-inventor": "Individual Inventor",
      "startup-founder": "Startup Founder",
      organization: "Organization",
      "ip-lawyer": "IP Lawyer",
      "trademark-agent": "Trademark Agent",
      university: "University",
      "government-officer": "Government Officer",
      "rd-organization": "R&D Organization",
      "foreign-applicant": "Foreign Applicant",
      other: "Other",
    }
    return roles[role] || role
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "inactive":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            Inactive
          </Badge>
        )
      case "locked":
        return <Badge variant="destructive">Locked</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  if (!isAdmin) {
    return null // Prevent flash of content before redirect
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
        <Button variant="outline" className="gap-2" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>User Management</CardTitle>
          <CardDescription>View and manage all registered users in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search users..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2" onClick={() => setShowPasswords(!showPasswords)}>
              {showPasswords ? (
                <>
                  <EyeOff className="h-4 w-4" /> Hide Passwords
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" /> Show Passwords
                </>
              )}
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Password (Encrypted)</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Loading users...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {showPasswords ? user.password : maskPassword(user.password)}
                      </TableCell>
                      <TableCell>{getJobRoleLabel(user.jobRole)}</TableCell>
                      <TableCell>{getStatusBadge(user.status || "active")}</TableCell>
                      <TableCell>{formatDate(user.lastLogin || null)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            Admin Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-yellow-50 p-4 text-sm text-yellow-800">
            <p className="font-medium">Demo Information</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>
                This is a demo admin dashboard. In a real application, this would be secured with proper authentication.
              </li>
              <li>
                Passwords are encrypted for display purposes but are not securely hashed as they would be in production.
              </li>
              <li>User data is stored in the browser's localStorage for demo purposes only.</li>
              <li>In a production environment, implement proper server-side authentication and authorization.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
