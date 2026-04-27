"use client"

import { useState, useEffect } from "react"
import { useApp } from "@/lib/app-context"
import { mockNearbyServices } from "@/lib/mock-data"
import { Map } from "@/components/map"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Navigation,
  RefreshCw,
  AlertTriangle,
  Heart,
  Shield,
  Siren,
  Users,
  Phone,
  ExternalLink,
  Activity,
} from "lucide-react"
import type { NearbyService } from "@/lib/types"

const typeColors: Record<string, string> = {
  hospital: "bg-red-500/10 text-red-500",
  police: "bg-blue-500/10 text-blue-500",
  fire: "bg-orange-500/10 text-orange-500",
  ngo: "bg-emerald-500/10 text-emerald-500",
}

const TypeIcon = ({ type }: { type: string }) => {
  switch(type) {
    case "hospital": return <Heart className="h-5 w-5" />
    case "police": return <Shield className="h-5 w-5" />
    case "fire": return <Siren className="h-5 w-5" />
    default: return <Users className="h-5 w-5" />
  }
}

export default function ResponderMapPage() {
  const { currentLocation, requestLocation, emergencies } = useApp()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedService, setSelectedService] = useState<NearbyService | null>(null)

  const activeEmergencies = emergencies.filter(e => e.status === "active" || e.status === "responding")

  useEffect(() => {
    if (!currentLocation) requestLocation()
  }, [currentLocation, requestLocation])

  const handleRefresh = async () => {
    setIsLoading(true)
    await requestLocation()
    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Map View</h1>
          <p className="text-muted-foreground">Live emergency locations and nearby services</p>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={isLoading} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh Location
        </Button>
      </div>

      {/* Location Status */}
      <Card className="border-2">
        <CardContent className="flex items-center gap-4 p-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-full ${currentLocation ? "bg-emerald-500/10" : "bg-amber-500/10"}`}>
            <Navigation className={`h-6 w-6 ${currentLocation ? "text-emerald-500" : "text-amber-500"}`} />
          </div>
          <div className="flex-1">
            <p className="font-semibold">
              {currentLocation
                ? currentLocation.address || `${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}`
                : "Location not available"}
            </p>
            <p className="text-sm text-muted-foreground">
              {currentLocation
                ? `Last updated: ${new Date(currentLocation.timestamp).toLocaleTimeString()} • Accuracy: ±${currentLocation.accuracy || 10}m`
                : "Enable location to see the map"}
            </p>
          </div>
          {activeEmergencies.length > 0 && (
            <Badge variant="destructive" className="animate-pulse gap-1">
              <AlertTriangle className="h-3 w-3" />
              {activeEmergencies.length} Active
            </Badge>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Map */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <Map
                center={currentLocation}
                userLocation={currentLocation}
                markers={mockNearbyServices}
                selectedService={selectedService}
                onMarkerClick={setSelectedService}
                height="500px"
              />
            </CardContent>
          </Card>

          {/* Nearby Services on Map */}
          {selectedService && (
            <Card className="border-2 border-primary/30 bg-primary/5">
              <CardContent className="flex items-start gap-4 p-4">
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${typeColors[selectedService.type]}`}>
                  <TypeIcon type={selectedService.type} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">{selectedService.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedService.address}</p>
                      <p className="text-sm text-muted-foreground mt-1">{selectedService.distance} km away</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedService(null)}>✕</Button>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <a href={`tel:${selectedService.phone}`} className="flex-1">
                      <Button size="sm" className="w-full gap-1">
                        <Phone className="h-3.5 w-3.5" />Call
                      </Button>
                    </a>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${selectedService.location.lat},${selectedService.location.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm" className="gap-1">
                        <ExternalLink className="h-3.5 w-3.5" />Directions
                      </Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Active Emergencies */}
          <Card className="border-2 border-red-500/30">
            <CardHeader className="pb-3 bg-red-500/5">
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="h-5 w-5 text-red-500" />
                Active Incidents
                {activeEmergencies.length > 0 && (
                  <Badge variant="destructive" className="ml-auto">{activeEmergencies.length}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              {activeEmergencies.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No active emergencies</p>
              ) : (
                <div className="space-y-2">
                  {activeEmergencies.map(emergency => (
                    <div key={emergency.id} className="rounded-lg border border-border p-3 bg-background">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className={`h-4 w-4 ${emergency.status === "active" ? "text-red-500 animate-pulse" : "text-amber-500"}`} />
                        <span className="font-medium text-sm">{emergency.userName}</span>
                        <Badge variant="outline" className={`ml-auto text-xs ${emergency.status === "active" ? "bg-red-500/10 text-red-600 border-red-500/30" : "bg-amber-500/10 text-amber-600 border-amber-500/30"}`}>
                          {emergency.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {emergency.location.address || `${emergency.location.lat.toFixed(4)}, ${emergency.location.lng.toFixed(4)}`}
                      </p>
                      <a
                        href={`https://www.google.com/maps?q=${emergency.location.lat},${emergency.location.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        <Navigation className="h-3 w-3" />Navigate to location
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Nearby Services List */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Nearby Services</CardTitle>
              <CardDescription>{mockNearbyServices.length} services nearby</CardDescription>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-2">
                {mockNearbyServices.slice(0, 6).map(service => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => setSelectedService(service)}
                    className={`w-full rounded-lg border p-3 text-left transition-all hover:shadow-sm ${
                      selectedService?.id === service.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${typeColors[service.type]}`}>
                        <TypeIcon type={service.type} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{service.name}</p>
                        <p className="text-xs text-muted-foreground">{service.distance} km away</p>
                      </div>
                      {service.isOpen && (
                        <Badge variant="outline" className="shrink-0 bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-xs">Open</Badge>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
