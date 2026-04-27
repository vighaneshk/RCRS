export interface User {
  id: string
  email: string
  name: string
  phone: string
  avatar?: string
  role: "user" | "admin" | "responder"
  medicalInfo?: MedicalInfo
  createdAt: Date
}

export interface MedicalInfo {
  bloodType?: string
  allergies?: string[]
  medications?: string[]
  conditions?: string[]
  emergencyNotes?: string
}

export interface EmergencyContact {
  id: string
  userId: string
  name: string
  phone: string
  email?: string
  relationship: string
  isPrimary: boolean
  notifyOnEmergency: boolean
}

export interface Emergency {
  id: string
  userId: string
  userName: string
  type: "sos" | "silent" | "fall" | "motion"
  status: "active" | "responding" | "resolved" | "cancelled"
  location: Location
  locationHistory: Location[]
  createdAt: Date
  updatedAt: Date
  resolvedAt?: Date
  responderId?: string
  responderName?: string
  notes?: string
}

export interface Location {
  lat: number
  lng: number
  accuracy?: number
  timestamp: Date
  address?: string
}

export interface NearbyService {
  id: string
  name: string
  type: "hospital" | "police" | "ngo" | "fire"
  location: Location
  phone: string
  address: string
  distance?: number
  isOpen?: boolean
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: "emergency" | "alert" | "info" | "success"
  read: boolean
  createdAt: Date
  emergencyId?: string
}

export interface DemoAlert {
  id: string
  type: "sms" | "call" | "notification" | "api"
  recipient: string
  message: string
  timestamp: Date
  status: "sent" | "delivered" | "failed"
}
