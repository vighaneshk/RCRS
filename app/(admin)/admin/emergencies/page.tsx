"use client"

import { useState } from "react"
import { useApp } from "@/lib/app-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  Search,
  Filter,
  Phone,
  Eye,
  Navigation,
  Radio,
  User
} from "lucide-react"
import type { Emergency } from "@/lib/types"

export default function EmergenciesPage() {
  const { emergencies, updateEmergencyStatus, demoMode, addDemoAlert } = useApp()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedEmergency, setSelectedEmergency] = useState<Emergency | null>(null)
  const [isAssigning, setIsAssigning] = useState(false)

  const filteredEmergencies = emergencies.filter((emergency) => {
    const matchesSearch = emergency.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         emergency.location.address?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || emergency.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="destructive">Active</Badge>
      case "responding":
        return <Badge className="bg-warning text-warning-foreground">Responding</Badge>
      case "resolved":
        return <Badge variant="secondary">Resolved</Badge>
      case "cancelled":
        return <Badge variant="outline">Cancelled</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleString()
  }

  const formatDuration = (start: Date, end?: Date) => {
    const endTime = end ? new Date(end) : new Date()
    const diff = Math.floor((endTime.getTime() - new Date(start).getTime()) / 1000 / 60)
    if (diff < 60) return `${diff} min`
    return `${Math.floor(diff / 60)}h ${diff % 60}m`
  }

  const handleRespond = (emergency: Emergency) => {
    updateEmergencyStatus(emergency.id, "responding")
    if (demoMode) {
      addDemoAlert({
        type: "notification",
        recipient: emergency.userName,
        message: "A responder has been assigned to your emergency",
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
        message: "Your emergency has been marked as resolved",
        status: "delivered",
      })
    }
    setSelectedEmergency(null)
  }

  const stats = {
    active: emergencies.filter(e => e.status === "active").length,
    responding: emergencies.filter(e => e.status === "responding").length,
    resolved: emergencies.filter(e => e.status === "resolved").length,
    cancelled: emergencies.filter(e => e.status === "cancelled").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Emergency Management</h1>
        <p className="text-muted-foreground">
          Monitor and manage all emergency alerts
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className={stats.active > 0 ? "border-destructive" : ""}>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.active}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/10">
              <Users className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.responding}</p>
              <p className="text-sm text-muted-foreground">Responding</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.resolved}</p>
              <p className="text-sm text-muted-foreground">Resolved</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <XCircle className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.cancelled}</p>
              <p className="text-sm text-muted-foreground">Cancelled</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="responding">Responding</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Emergency List */}
      <Card>
        <CardHeader>
          <CardTitle>All Emergencies</CardTitle>
          <CardDescription>{filteredEmergencies.length} emergencies found</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <div className="space-y-4">
              {filteredEmergencies.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <AlertTriangle className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-lg font-medium">No emergencies found</p>
                  <p className="text-sm text-muted-foreground">
                    {searchQuery || statusFilter !== "all" 
                      ? "Try adjusting your filters"
                      : "All clear! No emergencies reported."
                    }
                  </p>
                </div>
              ) : (
                filteredEmergencies.map((emergency) => (
                  <div
                    key={emergency.id}
                    className={`rounded-lg border p-4 transition-colors ${
                      emergency.status === "active" 
                        ? "border-destructive bg-destructive/5" 
                        : "border-border"
                    }`}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                          emergency.status === "active" 
                            ? "bg-destructive/10 text-destructive" 
                            : emergency.status === "responding"
                              ? "bg-warning/10 text-warning"
                              : "bg-muted text-muted-foreground"
                        }`}>
                          {emergency.status === "active" ? (
                            <AlertTriangle className="h-6 w-6" />
                          ) : emergency.status === "responding" ? (
                            <Users className="h-6 w-6" />
                          ) : (
                            <CheckCircle className="h-6 w-6" />
                          )}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold">{emergency.userName}</p>
                            {getStatusBadge(emergency.status)}
                            <Badge variant="outline" className="capitalize">
                              {emergency.type}
                            </Badge>
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {emergency.location.address || `${emergency.location.lat.toFixed(4)}, ${emergency.location.lng.toFixed(4)}`}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {formatTime(emergency.createdAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Radio className="h-4 w-4" />
                              Duration: {formatDuration(emergency.createdAt, emergency.resolvedAt)}
                            </span>
                          </div>
                          {emergency.responderId && (
                            <div className="mt-2 flex items-center gap-1 text-sm">
                              <User className="h-4 w-4" />
                              <span>Responder: {emergency.responderName}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedEmergency(emergency)}
                        >
                          <Eye className="mr-1 h-4 w-4" />
                          Details
                        </Button>
                        {emergency.status === "active" && (
                          <Button 
                            size="sm"
                            onClick={() => handleRespond(emergency)}
                          >
                            <Phone className="mr-1 h-4 w-4" />
                            Respond
                          </Button>
                        )}
                        {emergency.status === "responding" && (
                          <Button 
                            size="sm"
                            variant="secondary"
                            onClick={() => handleResolve(emergency)}
                          >
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Resolve
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Emergency Detail Dialog */}
      <Dialog open={!!selectedEmergency} onOpenChange={() => setSelectedEmergency(null)}>
        <DialogContent className="max-w-2xl">
          {selectedEmergency && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  Emergency Details
                  {getStatusBadge(selectedEmergency.status)}
                </DialogTitle>
                <DialogDescription>
                  ID: {selectedEmergency.id}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* User Info */}
                <div className="flex items-center gap-4 rounded-lg border border-border p-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                    {selectedEmergency.userName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{selectedEmergency.userName}</p>
                    <p className="text-sm text-muted-foreground">User ID: {selectedEmergency.userId}</p>
                  </div>
                </div>

                {/* Location Map */}
                <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                  <div className="absolute inset-0 opacity-10">
                    <svg className="h-full w-full">
                      <defs>
                        <pattern id="detailGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#detailGrid)" />
                    </svg>
                  </div>
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="absolute -inset-4 animate-ping rounded-full bg-destructive/30" />
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-destructive shadow-lg">
                      <Navigation className="h-5 w-5 text-destructive-foreground" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 rounded-lg bg-background/90 px-3 py-2 backdrop-blur">
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-medium">
                      {selectedEmergency.location.address || 
                       `${selectedEmergency.location.lat.toFixed(6)}, ${selectedEmergency.location.lng.toFixed(6)}`}
                    </p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium capitalize">{selectedEmergency.type}</p>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-sm text-muted-foreground">Started</p>
                    <p className="font-medium">{formatTime(selectedEmergency.createdAt)}</p>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium">{formatDuration(selectedEmergency.createdAt, selectedEmergency.resolvedAt)}</p>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-sm text-muted-foreground">Location Updates</p>
                    <p className="font-medium">{selectedEmergency.locationHistory.length}</p>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedEmergency(null)}>
                  Close
                </Button>
                {selectedEmergency.status === "active" && (
                  <Button onClick={() => handleRespond(selectedEmergency)}>
                    <Phone className="mr-2 h-4 w-4" />
                    Assign Responder
                  </Button>
                )}
                {selectedEmergency.status === "responding" && (
                  <Button onClick={() => handleResolve(selectedEmergency)}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark Resolved
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
