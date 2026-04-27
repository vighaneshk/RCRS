"use client"

import { useApp } from "@/lib/app-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Clock,
  MapPin,
  Users,
  Activity,
  Shield,
  BarChart2,
} from "lucide-react"

const monthlyData = [
  { month: "Nov", count: 12, resolved: 11 },
  { month: "Dec", count: 15, resolved: 14 },
  { month: "Jan", count: 9, resolved: 9 },
  { month: "Feb", count: 18, resolved: 16 },
  { month: "Mar", count: 21, resolved: 19 },
  { month: "Apr", count: 14, resolved: 14 },
]

const typeBreakdown = [
  { type: "SOS Alert", count: 38, color: "bg-red-500", pct: 54 },
  { type: "Silent SOS", count: 19, color: "bg-violet-500", pct: 27 },
  { type: "Fall Detection", count: 8, color: "bg-amber-500", pct: 11 },
  { type: "Motion Alert", count: 5, color: "bg-blue-500", pct: 7 },
]

const locationBreakdown = [
  { area: "Hotel Rooms", count: 29, pct: 41 },
  { area: "Lobby", count: 18, pct: 26 },
  { area: "Parking", count: 12, pct: 17 },
  { area: "Pool Area", count: 7, pct: 10 },
  { area: "Restaurant", count: 4, pct: 6 },
]

export default function AnalyticsPage() {
  const { emergencies } = useApp()

  const totalResolved = emergencies.filter(e => e.status === "resolved").length
  const totalCancelled = emergencies.filter(e => e.status === "cancelled").length
  const active = emergencies.filter(e => e.status === "active").length
  const maxBar = Math.max(...monthlyData.map(d => d.count))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Emergency response performance and trends</p>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Emergencies", value: emergencies.length, icon: AlertTriangle, color: "text-red-500", trend: "+12% this month", up: true },
          { label: "Resolution Rate", value: emergencies.length ? `${Math.round(((totalResolved + totalCancelled) / emergencies.length) * 100)}%` : "N/A", icon: CheckCircle, color: "text-emerald-500", trend: "+5% vs last month", up: true },
          { label: "Avg Response Time", value: "2.5 min", icon: Clock, color: "text-amber-500", trend: "-15% faster", up: true },
          { label: "Active Now", value: active, icon: Activity, color: active > 0 ? "text-red-500" : "text-muted-foreground", trend: active > 0 ? "Requires attention" : "All clear", up: false },
        ].map(kpi => (
          <Card key={kpi.label} className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-transparent" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <CardTitle className="text-sm font-medium">{kpi.label}</CardTitle>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent className="relative">
              <p className="text-3xl font-bold">{kpi.value}</p>
              <p className={`mt-1 flex items-center gap-1 text-xs ${kpi.up ? "text-emerald-600" : "text-muted-foreground"}`}>
                {kpi.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {kpi.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly bar chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-primary" />
              Monthly Emergency Volume
            </CardTitle>
            <CardDescription>Total incidents vs resolved (last 6 months)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3 h-48">
              {monthlyData.map(d => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col justify-end gap-0.5" style={{ height: "170px" }}>
                    <div
                      className="w-full rounded-t bg-primary/20 relative"
                      style={{ height: `${(d.count / maxBar) * 160}px` }}
                    >
                      <div
                        className="absolute bottom-0 w-full rounded-t bg-primary transition-all"
                        style={{ height: `${(d.resolved / maxBar) * 160}px` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{d.month}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="h-2 w-4 rounded bg-primary/20 inline-block" />Total</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-4 rounded bg-primary inline-block" />Resolved</span>
            </div>
          </CardContent>
        </Card>

        {/* Type breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Emergency Types
            </CardTitle>
            <CardDescription>Breakdown by alert type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {typeBreakdown.map(item => (
              <div key={item.type} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.type}</span>
                  <span className="text-muted-foreground">{item.count} ({item.pct}%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className={`h-full rounded-full ${item.color} transition-all`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Location breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Hotspot Locations
            </CardTitle>
            <CardDescription>Where most emergencies occur</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {locationBreakdown.map((loc, i) => (
              <div key={loc.area} className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {i + 1}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{loc.area}</span>
                    <span className="text-muted-foreground">{loc.count} incidents</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${loc.pct}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Response performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Response Team Performance
            </CardTitle>
            <CardDescription>Top responders this month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: "Mike Johnson", handled: 14, avg: "1.8 min", rate: "100%" },
              { name: "Sarah Williams", handled: 11, avg: "2.2 min", rate: "91%" },
              { name: "Tom Anderson", handled: 9, avg: "2.9 min", rate: "89%" },
              { name: "Lisa Chen", handled: 7, avg: "3.1 min", rate: "86%" },
            ].map((r, i) => (
              <div key={r.name} className="flex items-center gap-3 rounded-lg border border-border p-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                  i === 0 ? "bg-amber-500/10 text-amber-600" : "bg-primary/10 text-primary"
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.handled} cases • avg {r.avg}</p>
                </div>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                  {r.rate}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
