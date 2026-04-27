"use client"

import { useState } from "react"
import Link from "next/link"
import { useApp } from "@/lib/app-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
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
  CheckCircle,
  XCircle,
  Users,
  Phone,
  Navigation,
  ChevronRight,
  Radio,
  Shield,
  Activity
} from "lucide-react"
import type { Emergency } from "@/lib/types"

export default function ResponderDashboardPage() {
  const { user, emergencies, updateEmergencyStatus, demoMode, addDemoAlert } = useApp()
  const [isAvailable, setIsAvailable] = useState(true)
  const [selectedEmergency, setSelectedEmergency] = useState<Emergency | null>(null)

  const activeEmergencies = emergencies.filter(e => e.status === "active")
  const myResponding = emergencies.filter(e => e.status === "responding" && e.responderId === user?.id)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="destructive">Active</Badge>
      case "responding":
        return <Badge className="bg-warning text-warning-foreground">Responding</Badge>
      case "resolved":
        return <Badge variant="secondary">Resolved</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = Math.floor((now.getTime() - new Date(date).getTime()) / 1000 / 60)
    if (diff < 1) return "Just now"
    if (diff < 60) return `${diff} min ago`
    return `${Math.floor(diff / 60)}h ${diff % 60}m ago`
  }

  const handleAccept = (emergency: Emergency) => {
    updateEmergencyStatus(emergency.id, "responding")
    if (demoMode) {
      addDemoAlert({
        type: "notification",
        recipient: emergency.userName,
        message: `${user?.name} is responding to your emergency`,
        status: "delivered",
      })
    }
    setSelectedEmergency(null)
  }

  const handleResolve = (emergency: Emergency) => {
    updateEmergencyStatus(emergency.id, "resolved")
    if (demoMode) {
      addDemoAlert({
        type: "notification",
        recipient: emergency.userName,
        message: "Your emergency has been resolved",
        status: "delivered",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Responder Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-3">
            <span className="text-sm">Available</span>
            <Switch
              checked={isAvailable}
              onCheckedChange={setIsAvailable}
            />
            <Badge variant={isAvailable ? "default" : "secondary"}>
              {isAvailable ? "Online" : "Offline"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Active Emergency Alert */}
      {activeEmergencies.length > 0 && isAvailable && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 animate-pulse text-destructive" />
              <div>
                <p className="font-semibold text-destructive">
                  {activeEmergencies.length} Active Emergency{activeEmergencies.length > 1 ? "ies" : ""} Nearby
                </p>
                <p className="text-sm text-muted-foreground">
                  Accept to respond
                </p>
              </div>
            </div>
            <Button 
              variant="destructive" 
              size="sm" 
              className="gap-1"
              onClick={() => setSelectedEmergency(activeEmergencies[0])}
            >
              View
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${isAvailable ? "bg-success" : "bg-muted"}`} />
              <p className="text-lg font-semibold">{isAvailable ? "Available" : "Offline"}</p>
            </div>
            <p className="text-xs text-muted-foreground">
              {isAvailable ? "Ready to respond" : "Not accepting emergencies"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Nearby</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-destructive">{activeEmergencies.length}</p>
            <p className="text-xs text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Currently Handling</CardTitle>
            <Users className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{myResponding.length}</p>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-success">
              {emergencies.filter(e => e.status === "resolved").length}
            </p>
            <p className="text-xs text-muted-foreground">Great work!</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Emergencies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Active Emergencies
            </CardTitle>
            <CardDescription>Emergencies awaiting response</CardDescription>
          </CardHeader>
          <CardContent>
            {activeEmergencies.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Shield className="mb-3 h-12 w-12 text-muted-foreground" />
                <p className="font-medium">All Clear</p>
                <p className="text-sm text-muted-foreground">No active emergencies nearby</p>
              </div>
            ) : (
              <ScrollArea className="h-[300px]">
                <div className="space-y-3">
                  {activeEmergencies.map((emergency) => (
                    <div
                      key={emergency.id}
                      className="rounded-lg border border-destructive/50 bg-destructive/5 p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{emergency.userName}</p>
                            <Badge variant="outline" className="capitalize">{emergency.type}</Badge>
                          </div>
                          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {emergency.location.address || `${emergency.location.lat.toFixed(4)}, ${emergency.location.lng.toFixed(4)}`}
                          </div>
                          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {formatTime(emergency.createdAt)}
                          </div>
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => setSelectedEmergency(emergency)}
                        >
                          Accept
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* My Current Responses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radio className="h-5 w-5 text-warning" />
              My Active Responses
            </CardTitle>
            <CardDescription>Emergencies you are responding to</CardDescription>
          </CardHeader>
          <CardContent>
            {myResponding.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Users className="mb-3 h-12 w-12 text-muted-foreground" />
                <p className="font-medium">No Active Responses</p>
                <p className="text-sm text-muted-foreground">Accept an emergency to start responding</p>
              </div>
            ) : (
              <ScrollArea className="h-[300px]">
                <div className="space-y-3">
                  {myResponding.map((emergency) => (
                    <div
                      key={emergency.id}
                      className="rounded-lg border border-warning/50 bg-warning/5 p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{emergency.userName}</p>
                            {getStatusBadge(emergency.status)}
                          </div>
                          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {emergency.location.address || `${emergency.location.lat.toFixed(4)}, ${emergency.location.lng.toFixed(4)}`}
                          </div>
                          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            Started {formatTime(emergency.createdAt)}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleResolve(emergency)}
                          >
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Resolve
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-3">
            <Link href="/responder/emergencies">
              <Button variant="outline" className="w-full justify-start gap-2">
                <AlertTriangle className="h-4 w-4" />
                View All Emergencies
              </Button>
            </Link>
            <Link href="/responder/map">
              <Button variant="outline" className="w-full justify-start gap-2">
                <MapPin className="h-4 w-4" />
                Open Map View
              </Button>
            </Link>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Phone className="h-4 w-4" />
              Contact Dispatch
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Accept Emergency Dialog */}
      <Dialog open={!!selectedEmergency} onOpenChange={() => setSelectedEmergency(null)}>
        <DialogContent>
          {selectedEmergency && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Emergency Alert
                </DialogTitle>
                <DialogDescription>
                  Review and accept to respond
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 rounded-lg border border-border p-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                    {selectedEmergency.userName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{selectedEmergency.userName}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">Active</Badge>
                      <Badge variant="outline" className="capitalize">{selectedEmergency.type}</Badge>
                    </div>
                  </div>
                </div>

                {/* Mini Map */}
                <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                  <div className="absolute inset-0 opacity-10">
                    <svg className="h-full w-full">
                      <defs>
                        <pattern id="responderGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="1"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#responderGrid)" />
                    </svg>
                  </div>
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="absolute -inset-4 animate-ping rounded-full bg-destructive/30" />
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-destructive shadow-lg">
                      <Navigation className="h-5 w-5 text-destructive-foreground" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {selectedEmergency.location.address || 
                       `${selectedEmergency.location.lat.toFixed(4)}, ${selectedEmergency.location.lng.toFixed(4)}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Started {formatTime(selectedEmergency.createdAt)}</span>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedEmergency(null)}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Decline
                </Button>
                <Button onClick={() => handleAccept(selectedEmergency)}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Accept & Respond
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
