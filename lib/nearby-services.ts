import type { NearbyService } from "./types"

/**
 * Haversine distance (in km) between two lat/lng points.
 */
function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function amenityToType(amenity: string): NearbyService["type"] | null {
  switch (amenity) {
    case "hospital":
    case "clinic":
    case "doctors":
      return "hospital"
    case "police":
      return "police"
    case "fire_station":
      return "fire"
    case "social_facility":
    case "ngo":
    case "charity":
      return "ngo"
    default:
      return null
  }
}

interface OverpassElement {
  type: "node" | "way" | "relation"
  id: number
  lat?: number
  lon?: number
  center?: { lat: number; lon: number }
  tags?: Record<string, string>
}

/**
 * Fetch real nearby emergency services from OpenStreetMap Overpass API.
 * Falls back to an empty array on failure — the caller should handle fallback.
 */
export async function fetchNearbyServices(
  lat: number,
  lng: number,
  radiusMeters = 5000
): Promise<NearbyService[]> {
  const amenities = ["hospital", "clinic", "police", "fire_station", "social_facility"]
  const amenityFilter = amenities.map((a) => `"amenity"="${a}"`).join("|")

  // Build Overpass QL query for nodes + ways within the radius
  const query = `
[out:json][timeout:20];
(
  node["amenity"~"hospital|clinic|police|fire_station|social_facility"](around:${radiusMeters},${lat},${lng});
  way["amenity"~"hospital|clinic|police|fire_station|social_facility"](around:${radiusMeters},${lat},${lng});
);
out center;
`

  const url = "https://overpass-api.de/api/interpreter"
  const response = await fetch(url, {
    method: "POST",
    body: `data=${encodeURIComponent(query)}`,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    signal: AbortSignal.timeout(15000),
  })

  if (!response.ok) throw new Error(`Overpass error: ${response.status}`)

  const data = await response.json()
  const elements: OverpassElement[] = data.elements ?? []

  const services: NearbyService[] = []

  for (const el of elements) {
    const tags = el.tags ?? {}
    const amenity = tags["amenity"] ?? ""
    const type = amenityToType(amenity)
    if (!type) continue

    // Get coordinates (nodes have lat/lon directly; ways have center)
    const elLat = el.lat ?? el.center?.lat
    const elLng = el.lon ?? el.center?.lon
    if (elLat === undefined || elLng === undefined) continue

    const name = tags["name"] || tags["name:en"] || amenity.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    const phone = tags["phone"] || tags["contact:phone"] || tags["emergency"] || (type === "police" || type === "fire" ? "112" : "")
    const street = tags["addr:street"] || ""
    const housenumber = tags["addr:housenumber"] || ""
    const city = tags["addr:city"] || ""
    const address = [housenumber, street, city].filter(Boolean).join(", ") || tags["address"] || `${elLat.toFixed(4)}, ${elLng.toFixed(4)}`

    const distance = Math.round(haversine(lat, lng, elLat, elLng) * 10) / 10

    // Estimate open status: hospitals + police + fire are 24/7; social facilities vary
    const isOpen = type !== "ngo" || tags["opening_hours"] === "24/7" || !tags["opening_hours"]

    services.push({
      id: `osm-${el.type}-${el.id}`,
      name,
      type,
      location: {
        lat: elLat,
        lng: elLng,
        timestamp: new Date(),
        address,
      },
      phone,
      address,
      distance,
      isOpen,
    })
  }

  // Sort by distance ascending
  return services.sort((a, b) => (a.distance ?? 99) - (b.distance ?? 99))
}
