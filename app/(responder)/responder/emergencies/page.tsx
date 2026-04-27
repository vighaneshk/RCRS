"use client"

import { useState } from "react"
import { useApp } from "@/lib/app-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertTriangle,
  MapPin,
  Clock,
  User,
  Phone,
  CheckCircle,
  Navigation,
  Search,
  Filter,
  Activity,
  Shield,
  MessageSquare,
} from "lucide-react"
import type { Emergency } from "@/lib/types"

const statusColors: Record<string, string> = {
  active: "bg-red-500/10 text-red-600 border-red-500/30",
  responding: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  resolved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  cancelled: "bg-slate-500/10 text-slate-600 border-slate-500/30",
}

export default function ResponderEmergenciesPage() {
  const { emergencies, updateEmergencyStatus, user } = useApp()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedEmergency, setSelectedEmergency] = useState<Emergency | null>(null)
  const [notes, setNotes] = useState("")

  const filtered = emergencies.filter(e => {
    const matchesSearch =
      e.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.location.address || "").toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || e.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatTime = (date: Date) => {
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000 / 60)
    if (diff < 1) return "Just now"
    if (diff < 60) return `${diff}m ago`
    return `${Math.floor(diff / 60)}h ${diff % 60}m ago`
  }

  const handleRespond = (emergency: Emergency) => {
    updateEmergencyStatus(emergency.id, "responding")
    setSelectedEmergency(null)
  }

  const handleResolve = (emergency: Emergency) => {
    updateEmergencyStatus(emergency.id, "resolved")
    setSelectedEmergency(null)
    setNotes("")
  }

  const stats = {
    active: emergencies.filter(e => e.status === "active").length,
    responding: emergencies.filter(e => e.status === "responding").length,
    resolved: emergencies.filter(e => e.status === "resolved").length,
    total: emergencies.length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Emergency Response</h1>
        <p className="text-muted-foreground">Monitor and respond to active emergencies</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Active", value: stats.active, color: "text-red-500", bg: "from-red-500/5" },
          { label: "Responding", value: stats.responding, color: "text-amber-500", bg: "from-amber-500/5" },
          { label: "Resolved", value: stats.resolved, color: "text-emerald-500", bg: "from-emerald-500/5" },
          { label: "Total Today", value: stats.total, color: "text-primary", bg: "from-primary/5" },
        ].map(stat => (
          <Card key={stat.label} className="relative overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bg} to-transparent`} />
            <CardContent className="relative flex items-center gap-3 p-4">
              <div>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Emergency Alert Banner */}
      {stats.active > 0 && (
        <Card className="border-2 border-red-500 bg-gradient-to-r from-red-500/10 to-red-500/5">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertTriangle className="h-6 w-6 text-red-500 animate-pulse" />
            <div className="flex-1">
              <p className="font-semibold text-red-600">{stats.active} active emergency{stats.active > 1 ? "ies" : ""} require immediate attention</p>
              <p className="text-sm text-muted-foreground">Click on an emergency below to respond</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by person or location..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="responding">Responding</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Emergency List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Shield className="h-10 w-10 text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No emergencies found</p>
            </CardContent>
          </Card>
        ) : (
          filtered.map(emergency => (
            <Card
              key={emergency.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                emergency.status === "active" ? "border-red-500/50 bg-red-500/5" : ""
              }`}
              onClick={() => setSelectedEmergency(emergency)}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${
                  emergency.status === "active" ? "bg-red-500/10 text-red-500" :
                  emergency.status === "responding" ? "bg-amber-500/10 text-amber-500" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {emergency.status === "active" ? (
                    <AlertTriangle className="h-7 w-7 animate-pulse" />
                  ) : emergency.status === "responding" ? (
                    <Activity className="h-7 w-7" />
                  ) : (
                    <CheckCircle className="h-7 w-7" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="font-semibold">{emergency.userName}</p>
                    <Badge variant="outline" className={statusColors[emergency.status]}>{emergency.status}</Badge>
                    <Badge variant="outline" className="capitalize">{emergency.type === "silent" ? "Silent SOS" : "SOS Alert"}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {emergency.location.address || `${emergency.location.lat.toFixed(4)}, ${emergency.location.lng.toFixed(4)}`}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {formatTime(emergency.createdAt)}
                    </span>
                  </div>
                  {emergency.responderName && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Responder: {emergency.responderName}
                    </p>
                  )}
                </div>
                <div className="shrink-0">
                  {emergency.status === "active" && (
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                      onClick={e => { e.stopPropagation(); handleRespond(emergency) }}
                    >
                      Respond
                    </Button>
                  )}
                  {emergency.status === "responding" && (
                    <Button
                      size="sm"
                      className="bg-emerald-500 hover:bg-emerald-600 text-white"
                      onClick={e => { e.stopPropagation(); handleResolve(emergency) }}
                    >
                      Resolve
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Emergency Detail Dialog */}
      <Dialog open={!!selectedEmergency} onOpenChange={open => !open && setSelectedEmergency(null)}>
        {selectedEmergency && (
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className={`h-5 w-5 ${selectedEmergency.status === "active" ? "text-red-500" : "text-amber-500"}`} />
                Emergency Details
              </DialogTitle>
              <DialogDescription>
                Incident #{selectedEmergency.id.slice(-6).toUpperCase()}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { label: "Person", value: selectedEmergency.userName, icon: User },
                  { label: "Type", value: selectedEmergency.type === "silent" ? "Silent SOS" : "SOS Alert", icon: AlertTriangle },
                  { label: "Status", value: selectedEmergency.status, icon: Activity },
                  { label: "Started", value: new Date(selectedEmergency.createdAt).toLocaleTimeString(), icon: Clock },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="rounded-lg border border-border p-3 space-y-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Icon className="h-3.5 w-3.5" />
                      <span className="text-xs">{label}</span>
                    </div>
                    <p className="font-medium capitalize">{value}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-lg border border-border p-3">
                <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="text-xs">Location</span>
                </div>
                <p className="font-medium">{selectedEmergency.location.address || `${selectedEmergency.location.lat.toFixed(6)}, ${selectedEmergency.location.lng.toFixed(6)}`}</p>
                <a
                  href={`https://www.google.com/maps?q=${selectedEmergency.location.lat},${selectedEmergency.location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                >
                  <Navigation className="h-3 w-3" />Open in Maps
                </a>
              </div>
              {selectedEmergency.status !== "resolved" && selectedEmergency.status !== "cancelled" && (
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-sm font-medium">
                    <MessageSquare className="h-4 w-4" />Responder Notes
                  </label>
                  <Input
                    placeholder="Add notes about the situation..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                  />
                </div>
              )}
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setSelectedEmergency(null)}>Close</Button>
              {selectedEmergency.status === "active" && (
                <Button className="bg-amber-500 hover:bg-amber-600 text-white" onClick={() => handleRespond(selectedEmergency)}>
                  Mark as Responding
                </Button>
              )}
              {selectedEmergency.status === "responding" && (
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => handleResolve(selectedEmergency)}>
                  <CheckCircle className="mr-2 h-4 w-4" />Mark Resolved
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
