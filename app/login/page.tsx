"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useApp } from "@/lib/app-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Shield, ArrowLeft, Mail, Lock, User, Phone, AlertTriangle, Sparkles, UserCircle, Building, HeartHandshake } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { login, demoLogin, signup, signInWithGoogle, demoMode, setDemoMode } = useApp()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  
  // Signup form state
  const [signupName, setSignupName] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPhone, setSignupPhone] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    
    try {
      const success = await login(loginEmail, loginPassword)
      if (success) {
        // Redirect based on email pattern
        if (loginEmail.includes("admin")) {
          router.push("/admin")
        } else if (loginEmail.includes("responder")) {
          router.push("/responder")
        } else {
          router.push("/dashboard")
        }
      }
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    
    try {
      const success = await signup({
        email: signupEmail,
        name: signupName,
        phone: signupPhone,
        password: signupPassword,
      })
      if (success) {
        router.push("/dashboard")
      }
    } catch (err: any) {
      setError(err.message || "Signup failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleDemoLogin = (role: "user" | "admin" | "responder") => {
    demoLogin(role)
    router.push(role === "user" ? "/dashboard" : role === "admin" ? "/admin" : "/responder")
  }

  const handleGoogleSignIn = async () => {
    setError("")
    setIsLoading(true)
    try {
      const success = await signInWithGoogle()
      if (success) {
        router.push("/dashboard")
      }
      // If success is false but no error thrown, the user likely closed the popup manually
    } catch {
      setError("Something went wrong with Google sign-in.")
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent" />
      <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />
      <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-red-500/5 blur-3xl" />
      
      {/* Header */}
      <header className="relative border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/20">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">CrisisResponse</span>
          </div>
          <div className="w-24" />
        </div>
      </header>

      <main className="container relative mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Demo Mode Toggle */}
          <div className="mb-6 flex items-center justify-center">
            <div className="inline-flex items-center gap-3 rounded-full border border-border bg-background/80 backdrop-blur px-4 py-2 shadow-lg">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium">Demo Mode</span>
              </div>
              <button
                type="button"
                onClick={() => setDemoMode(!demoMode)}
                className={`relative h-6 w-11 rounded-full transition-all duration-200 ${
                  demoMode ? "bg-gradient-to-r from-amber-500 to-orange-500" : "bg-muted"
                }`}
              >
                <span
                  className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    demoMode ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <Badge variant={demoMode ? "default" : "secondary"} className={`text-xs ${demoMode ? "bg-amber-500 hover:bg-amber-600" : ""}`}>
                {demoMode ? "ON" : "OFF"}
              </Badge>
            </div>
          </div>

          <Card className="border-2 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/30">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription>
                Sign in to access your emergency dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:text-white">Sign In</TabsTrigger>
                  <TabsTrigger value="signup" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:text-white">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="mt-0">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-sm font-medium">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="you@example.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="pl-10 h-12 border-2 focus:border-red-500/50"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-sm font-medium">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="Enter your password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="pl-10 h-12 border-2 focus:border-red-500/50"
                          required
                        />
                      </div>
                    </div>
                    
                    {error && (
                      <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                        <AlertTriangle className="h-4 w-4" />
                        {error}
                      </div>
                    )}
                    
                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/25" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup" className="mt-0">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name" className="text-sm font-medium">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="John Doe"
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          className="pl-10 h-12 border-2 focus:border-red-500/50"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-sm font-medium">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="you@example.com"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          className="pl-10 h-12 border-2 focus:border-red-500/50"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-phone" className="text-sm font-medium">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="signup-phone"
                          type="tel"
                          placeholder="+1 555-0123"
                          value={signupPhone}
                          onChange={(e) => setSignupPhone(e.target.value)}
                          className="pl-10 h-12 border-2 focus:border-red-500/50"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-sm font-medium">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="Create a password"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          className="pl-10 h-12 border-2 focus:border-red-500/50"
                          required
                        />
                      </div>
                    </div>
                    
                    {error && (
                      <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                        <AlertTriangle className="h-4 w-4" />
                        {error}
                      </div>
                    )}
                    
                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/25" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              {/* Google Sign In */}
              <div className="mt-6 space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full h-12 border-2 hover:bg-muted font-medium flex items-center justify-center gap-2"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.16H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.84l3.66-2.75z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.16l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </Button>
              </div>

              {/* Demo Quick Access */}
              <div className="mt-8 border-t border-border pt-6">
                <p className="mb-4 text-center text-sm text-muted-foreground">
                  Quick Demo Access
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleDemoLogin("user")}
                    disabled={isLoading}
                    className="flex flex-col items-center gap-1.5 h-auto py-3 border-2 hover:border-red-500/30 hover:bg-red-500/5"
                  >
                    <UserCircle className="h-5 w-5 text-blue-500" />
                    <span className="text-xs">User</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleDemoLogin("admin")}
                    disabled={isLoading}
                    className="flex flex-col items-center gap-1.5 h-auto py-3 border-2 hover:border-red-500/30 hover:bg-red-500/5"
                  >
                    <Building className="h-5 w-5 text-violet-500" />
                    <span className="text-xs">Admin</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleDemoLogin("responder")}
                    disabled={isLoading}
                    className="flex flex-col items-center gap-1.5 h-auto py-3 border-2 hover:border-red-500/30 hover:bg-red-500/5"
                  >
                    <HeartHandshake className="h-5 w-5 text-emerald-500" />
                    <span className="text-xs">Responder</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </main>
    </div>
  )
}
