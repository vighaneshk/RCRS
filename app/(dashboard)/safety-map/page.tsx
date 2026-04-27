"use client"

import { useState, useEffect, useCallback } from "react"
import { useApp } from "@/lib/app-context"
import { mockNearbyServices } from "@/lib/mock-data"
import { fetchNearbyServices } from "@/lib/nearby-services"
import { Map } from "@/components/map"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  Building2,
  Shield,
  Heart,
  Siren,
  Users,
  Phone,
  Navigation,
  RefreshCw,
  Search,
  Clock,
  ChevronRight,
  ExternalLink,
  CheckCircle,
  X,
  Star,
  Loader2,
  WifiOff,
} from "lucide-react"
import type { NearbyService } from "@/lib/types"

export default function SafetyMapPage() {
  const { currentLocation, requestLocation, locationPermission } = useApp()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingServices, setIsFetchingServices] = useState(false)
  const [selectedService, setSelectedService] = useState<NearbyService | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [services, setServices] = useState<NearbyService[]>([])
  const [usedFallback, setUsedFallback] = useState(false)
  const [lastFetchedCoords, setLastFetchedCoords] = useState<{ lat: number; lng: number } | null>(null)

  // Fetch real services whenever location changes meaningfully (>200m)
  const loadServices = useCallback(async (lat: number, lng: number, force = false) => {
    if (!force && lastFetchedCoords) {
      const d = Math.abs(lastFetchedCoords.lat - lat) + Math.abs(lastFetchedCoords.lng - lng)
      if (d < 0.002) return // ~200 m threshold – no re-fetch needed
    }
    setIsFetchingServices(true)
    setUsedFallback(false)
    try {
      const real = await fetchNearbyServices(lat, lng, 5000)
      if (real.length > 0) {
        setServices(real)
        setLastFetchedCoords({ lat, lng })
      } else {
        // Nothing found within 5 km – try 10 km
        const wider = await fetchNearbyServices(lat, lng, 10000)
        if (wider.length > 0) {
          setServices(wider)
          setLastFetchedCoords({ lat, lng })
        } else {
          setServices(mockNearbyServices)
          setUsedFallback(true)
        }
      }
    } catch {
      setServices(mockNearbyServices)
      setUsedFallback(true)
    } finally {
      setIsFetchingServices(false)
    }
  }, [lastFetchedCoords])

  // Request location on mount
  useEffect(() => {
    if (!currentLocation) {
      requestLocation().then(loc => {
        if (loc) loadServices(loc.lat, loc.lng)
      })
    } else {
      loadServices(currentLocation.lat, currentLocation.lng)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // When currentLocation updates (e.g. from another page), re-fetch
  useEffect(() => {
    if (currentLocation) loadServices(currentLocation.lat, currentLocation.lng)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLocation?.lat, currentLocation?.lng])

  const handleRefreshLocation = async () => {
    setIsLoading(true)
    const loc = await requestLocation()
    if (loc) await loadServices(loc.lat, loc.lng, true)
    setIsLoading(false)
  }

  const handleMarkerClick = useCallback((service: NearbyService) => {
    setSelectedService(service)
  }, [])

  const getIcon = (type: string) => {
    switch (type) {
      case "hospital": return <Heart className="h-5 w-5" />
      case "police":   return <Shield className="h-5 w-5" />
      case "fire":     return <Siren className="h-5 w-5" />
      case "ngo":      return <Users className="h-5 w-5" />
      default:         return <Building2 className="h-5 w-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "hospital": return "bg-red-500/10 text-red-500 border-red-500/20"
      case "police":   return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "fire":     return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      case "ngo":      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      default:         return "bg-muted text-muted-foreground"
    }
  }

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "hospital": return "bg-red-500 text-white hover:bg-red-600"
      case "police":   return "bg-blue-500 text-white hover:bg-blue-600"
      case "fire":     return "bg-orange-500 text-white hover:bg-orange-600"
      case "ngo":      return "bg-emerald-500 text-white hover:bg-emerald-600"
      default:         return ""
    }
  }

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.address.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = activeFilter === "all" || service.type === activeFilter
    return matchesSearch && matchesFilter
  })

  // Always use full list for summary counts
  const servicesByType = {
    hospital: services.filter(s => s.type === "hospital"),
    police:   services.filter(s => s.type === "police"),
    fire:     services.filter(s => s.type === "fire"),
    ngo:      services.filter(s => s.type === "ngo"),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Safety Map</h1>
          <p className="text-muted-foreground">
            Real nearby hospitals, police stations, and emergency services
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleRefreshLocation}
          disabled={isLoading || isFetchingServices}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading || isFetchingServices ? "animate-spin" : ""}`} />
          Refresh Location
        </Button>
      </div>

      {/* Location Status */}
      <Card className={`border-2 transition-colors ${
        locationPermission === "granted"
          ? "border-emerald-500/30 bg-gradient-to-r from-emerald-500/5 to-transparent"
          : "border-amber-500/30 bg-gradient-to-r from-amber-500/5 to-transparent"
      }`}>
        <CardContent className="flex items-center gap-4 p-4">
          <div className={`flex h-14 w-14 items-center justify-center rounded-full ${
            locationPermission === "granted" ? "bg-emerald-500/10" : "bg-amber-500/10"
          }`}>
            <Navigation className={`h-7 w-7 ${
              locationPermission === "granted" ? "text-emerald-500" : "text-amber-500"
            }`} />
          </div>
          <div className="flex-1">
            <p className="font-semibold">
              {currentLocation
                ? currentLocation.address || `${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}`
                : "Location not available"}
            </p>
            <p className="text-sm text-muted-foreground">
              {currentLocation
                ? `Accuracy: ±${currentLocation.accuracy || 10}m • Last updated: ${new Date(currentLocation.timestamp).toLocaleTimeString()}`
                : "Enable location to see nearby services"}
            </p>
          </div>
          {isFetchingServices && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Finding services…
            </div>
          )}
          {usedFallback && !isFetchingServices && (
            <Badge variant="outline" className="gap-1 text-amber-600 border-amber-500/30 bg-amber-500/10">
              <WifiOff className="h-3 w-3" />
              Demo data
            </Badge>
          )}
          {locationPermission !== "granted" && (
            <Button onClick={handleRefreshLocation} className="gap-2">
              <MapPin className="h-4 w-4" />
              Enable Location
            </Button>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Map Section */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <Map
                center={currentLocation}
                userLocation={currentLocation}
                markers={filteredServices}
                selectedService={selectedService}
                onMarkerClick={handleMarkerClick}
                height="450px"
              />
            </CardContent>
          </Card>

          {/* Selected Service Detail */}
          {selectedService && (
            <Card className="border-2 border-primary/30 bg-gradient-to-r from-primary/5 to-transparent animate-in slide-in-from-bottom-2">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl ${getTypeColor(selectedService.type)}`}>
                    {getIcon(selectedService.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{selectedService.name}</h3>
                          {selectedService.isOpen && (
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Open
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground">{selectedService.address}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedService(null)}
                        className="shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MapPin className="h-4 w-4 text-blue-500" />
                        {selectedService.distance} km away
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="h-4 w-4 text-amber-500" />
                        {selectedService.isOpen ? "Open 24/7" : "Hours vary"}
                      </div>
                      {selectedService.phone && (
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Phone className="h-4 w-4 text-emerald-500" />
                          {selectedService.phone}
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex gap-2">
                      {selectedService.phone && (
                        <a href={`tel:${selectedService.phone}`} className="flex-1">
                          <Button className={`w-full gap-2 ${getTypeBadgeColor(selectedService.type)}`}>
                            <Phone className="h-4 w-4" />
                            Call Now
                          </Button>
                        </a>
                      )}
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${selectedService.location.lat},${selectedService.location.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" className="gap-2">
                          <ExternalLink className="h-4 w-4" />
                          Directions
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Services List */}
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Tabs */}
          <Tabs value={activeFilter} onValueChange={setActiveFilter}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all" className="text-xs flex flex-col gap-0.5 h-auto py-1.5">
                <Building2 className="h-3.5 w-3.5" />
                <span>All</span>
              </TabsTrigger>
              <TabsTrigger value="hospital" className="text-xs flex flex-col gap-0.5 h-auto py-1.5">
                <Heart className="h-3.5 w-3.5 text-red-500" />
                <span>Hospital</span>
              </TabsTrigger>
              <TabsTrigger value="police" className="text-xs flex flex-col gap-0.5 h-auto py-1.5">
                <Shield className="h-3.5 w-3.5 text-blue-500" />
                <span>Police</span>
              </TabsTrigger>
              <TabsTrigger value="fire" className="text-xs flex flex-col gap-0.5 h-auto py-1.5">
                <Siren className="h-3.5 w-3.5 text-orange-500" />
                <span>Fire</span>
              </TabsTrigger>
              <TabsTrigger value="ngo" className="text-xs flex flex-col gap-0.5 h-auto py-1.5">
                <Users className="h-3.5 w-3.5 text-emerald-500" />
                <span>NGO</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeFilter} className="mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    {activeFilter === "all"
                      ? "All Services"
                      : activeFilter === "hospital"
                        ? "Hospitals"
                        : activeFilter === "police"
                          ? "Police Stations"
                          : activeFilter === "fire"
                            ? "Fire Stations"
                            : "NGOs & Shelters"}
                    {isFetchingServices && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                  </CardTitle>
                  <CardDescription>
                    {isFetchingServices
                      ? "Searching near your location…"
                      : `${filteredServices.length} found near you`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-2">
                  <ScrollArea className="h-[350px]">
                    <div className="space-y-2 p-2">
                      {isFetchingServices ? (
                        // Loading skeleton
                        Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="flex items-center gap-3 rounded-lg border border-border p-3 animate-pulse">
                            <div className="h-11 w-11 rounded-lg bg-muted shrink-0" />
                            <div className="flex-1 space-y-2">
                              <div className="h-4 w-3/4 rounded bg-muted" />
                              <div className="h-3 w-1/2 rounded bg-muted" />
                            </div>
                          </div>
                        ))
                      ) : filteredServices.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <Search className="h-10 w-10 text-muted-foreground/50 mb-2" />
                          <p className="text-muted-foreground">No services found</p>
                          <p className="text-sm text-muted-foreground/70">Try a different search term</p>
                        </div>
                      ) : (
                        filteredServices.map((service) => (
                          <button
                            key={service.id}
                            type="button"
                            onClick={() => setSelectedService(service)}
                            className={`w-full rounded-lg border p-3 text-left transition-all hover:shadow-md ${
                              selectedService?.id === service.id
                                ? "border-primary bg-primary/5 shadow-md"
                                : "border-border hover:border-primary/30 hover:bg-muted/50"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${getTypeColor(service.type)}`}>
                                {getIcon(service.type)}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate font-medium">{service.name}</p>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <span>{service.distance} km</span>
                                  <span>•</span>
                                  <span className={service.isOpen ? "text-emerald-600" : "text-amber-600"}>
                                    {service.isOpen ? "Open" : "Closed"}
                                  </span>
                                </div>
                              </div>
                              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2">
            <Card
              className="relative overflow-hidden border-red-500/20 hover:border-red-500/40 transition-colors cursor-pointer"
              onClick={() => setActiveFilter("hospital")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent" />
              <CardContent className="relative p-3">
                <div className="flex items-center justify-between mb-1">
                  <Heart className="h-4 w-4 text-red-500" />
                  <p className="text-2xl font-bold text-red-500">
                    {isFetchingServices ? <Loader2 className="h-5 w-5 animate-spin" /> : servicesByType.hospital.length}
                  </p>
                </div>
                <p className="text-xs font-medium text-muted-foreground">Hospitals</p>
                <p className="text-xs text-muted-foreground/70 truncate">
                  {servicesByType.hospital[0]?.name ?? (isFetchingServices ? "Searching…" : "None found")}
                </p>
              </CardContent>
            </Card>
            <Card
              className="relative overflow-hidden border-blue-500/20 hover:border-blue-500/40 transition-colors cursor-pointer"
              onClick={() => setActiveFilter("police")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />
              <CardContent className="relative p-3">
                <div className="flex items-center justify-between mb-1">
                  <Shield className="h-4 w-4 text-blue-500" />
                  <p className="text-2xl font-bold text-blue-500">
                    {isFetchingServices ? <Loader2 className="h-5 w-5 animate-spin" /> : servicesByType.police.length}
                  </p>
                </div>
                <p className="text-xs font-medium text-muted-foreground">Police Stations</p>
                <p className="text-xs text-muted-foreground/70 truncate">
                  {servicesByType.police[0]?.name ?? (isFetchingServices ? "Searching…" : "None found")}
                </p>
              </CardContent>
            </Card>
            <Card
              className="relative overflow-hidden border-orange-500/20 hover:border-orange-500/40 transition-colors cursor-pointer"
              onClick={() => setActiveFilter("fire")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent" />
              <CardContent className="relative p-3">
                <div className="flex items-center justify-between mb-1">
                  <Siren className="h-4 w-4 text-orange-500" />
                  <p className="text-2xl font-bold text-orange-500">
                    {isFetchingServices ? <Loader2 className="h-5 w-5 animate-spin" /> : servicesByType.fire.length}
                  </p>
                </div>
                <p className="text-xs font-medium text-muted-foreground">Fire Stations</p>
                <p className="text-xs text-muted-foreground/70 truncate">
                  {servicesByType.fire[0]?.name ?? (isFetchingServices ? "Searching…" : "None found")}
                </p>
              </CardContent>
            </Card>
            <Card
              className="relative overflow-hidden border-emerald-500/20 hover:border-emerald-500/40 transition-colors cursor-pointer"
              onClick={() => setActiveFilter("ngo")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent" />
              <CardContent className="relative p-3">
                <div className="flex items-center justify-between mb-1">
                  <Users className="h-4 w-4 text-emerald-500" />
                  <p className="text-2xl font-bold text-emerald-500">
                    {isFetchingServices ? <Loader2 className="h-5 w-5 animate-spin" /> : servicesByType.ngo.length}
                  </p>
                </div>
                <p className="text-xs font-medium text-muted-foreground">NGOs &amp; Shelters</p>
                <p className="text-xs text-muted-foreground/70 truncate">
                  {servicesByType.ngo[0]?.name ?? (isFetchingServices ? "Searching…" : "None found")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
