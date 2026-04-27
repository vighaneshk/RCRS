"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/lib/app-context"
import { mockNearbyServices } from "@/lib/mock-data"
import { Map } from "@/components/map"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertTriangle,
  MapPin,
  Clock,
  Users,
  Phone,
  Shield,
  Navigation,
  Radio,
  CheckCircle,
  X,
  Building2,
  Siren,
  Heart,
  Wifi,
  Activity,
  Send
} from "lucide-react"

export default function EmergencyPage() {
  const router = useRouter()
  const { activeEmergency, cancelEmergency, emergencyContacts, demoMode, demoAlerts } = useApp()
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [pin, setPin] = useState("")
  const [pinError, setPinError] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    if (!activeEmergency) {
      router.push("/dashboard")
      return
    }

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - new Date(activeEmergency.createdAt).getTime()) / 1000)
      setElapsedTime(elapsed)
    }, 1000)

    return () => clearInterval(interval)
  }, [activeEmergency, router])

  if (!activeEmergency) {
    return null
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleCancel = () => {
    if (cancelEmergency(pin)) {
      setShowCancelDialog(false)
      router.push("/dashboard")
    } else {
      setPinError(true)
      setPin("")
    }
  }

  const nearbyServices = mockNearbyServices.slice(0, 4)
  const notifiedContacts = emergencyContacts.filter(c => c.notifyOnEmergency)

  const getServiceIcon = (type: string) => {
    switch (type) {
      case "hospital": return <Heart className="h-5 w-5" />
      case "police": return <Shield className="h-5 w-5" />
      case "fire": return <Siren className="h-5 w-5" />
      default: return <Users className="h-5 w-5" />
    }
  }

  const getServiceColor = (type: string) => {
    switch (type) {
      case "hospital": return "bg-red-500/10 text-red-500"
      case "police": return "bg-blue-500/10 text-blue-500"
      case "fire": return "bg-orange-500/10 text-orange-500"
      default: return "bg-emerald-500/10 text-emerald-500"
    }
  }

  return (
    <div className="space-y-6">
      {/* Emergency Header */}
      <div className="rounded-2xl border-2 border-red-500 bg-gradient-to-r from-red-500/20 via-red-500/10 to-transparent p-6">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-red-500/30" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-red-500 shadow-lg shadow-red-500/30">
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h1 className="text-2xl font-bold text-red-600">Emergency Active</h1>
              <Badge variant="destructive" className="animate-pulse shadow-lg">
                {activeEmergency.type === "silent" ? "Silent Mode" : "SOS Alert"}
              </Badge>
            </div>
            <p className="mt-1 text-muted-foreground">
              Your location is being shared with emergency contacts and responders
            </p>
          </div>
          <div className="text-center bg-background/80 rounded-xl p-4 border border-red-500/20">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Duration</p>
            <p className="text-4xl font-bold tabular-nums text-red-600">{formatTime(elapsedTime)}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Map Section */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="overflow-hidden border-2">
            <CardHeader className="border-b border-border pb-4 bg-gradient-to-r from-red-500/5 to-transparent">
              <CardTitle className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
                  <MapPin className="h-4 w-4 text-red-500" />
                </div>
                Live Location Tracking
              </CardTitle>
              <CardDescription>
                Real-time tracking of your position • Updates every 10 seconds
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Map
                center={activeEmergency.location}
                userLocation={activeEmergency.location}
                showPath={true}
                locationHistory={activeEmergency.locationHistory}
                height="400px"
              />
              
              {/* Location Info Bar */}
              <div className="border-t border-border p-4 bg-muted/30">
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Navigation className="h-4 w-4 text-red-500" />
                    <span className="font-mono text-sm">
                      {activeEmergency.location.lat.toFixed(6)}, {activeEmergency.location.lng.toFixed(6)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm text-muted-foreground">
                      Accuracy: ±{activeEmergency.location.accuracy || 10}m
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wifi className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-muted-foreground">
                      {activeEmergency.locationHistory.length} updates sent
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Nearby Services */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Building2 className="h-5 w-5 text-primary" />
                Nearby Emergency Services
              </CardTitle>
              <CardDescription>
                Services that have been notified of your emergency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {nearbyServices.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center gap-3 rounded-xl border border-border p-4 bg-gradient-to-r from-muted/30 to-transparent hover:shadow-md transition-shadow"
                  >
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${getServiceColor(service.type)}`}>
                      {getServiceIcon(service.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{service.name}</p>
                      <p className="text-sm text-muted-foreground">{service.distance} km away</p>
                    </div>
                    <Badge variant="outline" className="shrink-0 bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Notified
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status Card */}
          <Card className="border-2 border-red-500/30">
            <CardHeader className="bg-gradient-to-r from-red-500/5 to-transparent">
              <CardTitle className="flex items-center gap-2">
                <Radio className="h-5 w-5 text-red-500" />
                Alert Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Signal Strength</span>
                <div className="flex items-center gap-2">
                  <Progress value={85} className="w-20 h-2" />
                  <span className="text-sm font-medium">Strong</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Started</span>
                <span className="text-sm font-medium">
                  {new Date(activeEmergency.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Type</span>
                <Badge variant={activeEmergency.type === "silent" ? "secondary" : "destructive"}>
                  {activeEmergency.type === "silent" ? "Silent SOS" : "Emergency SOS"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30 animate-pulse">
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Location Updates</span>
                <span className="text-sm font-medium">
                  {activeEmergency.locationHistory.length}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Notified Contacts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-5 w-5 text-primary" />
                Notified Contacts
              </CardTitle>
              <CardDescription>
                {notifiedContacts.length} contacts alerted
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  {notifiedContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 font-semibold text-primary-foreground">
                        {contact.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{contact.name}</p>
                        <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                      </div>
                      <a href={`tel:${contact.phone}`}>
                        <Button size="icon" variant="ghost" className="shrink-0 hover:bg-primary/10 hover:text-primary">
                          <Phone className="h-4 w-4" />
                        </Button>
                      </a>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Demo Alerts Log */}
          {demoMode && demoAlerts.length > 0 && (
            <Card className="border-dashed border-amber-500/30 bg-amber-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Send className="h-4 w-4 text-amber-500" />
                  Demo Alert Log
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[150px]">
                  <div className="space-y-2">
                    {demoAlerts.slice(0, 5).map((alert) => (
                      <div
                        key={alert.id}
                        className="rounded-lg border border-border bg-background p-2.5 text-sm"
                      >
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs capitalize">
                            {alert.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs text-muted-foreground truncate">{alert.recipient}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* Cancel Button */}
          <Button
            variant="outline"
            className="w-full gap-2 h-12 border-2 border-red-500/50 text-red-600 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
            onClick={() => setShowCancelDialog(true)}
          >
            <X className="h-5 w-5" />
            End Emergency
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Only end the emergency when you are safe
          </p>
        </div>
      </div>

      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              End Emergency
            </DialogTitle>
            <DialogDescription>
              Enter your safety PIN to confirm you are safe and end the emergency alert.
              {demoMode && (
                <span className="block mt-2 text-amber-600 font-medium">
                  Demo PIN: 1234
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-center gap-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-14 w-14 rounded-xl border-2 flex items-center justify-center text-2xl font-bold transition-colors ${
                    pin[i] ? "border-primary bg-primary/10" : "border-border"
                  } ${pinError ? "border-red-500 bg-red-500/10" : ""}`}
                >
                  {pin[i] ? "•" : ""}
                </div>
              ))}
            </div>
            <Input
              type="tel"
              placeholder="Enter 4-digit PIN"
              maxLength={4}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value.replace(/\D/g, ""))
                setPinError(false)
              }}
              className="text-center text-lg tracking-widest"
              autoFocus
            />
            {pinError && (
              <p className="text-sm text-red-500 text-center">Incorrect PIN. Please try again.</p>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Continue Emergency
            </Button>
            <Button 
              onClick={handleCancel} 
              disabled={pin.length !== 4}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Confirm Safe
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
