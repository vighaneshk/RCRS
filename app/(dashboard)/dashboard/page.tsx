"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useApp } from "@/lib/app-context"
import { SOSButton } from "@/components/sos-button"
import { DemoAlerts } from "@/components/demo-alerts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  MapPin, 
  Users, 
  Shield, 
  Activity,
  AlertTriangle,
  Phone,
  ChevronRight,
  RefreshCw,
  Zap,
  Clock,
  Heart,
  Wifi,
  WifiOff,
  CheckCircle2
} from "lucide-react"

export default function DashboardPage() {
  const { 
    user, 
    currentLocation, 
    requestLocation, 
    locationPermission,
    emergencyContacts,
    activeEmergency,
    demoMode
  } = useApp()
  const [isRequestingLocation, setIsRequestingLocation] = useState(false)
  const [safetyTip, setSafetyTip] = useState(0)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isOnline, setIsOnline] = useState(true)

  const safetyTips = [
    { tip: "Keep your phone charged and emergency contacts updated.", icon: Zap },
    { tip: "Share your location with trusted contacts when traveling.", icon: MapPin },
    { tip: "Know the emergency numbers for your current location.", icon: Phone },
    { tip: "Practice using the SOS feature so you are prepared.", icon: Shield },
    { tip: "Keep the app accessible on your home screen.", icon: Activity },
  ]

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setSafetyTip((prev) => (prev + 1) % safetyTips.length)
    }, 8000)
    
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Online status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    setIsOnline(navigator.onLine)

    return () => {
      clearInterval(tipInterval)
      clearInterval(timeInterval)
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [safetyTips.length])

  const handleRequestLocation = async () => {
    setIsRequestingLocation(true)
    await requestLocation()
    setIsRequestingLocation(false)
  }

  const contactsWithNotify = emergencyContacts.filter(c => c.notifyOnEmergency)
  const safetyScore = Math.min(100, 
    (currentLocation ? 30 : 0) + 
    (contactsWithNotify.length * 15) + 
    (locationPermission === "granted" ? 20 : 0) +
    (user?.phone ? 10 : 0)
  )

  const TipIcon = safetyTips[safetyTip].icon

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {user?.name?.split(" ")[0]}
          </h1>
          <p className="text-muted-foreground">
            {currentTime.toLocaleDateString("en-US", { 
              weekday: "long", 
              month: "long", 
              day: "numeric" 
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {demoMode && (
            <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">
              Demo Mode
            </Badge>
          )}
          <Badge 
            variant="outline" 
            className={isOnline 
              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" 
              : "bg-red-500/10 text-red-600 border-red-500/30"
            }
          >
            {isOnline ? <Wifi className="mr-1 h-3 w-3" /> : <WifiOff className="mr-1 h-3 w-3" />}
            {isOnline ? "Online" : "Offline"}
          </Badge>
        </div>
      </div>

      {/* Active Emergency Warning */}
      {activeEmergency && (
        <Card className="border-2 border-red-500 bg-gradient-to-r from-red-500/10 to-red-500/5 animate-pulse">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-red-600">Emergency Active</p>
                <p className="text-sm text-muted-foreground">
                  Your location is being shared with responders
                </p>
              </div>
            </div>
            <Link href="/emergency">
              <Button variant="destructive" className="gap-2 shadow-lg">
                View Tracking
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Main SOS Section */}
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <CardContent className="p-8">
          <div className="flex flex-col items-center gap-8 text-center lg:flex-row lg:text-left">
            {/* SOS Buttons */}
            <div className="flex flex-col items-center gap-4">
              <SOSButton size="large" />
              <p className="text-sm text-muted-foreground max-w-[200px]">
                Hold for 1 second to activate emergency alert
              </p>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-6">
              <div>
                <h2 className="text-2xl font-bold">Emergency SOS</h2>
                <p className="mt-1 text-muted-foreground">
                  Instantly alert your emergency contacts and nearby services
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 lg:justify-start">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
                    <Users className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-bold">{contactsWithNotify.length}</p>
                    <p className="text-xs text-muted-foreground">Contacts</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10">
                    <Clock className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-bold">5s</p>
                    <p className="text-xs text-muted-foreground">Countdown</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
                    <Zap className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-bold">{"<"}1s</p>
                    <p className="text-xs text-muted-foreground">Alert Time</p>
                  </div>
                </div>
              </div>

              {/* Silent SOS */}
              <div className="flex items-center gap-4 rounded-lg border border-dashed border-border bg-background/50 p-4">
                <SOSButton size="default" silent />
                <div className="text-left">
                  <p className="font-medium">Silent SOS</p>
                  <p className="text-sm text-muted-foreground">
                    Discreet alert without sound or vibration
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Safety Score */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Safety Score</CardTitle>
            <Shield className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent className="relative">
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-emerald-600">{safetyScore}</span>
              <span className="mb-1 text-sm text-muted-foreground">/100</span>
            </div>
            <Progress value={safetyScore} className="mt-2 h-2" />
            <p className="mt-2 text-xs text-muted-foreground">
              {safetyScore >= 80 ? "Excellent protection" : 
               safetyScore >= 50 ? "Good, add more contacts" : 
               "Enable location & add contacts"}
            </p>
          </CardContent>
        </Card>

        {/* Location Status */}
        <Card className="relative overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${
            currentLocation ? "from-blue-500/5" : "from-amber-500/5"
          } to-transparent`} />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Location</CardTitle>
            <MapPin className={`h-4 w-4 ${currentLocation ? "text-blue-500" : "text-amber-500"}`} />
          </CardHeader>
          <CardContent className="relative">
            {currentLocation ? (
              <>
                <p className="flex items-center gap-1 text-lg font-semibold text-blue-600">
                  <CheckCircle2 className="h-4 w-4" />
                  Active
                </p>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {currentLocation.address || `${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}`}
                </p>
              </>
            ) : locationPermission === "denied" ? (
              <>
                <p className="text-lg font-semibold text-red-600">Denied</p>
                <p className="mt-1 text-xs text-muted-foreground">Enable in browser settings</p>
              </>
            ) : (
              <>
                <p className="text-lg font-semibold text-amber-600">Not Set</p>
                <Button 
                  variant="link" 
                  size="sm" 
                  className="mt-1 h-auto p-0 text-xs"
                  onClick={handleRequestLocation}
                  disabled={isRequestingLocation}
                >
                  {isRequestingLocation ? (
                    <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                  ) : null}
                  Enable Location
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contacts</CardTitle>
            <Users className="h-4 w-4 text-violet-500" />
          </CardHeader>
          <CardContent className="relative">
            <p className="text-3xl font-bold">{emergencyContacts.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {contactsWithNotify.length} will receive alerts
            </p>
            {emergencyContacts.length === 0 && (
              <Link href="/contacts">
                <Button variant="link" size="sm" className="mt-1 h-auto p-0 text-xs">
                  Add contacts
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        {/* Quick Call */}
        <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emergency Call</CardTitle>
            <Phone className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent className="relative">
            <a href="tel:911" className="block">
              <Button 
                variant="outline" 
                size="lg"
                className="w-full gap-2 border-red-500/30 text-red-600 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors"
              >
                <Phone className="h-5 w-5" />
                Call 911
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Demo Alerts */}
        <DemoAlerts />

        {/* Safety Tips */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2 text-base">
              <Heart className="h-5 w-5 text-red-500" />
              Safety Tip
            </CardTitle>
            <CardDescription>Stay prepared with these reminders</CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <TipIcon className="h-5 w-5 text-primary" />
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {safetyTips[safetyTip].tip}
              </p>
            </div>
            <div className="mt-6 flex gap-1.5">
              {safetyTips.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSafetyTip(i)}
                  className={`h-1.5 flex-1 rounded-full transition-all ${
                    i === safetyTip ? "bg-primary" : "bg-muted hover:bg-muted-foreground/20"
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/contacts">
              <Button variant="outline" className="w-full h-auto flex-col gap-2 py-4 hover:bg-primary/5 hover:border-primary/30 transition-colors">
                <Users className="h-6 w-6 text-violet-500" />
                <span>Manage Contacts</span>
              </Button>
            </Link>
            <Link href="/safety-map">
              <Button variant="outline" className="w-full h-auto flex-col gap-2 py-4 hover:bg-primary/5 hover:border-primary/30 transition-colors">
                <MapPin className="h-6 w-6 text-blue-500" />
                <span>Safety Map</span>
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="outline" className="w-full h-auto flex-col gap-2 py-4 hover:bg-primary/5 hover:border-primary/30 transition-colors">
                <Activity className="h-6 w-6 text-emerald-500" />
                <span>Medical Info</span>
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="w-full h-auto flex-col gap-2 py-4 hover:bg-primary/5 hover:border-primary/30 transition-colors"
              onClick={handleRequestLocation}
            >
              <RefreshCw className={`h-6 w-6 text-amber-500 ${isRequestingLocation ? "animate-spin" : ""}`} />
              <span>Update Location</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
