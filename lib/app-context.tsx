"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { auth, googleProvider, db } from "./firebase"
import { signInWithPopup, signOut, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
import { doc, getDoc, setDoc, collection, addDoc, updateDoc } from "firebase/firestore"
import type { User, EmergencyContact, Emergency, Location, DemoAlert, Notification } from "./types"
import { mockUsers, mockEmergencyContacts, mockEmergencies, mockNotifications } from "./mock-data"

interface AppContextType {
  // Auth state
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  demoLogin: (role: "user" | "admin" | "responder") => void
  signup: (userData: { email: string; name: string; phone: string; password: string }) => Promise<boolean>
  signInWithGoogle: () => Promise<boolean>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  
  // Demo mode
  demoMode: boolean
  setDemoMode: (mode: boolean) => void
  demoAlerts: DemoAlert[]
  addDemoAlert: (alert: Omit<DemoAlert, "id" | "timestamp">) => void
  clearDemoAlerts: () => void
  
  // Emergency state
  activeEmergency: Emergency | null
  emergencies: Emergency[]
  triggerSOS: (silent?: boolean) => Promise<void>
  cancelEmergency: (pin: string) => boolean
  updateEmergencyStatus: (id: string, status: Emergency["status"]) => void
  
  // Location
  currentLocation: Location | null
  locationPermission: "granted" | "denied" | "prompt"
  requestLocation: () => Promise<Location | null>
  
  // Emergency contacts
  emergencyContacts: EmergencyContact[]
  addEmergencyContact: (contact: Omit<EmergencyContact, "id" | "userId">) => void
  updateEmergencyContact: (id: string, contact: Partial<EmergencyContact>) => void
  deleteEmergencyContact: (id: string) => void
  
  // Notifications
  notifications: Notification[]
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  unreadCount: number
  isLoading: boolean
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const CANCEL_PIN = process.env.NEXT_PUBLIC_CANCEL_PIN || "1234"

export function AppProvider({ children }: { children: ReactNode }) {
  // Auth state
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // Demo mode
  const [demoMode, setDemoMode] = useState(false)
  const [demoAlerts, setDemoAlerts] = useState<DemoAlert[]>([])
  
  // Emergency state
  const [activeEmergency, setActiveEmergency] = useState<Emergency | null>(null)
  const [emergencies, setEmergencies] = useState<Emergency[]>(mockEmergencies)
  
  // Location
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null)
  const [locationPermission, setLocationPermission] = useState<"granted" | "denied" | "prompt">("prompt")
  
  // Emergency contacts
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(mockEmergencyContacts)
  
  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  
  // Check for existing session on mount
  useEffect(() => {
    if (!auth) {
      console.warn("Firebase Auth is not initialized (missing config).");
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        console.log("Auth state changed: Logged In")
        
        // Optimistically set user data from Firebase to speed up transition
        const initialUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || "",
          name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
          phone: firebaseUser.phoneNumber || "+1 555-0000",
          role: "user",
          createdAt: new Date(),
        }
        
        setUser(prev => prev || initialUser)
        setIsAuthenticated(true)
        setIsLoading(false)

        // Background fetch for full firestore data - NON-BLOCKING
        if (db) {
          getDoc(doc(db, "users", firebaseUser.uid))
            .then((userDoc) => {
            if (userDoc.exists()) {
              console.log("Background profile data fetched.")
              const data = userDoc.data()
              const updatedUser = {
                ...initialUser,
                ...data,
                createdAt: data.createdAt ? new Date(data.createdAt) : initialUser.createdAt
              } as User
              setUser(updatedUser)
              localStorage.setItem("crisis-user", JSON.stringify(updatedUser))
            }
          })
          .catch(err => console.warn("Background data sync error (this is okay):", err))
        }

      } else {
        console.log("Auth state changed: Logged Out")
        const savedUser = localStorage.getItem("crisis-user")
        if (savedUser) {
          const parsed = JSON.parse(savedUser)
          setUser(parsed)
          setIsAuthenticated(true)
        } else {
          setUser(null)
          setIsAuthenticated(false)
        }
        setIsLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])
  
  // Auth functions
  const login = useCallback(async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase not initialized");
    try {
      console.log("Attempting Firebase Email Login...")
      await signInWithEmailAndPassword(auth, email, password)
      return true
    } catch (error: any) {
      console.error("Login error:", error.code)
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        throw new Error("Invalid email or password")
      }
      throw error
    }
  }, [])

  const signup = useCallback(async ({ email, name, phone, password }: { email: string; name: string; phone: string; password: string }) => {
    try {
      console.log("Attempting Firebase Sign Up...")
      const result = await createUserWithEmailAndPassword(auth, email, password)
      const firebaseUser = result.user

      const userData: User = {
        id: firebaseUser.uid,
        email,
        name,
        phone,
        role: "user",
        createdAt: new Date(),
      }

      // Save to Firestore
      if (db) {
        await setDoc(doc(db, "users", firebaseUser.uid), {
          ...userData,
          createdAt: userData.createdAt.toISOString(),
        })
      }

      setUser(userData)
      setIsAuthenticated(true)
      localStorage.setItem("crisis-user", JSON.stringify(userData))
      return true
    } catch (error: any) {
      console.error("Signup error:", error.code)
      if (error.code === "auth/email-already-in-use") {
        throw new Error("Email already in use")
      }
      throw error
    }
  }, [])

  const demoLogin = useCallback((role: "user" | "admin" | "responder") => {
    const demoUsers = {
      user: {
        id: "demo-user-1",
        email: "john@example.com",
        name: "John Doe",
        phone: "+1 555-0123",
        role: "user" as const,
        createdAt: new Date("2024-01-15"),
      },
      admin: {
        id: "demo-admin-1",
        email: "admin@hotel.com",
        name: "Sarah Admin",
        phone: "+1 555-0456",
        role: "admin" as const,
        createdAt: new Date("2024-01-01"),
      },
      responder: {
        id: "demo-responder-1",
        email: "responder@ngo.org",
        name: "Mike Responder",
        phone: "+1 555-0789",
        role: "responder" as const,
        createdAt: new Date("2024-02-01"),
      },
    }
    const selectedUser = demoUsers[role]
    setUser(selectedUser)
    setIsAuthenticated(true)
    setIsLoading(false)
    setDemoMode(true)
    localStorage.setItem("crisis-user", JSON.stringify(selectedUser))
  }, [])

  const signInWithGoogle = useCallback(async () => {
    if (!auth || !googleProvider) return false;
    try {
      // signInWithPopup is the only blocking call — the popup itself
      const result = await signInWithPopup(auth, googleProvider)
      const firebaseUser = result.user

      // Immediately set state from Google profile data (no Firestore wait)
      const userData: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || "",
        name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
        phone: firebaseUser.phoneNumber || "+1 555-0000",
        role: "user",
        createdAt: new Date(),
      }

      setUser(userData)
      setIsAuthenticated(true)
      setIsLoading(false)
      localStorage.setItem("crisis-user", JSON.stringify(userData))

      // Firestore sync runs fully in the background — does NOT delay redirect
      if (db) {
        const userRef = doc(db, "users", firebaseUser.uid)
        getDoc(userRef).then((userDoc) => {
        if (!userDoc.exists()) {
          setDoc(userRef, { ...userData, createdAt: userData.createdAt.toISOString() })
            .catch(err => console.warn("Firestore write error:", err))
        } else {
          const data = userDoc.data()
          const syncedUser = {
            ...userData,
            ...data,
            createdAt: data.createdAt ? new Date(data.createdAt) : userData.createdAt,
          } as User
          setUser(syncedUser)
          localStorage.setItem("crisis-user", JSON.stringify(syncedUser))
        }
        }).catch(err => console.warn("Firestore read error (non-blocking):", err))
      }

      return true
    } catch (error: any) {
      if (error.code === "auth/popup-closed-by-user") {
        return false
      }
      console.error("Google sign in error:", error)
      return false
    }
  }, [])
  
  const logout = useCallback(async () => {
    if (auth) await signOut(auth)
    setUser(null)
    setIsAuthenticated(false)
    setActiveEmergency(null)
    localStorage.removeItem("crisis-user")
  }, [])

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null
      const updated = { ...prev, ...updates }
      localStorage.setItem("crisis-user", JSON.stringify(updated))
      return updated
    })
  }, [])
  
  // Demo alert functions
  const addDemoAlert = useCallback((alert: Omit<DemoAlert, "id" | "timestamp">) => {
    const newAlert: DemoAlert = {
      ...alert,
      id: `alert-${Date.now()}`,
      timestamp: new Date(),
    }
    setDemoAlerts(prev => [newAlert, ...prev])
  }, [])
  
  const clearDemoAlerts = useCallback(() => {
    setDemoAlerts([])
  }, [])
  
  // Location functions
  const requestLocation = useCallback(async (): Promise<Location | null> => {
    if (!navigator.geolocation) {
      setLocationPermission("denied")
      return null
    }
    
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: Location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date(),
          }
          setCurrentLocation(location)
          setLocationPermission("granted")
          resolve(location)
        },
        () => {
          setLocationPermission("denied")
          // Return mock location for demo
          const mockLocation: Location = {
            lat: 40.7128,
            lng: -74.006,
            accuracy: 10,
            timestamp: new Date(),
            address: "123 Demo St, New York, NY",
          }
          setCurrentLocation(mockLocation)
          resolve(mockLocation)
        }
      )
    })
  }, [])
  
  // Emergency functions
  const triggerSOS = useCallback(async (silent = false) => {
    const location = await requestLocation()
    
    if (!user || !location) return
    
    const emergency: Emergency = {
      id: `emergency-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      type: silent ? "silent" : "sos",
      status: "active",
      location,
      locationHistory: [location],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    // Persist to Firestore
    if (db) {
      try {
        await setDoc(doc(db, "emergencies", emergency.id), {
          ...emergency,
          createdAt: emergency.createdAt.toISOString(),
          updatedAt: emergency.updatedAt.toISOString(),
        })
      } catch (error) {
        console.error("Failed to save emergency to firestore:", error)
      }
    }
    
    setActiveEmergency(emergency)
    setEmergencies(prev => [emergency, ...prev])
    
    // Add notification
    const notification: Notification = {
      id: `notif-${Date.now()}`,
      userId: user.id,
      title: silent ? "Silent SOS Activated" : "SOS Alert Sent",
      message: `Emergency alert has been ${silent ? "silently " : ""}sent to your contacts`,
      type: "emergency",
      read: false,
      createdAt: new Date(),
      emergencyId: emergency.id,
    }
    setNotifications(prev => [notification, ...prev])
    
    // Demo alerts
    if (demoMode) {
      emergencyContacts
        .filter(c => c.notifyOnEmergency)
        .forEach(contact => {
          addDemoAlert({
            type: "sms",
            recipient: contact.phone,
            message: `EMERGENCY: ${user.name} needs help! Location: ${location.address || `${location.lat}, ${location.lng}`}`,
            status: "delivered",
          })
        })
      
      addDemoAlert({
        type: "api",
        recipient: "Police Station API",
        message: `Emergency reported at ${location.address || `${location.lat}, ${location.lng}`}`,
        status: "delivered",
      })
      
      addDemoAlert({
        type: "api",
        recipient: "Hospital API",
        message: `Emergency alert: User may need medical assistance`,
        status: "delivered",
      })
    }
    
    // Play sound and vibrate for non-silent SOS
    if (!silent) {
      try {
        if (navigator.vibrate) {
          navigator.vibrate([200, 100, 200, 100, 200])
        }
      } catch {
        // Vibration not supported
      }
    }
  }, [user, requestLocation, demoMode, emergencyContacts, addDemoAlert])
  
  const cancelEmergency = useCallback((pin: string) => {
    if (pin !== CANCEL_PIN) return false
    
    if (activeEmergency) {
      setEmergencies(prev => 
        prev.map(e => 
          e.id === activeEmergency.id 
            ? { ...e, status: "cancelled" as const, resolvedAt: new Date() }
            : e
        )
      )
      
      // Update Firestore
      if (db) {
        updateDoc(doc(db, "emergencies", activeEmergency.id), {
          status: "cancelled",
          resolvedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }).catch(err => console.error("Firestore cancel error:", err))
      }

      setActiveEmergency(null)
      
      if (demoMode) {
        addDemoAlert({
          type: "notification",
          recipient: "All contacts",
          message: "Emergency has been cancelled by user",
          status: "delivered",
        })
      }
    }
    return true
  }, [activeEmergency, demoMode, addDemoAlert])
  
  const updateEmergencyStatus = useCallback((id: string, status: Emergency["status"]) => {
    setEmergencies(prev => 
      prev.map(e => 
        e.id === id 
          ? { ...e, status, updatedAt: new Date(), resolvedAt: status === "resolved" ? new Date() : e.resolvedAt }
          : e
      )
    )

    // Update Firestore
    if (db) {
      updateDoc(doc(db, "emergencies", id), {
        status,
        updatedAt: new Date().toISOString(),
        ...(status === "resolved" && { resolvedAt: new Date().toISOString() })
      }).catch(err => console.error("Firestore status update error:", err))
    }

    if (activeEmergency?.id === id && (status === "resolved" || status === "cancelled")) {
      setActiveEmergency(null)
    }
  }, [activeEmergency])
  
  // Emergency contact functions
  const addEmergencyContact = useCallback((contact: Omit<EmergencyContact, "id" | "userId">) => {
    if (!user) return
    const newContact: EmergencyContact = {
      ...contact,
      id: `contact-${Date.now()}`,
      userId: user.id,
    }
    setEmergencyContacts(prev => [...prev, newContact])
  }, [user])
  
  const updateEmergencyContact = useCallback((id: string, updates: Partial<EmergencyContact>) => {
    setEmergencyContacts(prev => 
      prev.map(c => c.id === id ? { ...c, ...updates } : c)
    )
  }, [])
  
  const deleteEmergencyContact = useCallback((id: string) => {
    setEmergencyContacts(prev => prev.filter(c => c.id !== id))
  }, [])
  
  // Notification functions
  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }, [])

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])
  
  const unreadCount = notifications.filter(n => !n.read).length
  
  // Location tracking for active emergency
  useEffect(() => {
    if (!activeEmergency) return
    
    const interval = setInterval(async () => {
      const location = await requestLocation()
      if (location && activeEmergency) {
        setActiveEmergency(prev => {
          if (!prev) return null
          return {
            ...prev,
            location,
            locationHistory: [...prev.locationHistory, location],
            updatedAt: new Date(),
          }
        })
      }
    }, 10000) // Update every 10 seconds
    
    return () => clearInterval(interval)
  }, [activeEmergency, requestLocation])
  
  return (
    <AppContext.Provider value={{
      user,
      isAuthenticated,
      login,
      demoLogin,
      signup,
      signInWithGoogle,
      logout,
      updateUser,
      demoMode,
      setDemoMode,
      demoAlerts,
      addDemoAlert,
      clearDemoAlerts,
      activeEmergency,
      emergencies,
      triggerSOS,
      cancelEmergency,
      updateEmergencyStatus,
      currentLocation,
      locationPermission,
      requestLocation,
      emergencyContacts,
      addEmergencyContact,
      updateEmergencyContact,
      deleteEmergencyContact,
      notifications,
      markNotificationRead,
      markAllNotificationsRead,
      unreadCount,
      isLoading,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within AppProvider")
  }
  return context
}
