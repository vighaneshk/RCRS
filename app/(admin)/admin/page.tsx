"use client"

import Link from "next/link"
import { useApp } from "@/lib/app-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertTriangle,
  Users,
  MapPin,
  Clock,
  TrendingUp,
  CheckCircle,
  XCircle,
  Activity,
  ChevronRight,
  Phone,
  Eye
} from "lucide-react"

export default function AdminDashboardPage() {
  const { emergencies, demoMode } = useApp()

  const activeEmergencies = emergencies.filter(e => e.status === "active")
  const respondingEmergencies = emergencies.filter(e => e.status === "responding")
  const resolvedEmergencies = emergencies.filter(e => e.status === "resolved")

  const stats = {
    total: emergencies.length,
    active: activeEmergencies.length,
    responding: respondingEmergencies.length,
    resolved: resolvedEmergencies.length,
    responseTime: "2.5 min",
    resolutionRate: "94%",
  }

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
    const now = new Date()
    const diff = Math.floor((now.getTime() - new Date(date).getTime()) / 1000 / 60)
    if (diff < 1) return "Just now"
    if (diff < 60) return `${diff}m ago`
    return `${Math.floor(diff / 60)}h ago`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and manage all emergency responses
          </p>
        </div>
        {demoMode && (
          <Badge variant="outline" className="w-fit bg-primary/10 text-primary">
            Demo Mode Active
          </Badge>
        )}
      </div>

      {/* Active Emergency Alert */}
      {activeEmergencies.length > 0 && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 animate-pulse text-destructive" />
              <div>
                <p className="font-semibold text-destructive">
                  {activeEmergencies.length} Active Emergency{activeEmergencies.length > 1 ? "ies" : ""}
                </p>
                <p className="text-sm text-muted-foreground">
                  Immediate attention required
                </p>
              </div>
            </div>
            <Link href="/admin/emergencies">
              <Button variant="destructive" size="sm" className="gap-1">
                View All
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Emergencies</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-destructive">{stats.active}</p>
            <p className="text-xs text-muted-foreground">
              +{stats.responding} being responded to
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Today</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.total}</p>
            <p className="text-xs text-muted-foreground">
              {stats.resolved} resolved
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.responseTime}</p>
            <p className="flex items-center gap-1 text-xs text-success">
              <TrendingUp className="h-3 w-3" />
              15% faster than yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-success">{stats.resolutionRate}</p>
            <p className="text-xs text-muted-foreground">
              Based on last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Emergencies */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Emergencies</CardTitle>
              <CardDescription>Latest emergency reports</CardDescription>
            </div>
            <Link href="/admin/emergencies">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {emergencies.slice(0, 10).map((emergency) => (
                  <div
                    key={emergency.id}
                    className="flex items-center gap-4 rounded-lg border border-border p-4"
                  >
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
                      ) : emergency.status === "resolved" ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <XCircle className="h-6 w-6" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{emergency.userName}</p>
                        {getStatusBadge(emergency.status)}
                        <Badge variant="outline" className="capitalize">
                          {emergency.type}
                        </Badge>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {emergency.location.address || `${emergency.location.lat.toFixed(4)}, ${emergency.location.lng.toFixed(4)}`}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(emergency.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="gap-1">
                        <Eye className="h-4 w-4" />
                        <span className="hidden sm:inline">View</span>
                      </Button>
                      {emergency.status === "active" && (
                        <Button size="sm" className="gap-1">
                          <Phone className="h-4 w-4" />
                          <span className="hidden sm:inline">Respond</span>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Quick Actions & Staff */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/admin/emergencies">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  View All Emergencies
                </Button>
              </Link>
              <Link href="/admin/staff">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Users className="h-4 w-4" />
                  Manage Staff
                </Button>
              </Link>
              <Link href="/admin/analytics">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <TrendingUp className="h-4 w-4" />
                  View Analytics
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Staff on Duty */}
          <Card>
            <CardHeader>
              <CardTitle>Staff on Duty</CardTitle>
              <CardDescription>Currently available responders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Mike Johnson", role: "Security", status: "available" },
                  { name: "Sarah Williams", role: "Front Desk", status: "busy" },
                  { name: "Tom Anderson", role: "Manager", status: "available" },
                ].map((staff, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-lg border border-border p-3"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                      {staff.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{staff.name}</p>
                      <p className="text-sm text-muted-foreground">{staff.role}</p>
                    </div>
                    <Badge variant={staff.status === "available" ? "default" : "secondary"}>
                      {staff.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Map Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Location Overview</CardTitle>
              <CardDescription>Active emergencies on map</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                <div className="absolute inset-0 opacity-10">
                  <svg className="h-full w-full">
                    <defs>
                      <pattern id="adminGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#adminGrid)" />
                  </svg>
                </div>
                {activeEmergencies.map((emergency, index) => (
                  <div
                    key={emergency.id}
                    className="absolute"
                    style={{
                      left: `${30 + index * 20}%`,
                      top: `${40 + index * 15}%`,
                    }}
                  >
                    <div className="relative">
                      <div className="absolute -inset-2 animate-ping rounded-full bg-destructive/30" />
                      <div className="relative h-4 w-4 rounded-full bg-destructive" />
                    </div>
                  </div>
                ))}
                <div className="absolute bottom-2 right-2 rounded bg-background/90 px-2 py-1 text-xs">
                  {activeEmergencies.length} active
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
