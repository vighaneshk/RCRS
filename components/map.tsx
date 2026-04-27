"use client"

import { useEffect, useRef, useState } from "react"
import type { Location, NearbyService } from "@/lib/types"

interface MapProps {
  center?: Location | null
  markers?: NearbyService[]
  userLocation?: Location | null
  onMarkerClick?: (service: NearbyService) => void
  selectedService?: NearbyService | null
  showPath?: boolean
  locationHistory?: Location[]
  className?: string
  height?: string
}

declare global {
  interface Window {
    L: typeof import("leaflet")
  }
}

export function Map({
  center,
  markers = [],
  userLocation,
  onMarkerClick,
  selectedService,
  showPath = false,
  locationHistory = [],
  className = "",
  height = "400px"
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<import("leaflet").Map | null>(null)
  const markersRef = useRef<import("leaflet").Marker[]>([])
  const userMarkerRef = useRef<import("leaflet").Marker | null>(null)
  const pathRef = useRef<import("leaflet").Polyline | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load Leaflet
  useEffect(() => {
    if (typeof window === "undefined") return
    
    // Check if already loaded
    if (window.L) {
      setIsLoaded(true)
      return
    }

    // Load CSS
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    document.head.appendChild(link)

    // Load JS
    const script = document.createElement("script")
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    script.onload = () => setIsLoaded(true)
    document.body.appendChild(script)

    return () => {
      // Cleanup on unmount
    }
  }, [])

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstanceRef.current) return

    const L = window.L
    const defaultCenter = center || userLocation || { lat: 40.7128, lng: -74.006 }
    
    const map = L.map(mapRef.current).setView([defaultCenter.lat, defaultCenter.lng], 14)
    
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map)

    mapInstanceRef.current = map

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [isLoaded, center, userLocation])

  // Update center
  useEffect(() => {
    if (!mapInstanceRef.current || !center) return
    mapInstanceRef.current.setView([center.lat, center.lng], 14)
  }, [center])

  // Update user location marker
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current) return
    const L = window.L

    // Remove old marker
    if (userMarkerRef.current) {
      userMarkerRef.current.remove()
    }

    if (userLocation) {
      const userIcon = L.divIcon({
        className: "custom-user-marker",
        html: `
          <div style="
            width: 24px;
            height: 24px;
            background: #dc2626;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              width: 8px;
              height: 8px;
              background: white;
              border-radius: 50%;
            "></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      })

      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup("Your Location")
    }
  }, [isLoaded, userLocation])

  // Update service markers
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current) return
    const L = window.L

    // Remove old markers
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []

    // Add new markers
    markers.forEach(service => {
      const colors: Record<string, string> = {
        hospital: "#ef4444",
        police: "#3b82f6",
        fire: "#f97316",
        ngo: "#22c55e"
      }
      
      const icons: Record<string, string> = {
        hospital: "H",
        police: "P",
        fire: "F",
        ngo: "N"
      }

      const isSelected = selectedService?.id === service.id
      const size = isSelected ? 36 : 28

      const icon = L.divIcon({
        className: "custom-service-marker",
        html: `
          <div style="
            width: ${size}px;
            height: ${size}px;
            background: ${colors[service.type] || "#6b7280"};
            border: 2px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: ${isSelected ? 14 : 12}px;
            transition: all 0.2s;
            ${isSelected ? "transform: scale(1.2);" : ""}
          ">${icons[service.type] || "S"}</div>
        `,
        iconSize: [size, size],
        iconAnchor: [size/2, size/2]
      })

      const marker = L.marker([service.location.lat, service.location.lng], { icon })
        .addTo(mapInstanceRef.current!)
        .bindPopup(`
          <div style="min-width: 150px;">
            <strong>${service.name}</strong><br>
            <span style="color: #666;">${service.address}</span><br>
            <span style="color: #666;">${service.distance} km away</span>
          </div>
        `)

      if (onMarkerClick) {
        marker.on("click", () => onMarkerClick(service))
      }

      markersRef.current.push(marker)
    })
  }, [isLoaded, markers, selectedService, onMarkerClick])

  // Update path
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current || !showPath) return
    const L = window.L

    // Remove old path
    if (pathRef.current) {
      pathRef.current.remove()
    }

    if (locationHistory.length > 1) {
      const coords = locationHistory.map(loc => [loc.lat, loc.lng] as [number, number])
      pathRef.current = L.polyline(coords, {
        color: "#dc2626",
        weight: 3,
        opacity: 0.7,
        dashArray: "10, 5"
      }).addTo(mapInstanceRef.current)
    }
  }, [isLoaded, showPath, locationHistory])

  if (!isLoaded) {
    return (
      <div 
        className={`flex items-center justify-center bg-muted ${className}`}
        style={{ height }}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <span className="text-sm text-muted-foreground">Loading map...</span>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={mapRef} 
      className={`rounded-lg ${className}`}
      style={{ height, width: "100%" }}
    />
  )
}
