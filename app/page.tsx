import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Shield, 
  MapPin, 
  Users, 
  Bell, 
  Phone, 
  Clock, 
  ChevronRight, 
  AlertTriangle,
  Zap,
  CheckCircle,
  ArrowRight,
  Star,
  Globe,
  Lock
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/20">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">CrisisResponse</span>
          </div>
          <nav className="hidden items-center gap-8 md:flex">
            <Link href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              How It Works
            </Link>
            <Link href="#safety" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Safety
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/login">
              <Button size="sm" className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/20">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-transparent" />
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-red-500/5 blur-3xl" />
        
        <div className="container relative mx-auto px-4 py-24 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-6 bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20">
              <AlertTriangle className="mr-1 h-3 w-3" />
              Emergency Response System
            </Badge>
            
            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Your Safety,{" "}
              <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                One Tap Away
              </span>
            </h1>
            
            <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
              Instant emergency alerts with real-time location tracking. Notify your contacts 
              and nearby services in seconds when you need help most.
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/login">
                <Button size="lg" className="gap-2 px-8 h-14 text-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-xl shadow-red-500/25">
                  Start Free Trial
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="outline" size="lg" className="px-8 h-14 text-lg border-2">
                  See How It Works
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <span>Free to use</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <span>Works worldwide</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Zap className="h-6 w-6 text-red-500" />
                <p className="text-4xl font-bold text-foreground">{"<"}5s</p>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Average Response</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Clock className="h-6 w-6 text-red-500" />
                <p className="text-4xl font-bold text-foreground">24/7</p>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Always Available</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <MapPin className="h-6 w-6 text-red-500" />
                <p className="text-4xl font-bold text-foreground">GPS</p>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Precision Tracking</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Globe className="h-6 w-6 text-red-500" />
                <p className="text-4xl font-bold text-foreground">Multi</p>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Channel Alerts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <Badge variant="outline" className="mb-4">Features</Badge>
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              Complete Emergency Response System
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to stay safe and connected in any emergency situation
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="group relative overflow-hidden border-2 border-transparent transition-all hover:border-red-500/20 hover:shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <CardContent className="relative p-6">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500/10 to-red-500/5">
                  <Phone className="h-7 w-7 text-red-500" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">One-Tap SOS</h3>
                <p className="text-muted-foreground">
                  Instantly trigger emergency alerts with a single tap. Includes 5-second countdown to prevent accidental triggers.
                </p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-2 border-transparent transition-all hover:border-blue-500/20 hover:shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <CardContent className="relative p-6">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/5">
                  <MapPin className="h-7 w-7 text-blue-500" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Live Location</h3>
                <p className="text-muted-foreground">
                  Real-time GPS tracking with movement history. Share your exact location with responders instantly.
                </p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-2 border-transparent transition-all hover:border-violet-500/20 hover:shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <CardContent className="relative p-6">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/10 to-violet-500/5">
                  <Users className="h-7 w-7 text-violet-500" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Emergency Contacts</h3>
                <p className="text-muted-foreground">
                  Manage trusted contacts who will be notified instantly when you trigger an emergency alert.
                </p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-2 border-transparent transition-all hover:border-amber-500/20 hover:shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <CardContent className="relative p-6">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-500/5">
                  <Bell className="h-7 w-7 text-amber-500" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Silent SOS Mode</h3>
                <p className="text-muted-foreground">
                  Discreet emergency mode that sends alerts silently without drawing attention in dangerous situations.
                </p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-2 border-transparent transition-all hover:border-emerald-500/20 hover:shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <CardContent className="relative p-6">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5">
                  <Shield className="h-7 w-7 text-emerald-500" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Nearby Services</h3>
                <p className="text-muted-foreground">
                  View hospitals, police stations, and NGOs near you on an interactive map with directions.
                </p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-2 border-transparent transition-all hover:border-cyan-500/20 hover:shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <CardContent className="relative p-6">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/10 to-cyan-500/5">
                  <Lock className="h-7 w-7 text-cyan-500" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Privacy First</h3>
                <p className="text-muted-foreground">
                  Your data is encrypted and only shared during emergencies. Full control over who sees your location.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="border-t border-border bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <Badge variant="outline" className="mb-4">How It Works</Badge>
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              Three Simple Steps to Safety
            </h2>
            <p className="text-lg text-muted-foreground">
              Get protected in minutes with our easy setup process
            </p>
          </div>
          
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            <div className="relative text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-red-600 text-3xl font-bold text-white shadow-xl shadow-red-500/25">
                1
              </div>
              <h3 className="mb-3 text-xl font-semibold">Create Account</h3>
              <p className="text-muted-foreground">
                Sign up in seconds and add your emergency contacts who will be notified in case of emergency.
              </p>
              {/* Connector line */}
              <div className="absolute right-0 top-10 hidden h-0.5 w-1/3 bg-gradient-to-r from-red-500/50 to-transparent md:block" />
            </div>
            
            <div className="relative text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-red-600 text-3xl font-bold text-white shadow-xl shadow-red-500/25">
                2
              </div>
              <h3 className="mb-3 text-xl font-semibold">Enable Location</h3>
              <p className="text-muted-foreground">
                Allow location access so we can share your precise position with responders during emergencies.
              </p>
              <div className="absolute right-0 top-10 hidden h-0.5 w-1/3 bg-gradient-to-r from-red-500/50 to-transparent md:block" />
            </div>
            
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-red-600 text-3xl font-bold text-white shadow-xl shadow-red-500/25">
                3
              </div>
              <h3 className="mb-3 text-xl font-semibold">Stay Protected</h3>
              <p className="text-muted-foreground">
                Press SOS in any emergency. Alerts are sent instantly to your contacts and nearby services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section id="safety" className="py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <Badge variant="outline" className="mb-4">Security & Privacy</Badge>
                <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl">
                  Your Safety & Privacy Are Our Priority
                </h2>
                <p className="mb-8 text-lg text-muted-foreground">
                  Built with hospitality environments in mind, our system provides comprehensive 
                  emergency response capabilities with enterprise-grade security.
                </p>
                <ul className="space-y-4">
                  {[
                    "End-to-end encrypted communications",
                    "GDPR compliant data handling",
                    "24/7 system monitoring and support",
                    "Regular security audits and updates",
                    "Location shared only during emergencies",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                      </div>
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="relative">
                <div className="aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-red-500/20 via-red-500/10 to-transparent p-1">
                  <div className="flex h-full flex-col items-center justify-center rounded-[22px] border border-red-500/20 bg-background/95 p-8 text-center backdrop-blur">
                    <div className="mb-6 relative">
                      <div className="absolute inset-0 animate-ping rounded-full bg-red-500/20" style={{ animationDuration: "2s" }} />
                      <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-xl shadow-red-500/30">
                        <Shield className="h-12 w-12 text-white" />
                      </div>
                    </div>
                    <h3 className="mb-2 text-2xl font-bold">Protected</h3>
                    <p className="text-muted-foreground">
                      Your data and privacy are secured with enterprise-grade protection
                    </p>
                    <div className="mt-6 flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-5 w-5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">Trusted by thousands of users</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden border-t border-border bg-gradient-to-br from-red-500 to-red-600 py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_1px)] bg-[length:24px_24px]" />
        </div>
        <div className="container relative mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-5xl">
            Ready to Get Started?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-lg text-white/80">
            Join thousands of users who trust CrisisResponse for their safety needs. 
            It&apos;s free to use and takes less than a minute to set up.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/login">
              <Button size="lg" variant="secondary" className="gap-2 px-8 h-14 text-lg shadow-xl">
                Create Free Account
                <ChevronRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="gap-2 px-8 h-14 text-lg border-white/30 text-white hover:bg-white/10 hover:text-white">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">CrisisResponse</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built for safety. Designed for peace of mind.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
