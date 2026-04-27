"use client"

import { useApp } from "@/lib/app-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  MessageSquare, 
  Bell, 
  Radio, 
  Trash2, 
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  Smartphone,
  Server
} from "lucide-react"

export function DemoAlerts() {
  const { demoMode, demoAlerts, clearDemoAlerts } = useApp()

  if (!demoMode) {
    return (
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-transparent" />
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-2 text-base">
            <Radio className="h-5 w-5 text-muted-foreground" />
            Alert Activity
          </CardTitle>
          <CardDescription>
            Enable demo mode to see simulated alerts
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
              <Bell className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Demo mode is disabled</p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Toggle demo mode in the header to test alerts
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "sms":
        return <Smartphone className="h-4 w-4" />
      case "notification":
        return <Bell className="h-4 w-4" />
      case "api":
        return <Server className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case "sms":
        return "bg-blue-500/10 text-blue-500 border-blue-500/30"
      case "notification":
        return "bg-violet-500/10 text-violet-500 border-violet-500/30"
      case "api":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
      case "pending":
        return <Clock className="h-3.5 w-3.5 text-amber-500" />
      case "failed":
        return <AlertCircle className="h-3.5 w-3.5 text-red-500" />
      default:
        return null
    }
  }

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent" />
      <CardHeader className="relative flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <Send className="h-5 w-5 text-amber-500" />
            Demo Alert Log
          </CardTitle>
          <CardDescription>
            {demoAlerts.length} simulated alerts sent
          </CardDescription>
        </div>
        {demoAlerts.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearDemoAlerts}
            className="gap-1 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </Button>
        )}
      </CardHeader>
      <CardContent className="relative">
        {demoAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 mb-3">
              <Radio className="h-7 w-7 text-amber-500" />
            </div>
            <p className="font-medium">No alerts yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Trigger an SOS to see demo alerts
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[250px] -mr-4 pr-4">
            <div className="space-y-2">
              {demoAlerts.map((alert, index) => (
                <div
                  key={alert.id}
                  className="rounded-lg border border-border bg-background p-3 transition-all hover:shadow-sm animate-in slide-in-from-top-1"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`gap-1 text-xs ${getAlertColor(alert.type)}`}
                      >
                        {getAlertIcon(alert.type)}
                        {alert.type.toUpperCase()}
                      </Badge>
                      {getStatusIcon(alert.status)}
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-medium">{alert.recipient}</p>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    {alert.message}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
